const Order = require('../models/Order');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

const orderController = {
    // Create a new order after payment success
    createOrder: async (req, res) => {
        try {
            const { items, total, customerEmail, customerPhone, customerId } = req.body;

            // Generate a simple unique Order ID
            const orderId = 'ORD' + Date.now().toString().slice(-8).toUpperCase();

            const newOrder = new Order({
                orderId,
                items,
                total,
                customerEmail,
                customerPhone,
                customerId: customerId || null
            });

            await newOrder.save();

            // Award Coins to user if logged in
            if (customerId) {
                const User = require('../models/User');
                const coinsEarned = Math.floor(total * 0.1); // 10% rewards
                await User.findByIdAndUpdate(customerId, {
                    $inc: { walletCoins: coinsEarned }
                });
                console.log(`[REWARDS] Awarded ${coinsEarned} coins to user ${customerId}`);
            }

            // Trigger Notifications
            try {
                await emailService.sendOrderConfirmation(customerEmail, newOrder);
                await smsService.sendOrderConfirmation(customerPhone, orderId);

                // Also send payment success confirmation as requested
                await emailService.sendPaymentSuccess(customerEmail, orderId, total);
                await smsService.sendPaymentSuccess(customerPhone, orderId, total);
            } catch (notifyErr) {
                console.warn('Order saved but notifications failed:', notifyErr.message);
            }

            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                orderId
            });
        } catch (error) {
            console.error('Create Order Error:', error);
            res.status(500).json({ success: false, message: 'Failed to create order' });
        }
    },

    // Track an order by ID
    trackOrder: async (req, res) => {
        try {
            const { orderId } = req.params;
            const order = await Order.findOne({ orderId });

            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }

            res.status(200).json({ success: true, order });
        } catch (error) {
            console.error('Track Order Error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
};

module.exports = orderController;
