const Order = require('../models/Order');
const User = require('../models/User');
const Return = require('../models/Return');
const Contact = require('../models/Contact');

const adminController = {
    getStats: async (req, res) => {
        try {
            const totalOrders = await Order.countDocuments();
            const totalUsers = await User.countDocuments();
            const pendingReturns = await Return.countDocuments({ status: 'Pending' });
            const totalRevenue = await Order.aggregate([
                { $group: { _id: null, total: { $sum: "$total" } } }
            ]);
            const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5);

            res.status(200).json({
                success: true,
                stats: {
                    totalOrders,
                    totalUsers,
                    pendingReturns,
                    revenue: totalRevenue[0]?.total || 0,
                    recentContacts
                }
            });
        } catch (error) {
            console.error('Admin Stats Error:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch admin statistics' });
        }
    }
};

module.exports = adminController;
