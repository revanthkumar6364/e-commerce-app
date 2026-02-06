const User = require('../models/User');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

const userController = {
    // Get user wallet and coupons
    getWallet: async (req, res) => {
        try {
            const userId = req.headers['user-id']; // Simple identification for now
            if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            res.status(200).json({
                success: true,
                walletCoins: user.walletCoins,
                coupons: user.coupons,
                tier: user.tier || 'SILVER'
            });
        } catch (error) {
            console.error('Get Wallet Error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Exchange coins for a coupon
    exchangeCoins: async (req, res) => {
        try {
            const userId = req.headers['user-id'] || '65c1a2b3e4b0c1a2b3e4b0c1'; // Fallback for dev
            const { rewardType } = req.body; // 'COUPON_10', 'COUPON_25', 'COUPON_50'

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            const rates = {
                'COUPON_10': { coins: 500, discount: 10, code: `VIP10-${Date.now().toString().slice(-4)}` },
                'COUPON_25': { coins: 1000, discount: 25, code: `LUXE25-${Date.now().toString().slice(-4)}` },
                'COUPON_50': { coins: 2000, discount: 50, code: `PLAT50-${Date.now().toString().slice(-4)}` }
            };

            const selection = rates[rewardType];
            if (!selection) return res.status(400).json({ success: false, message: 'Invalid reward selection' });

            if (user.walletCoins < selection.coins) {
                return res.status(400).json({ success: false, message: 'Insufficient coins' });
            }

            // Deduct coins and add coupon
            user.walletCoins -= selection.coins;
            user.coupons.push({
                code: selection.code,
                discount: selection.discount,
                isUsed: false
            });

            await user.save();

            res.json({
                success: true,
                message: `Successfully exchanged coins for ${selection.discount}% Off Coupon!`,
                newBalance: user.walletCoins,
                coupon: selection.code
            });
        } catch (error) {
            console.error('Exchange Coins Error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Update user profile
    updateProfile: async (req, res) => {
        try {
            const userId = req.headers['user-id'];
            if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

            const { name, phone, email, profileImage } = req.body;

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            if (name !== undefined) user.name = name;
            if (phone !== undefined) user.phone = phone;
            if (email !== undefined) user.email = email;
            if (profileImage !== undefined) user.profileImage = profileImage;

            await user.save();

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    profileImage: user.profileImage,
                    walletCoins: user.walletCoins,
                    tier: user.tier
                }
            });
        } catch (error) {
            console.error('Update Profile Error:', error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ success: false, message: error.message });
            }
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Place a new order
    placeOrder: async (req, res) => {
        try {
            const userId = req.headers['user-id'];
            if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

            const { items, totalAmount, address } = req.body;

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();

            const newOrder = new Order({
                orderId,
                customerId: userId,
                customerEmail: user.email,
                customerPhone: user.phone || '9999999999',
                items: items.map(item => ({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    qty: item.qty || 1,
                    image: item.image
                })),
                total: totalAmount,
                address: address,
                status: 'Confirmed'
            });

            await newOrder.save();

            // Award Coins (5% of total amount)
            const earnedCoins = Math.floor(totalAmount * 0.05);
            user.walletCoins += earnedCoins;

            // Update Tier based on coins
            if (user.walletCoins >= 2000) {
                user.tier = 'PLATINUM';
            } else if (user.walletCoins >= 500) {
                user.tier = 'GOLD';
            } else {
                user.tier = 'SILVER';
            }

            await user.save();

            // Simulate Email/SMS Notification
            console.log(`[NOTIFICATION SERVICE] Sending order confirmation email to: ${user.email}`);
            console.log(`[NOTIFICATION SERVICE] Sending SMS alert to: ${user.phone || 'N/A'}`);
            console.log(`[REWARDS] User earned ${earnedCoins} coins. New balance: ${user.walletCoins}. Tier: ${user.tier}`);

            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                order: newOrder,
                earnedCoins
            });
        } catch (error) {
            console.error('Place Order Error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Send OTP for payment
    sendOTP: async (req, res) => {
        try {
            const userId = req.headers['user-id'];
            const { method } = req.body; // 'email' or 'sms'

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
            await user.save();

            const target = method === 'sms' ? (user.phone || '9999999999') : user.email;

            // Log to Notification model
            const notification = new Notification({
                userId: user._id,
                type: method === 'sms' ? 'SMS' : 'EMAIL',
                title: 'Payment Verification OTP',
                message: `Your OTP for the luxury purchase is ${otp}. It expires in 10 minutes.`,
                target: target,
                status: 'SENT'
            });
            await notification.save();

            console.log(`[BACKEND OTP] OTP ${otp} sent via ${method} to ${target}`);

            res.status(200).json({
                success: true,
                message: `OTP sent successfully to your ${method}`
            });
        } catch (error) {
            console.error('Send OTP Error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Verify OTP
    verifyOTP: async (req, res) => {
        try {
            const userId = req.headers['user-id'];
            const { otp } = req.body;

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            if (!user.otp || user.otp !== otp || new Date() > user.otpExpiry) {
                return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
            }

            // Clear OTP after successful use
            user.otp = null;
            user.otpExpiry = null;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'OTP verified successfully'
            });
        } catch (error) {
            console.error('Verify OTP Error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get notifications
    getNotifications: async (req, res) => {
        try {
            const userId = req.headers['user-id'];
            if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

            const notifications = await Notification.find({ userId: userId }).sort({ createdAt: -1 }).limit(20);

            res.status(200).json({
                success: true,
                notifications
            });
        } catch (error) {
            console.error('Get Notifications Error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get user orders
    getOrders: async (req, res) => {
        try {
            const userId = req.headers['user-id'];
            if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

            const orders = await Order.find({ customerId: userId }).sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                orders
            });
        } catch (error) {
            console.error('Get Orders Error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
};

module.exports = userController;
