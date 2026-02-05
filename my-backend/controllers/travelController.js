const emailService = require('../services/emailService');

const travelController = {
    bookFlight: async (req, res) => {
        try {
            const { email, passenger, carrier, code, from, to, seats } = req.body;

            if (!email || !passenger || !seats) {
                return res.status(400).json({ success: false, message: 'Missing required booking information' });
            }

            const confNo = 'URB-' + Math.floor(Math.random() * 900000 + 100000);

            const ticketData = {
                confNo,
                passenger,
                carrier,
                code,
                from,
                to,
                seats
            };

            // Send E-Ticket Email
            await emailService.sendFlightTicket(email, ticketData);

            res.status(200).json({
                success: true,
                message: 'E-Ticket generated and sent successfully',
                confNo
            });
        } catch (error) {
            console.error('Travel Booking Error:', error);
            res.status(500).json({ success: false, message: 'Failed to process travel booking' });
        }
    }
};

module.exports = travelController;
