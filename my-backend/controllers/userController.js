const User = require('../models/User');

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
                tier: user.walletCoins > 1000 ? 'PLATINUM' : 'SILVER'
            });
        } catch (error) {
            console.error('Get Wallet Error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Exchange coins for a coupon
    exchangeCoins: async (req, res) => {
        try {
            const userId = req.headers['user-id'];
            if (!userId) return res.status(401).json({ success: false, message: 'User ID required' });

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            if (user.walletCoins < 100) {
                return res.status(400).json({ success: false, message: 'Insufficient coins' });
            }

            const newCouponCode = 'LUXE' + Math.random().toString(36).substr(2, 5).toUpperCase();

            user.walletCoins -= 100;
            user.coupons.push({
                code: newCouponCode,
                discount: 15,
                isUsed: false
            });

            await user.save();

            res.status(200).json({
                success: true,
                message: 'Exchanged 100 coins for a 15% VIP coupon',
                newCoupon: newCouponCode,
                walletCoins: user.walletCoins
            });
        } catch (error) {
            console.error('Exchange Coins Error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
};

module.exports = userController;
