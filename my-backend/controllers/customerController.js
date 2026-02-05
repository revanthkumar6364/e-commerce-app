const Contact = require('../models/Contact');
const Return = require('../models/Return');

const customerController = {
    // Submit contact form
    submitContact: async (req, res) => {
        try {
            const { name, email, phone, subject, message } = req.body;
            const newContact = new Contact({ name, email, phone, subject, message });
            await newContact.save();
            res.status(201).json({ success: true, message: 'Message received' });
        } catch (error) {
            console.error('Contact Submit Error:', error);
            res.status(500).json({ success: false, message: 'Failed to send message' });
        }
    },

    // Submit return request
    submitReturn: async (req, res) => {
        try {
            const { orderId, reason, description, buyerName, email } = req.body;
            const returnId = 'RET-' + Date.now().toString().slice(-8);
            const newReturn = new Return({ returnId, orderId, reason, description, buyerName, email });
            await newReturn.save();
            res.status(201).json({ success: true, returnId, message: 'Return request submitted' });
        } catch (error) {
            console.error('Return Submit Error:', error);
            res.status(500).json({ success: false, message: 'Failed to submit return' });
        }
    }
};

module.exports = customerController;
