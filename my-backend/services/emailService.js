const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: process.env.EMAIL_PORT || 2525,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

class EmailService {
    /**
     * Send Email OTP
     * @param {string} email - Recipient email
     * @param {string} subject - Email subject
     * @param {string} html - Email body (HTML)
     */
    async send(email, subject, html) {
        if (!process.env.EMAIL_USER) {
            console.log('\n--- [MOCK EMAIL VERIFICATION] ---');
            console.log(`To: ${email}`);
            console.log(`Subject: ${subject}`);
            console.log(`Content: ${html.replace(/<[^>]*>?/gm, '').substring(0, 100)}...`);
            console.log('---------------------------------\n');
            return;
        }

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM || '"Auth System" <noreply@example.com>',
                to: email,
                subject: subject,
                html: html,
            });
            console.log(`[EMAIL] Sent to ${email}`);
        } catch (error) {
            console.error(`[EMAIL] Failed to send to ${email}:`, error);
            throw new Error('Failed to send Email');
        }
    }

    // Helper for Stamp and Signature
    getStampAndSignature() {
        return `
            <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="text-align: center;">
                    <div style="border: 3px double #d63384; color: #d63384; font-weight: bold; padding: 5px 10px; transform: rotate(-10deg); display: inline-block; font-family: monospace; font-size: 1.2rem;">
                        URBAN VIBE<br>AUTHORIZED<br>OFFICIAL STAMP
                    </div>
                </div>
                <div style="text-align: right;">
                    <p style="font-family: 'Brush Script MT', cursive; font-size: 1.5rem; color: #333; margin: 0 0 5px 0;">Revanth Kumar</p>
                    <div style="border-top: 1px solid #333; width: 150px; margin-left: auto;"></div>
                    <p style="font-size: 0.8rem; color: #666; margin-top: 2px;">Authorized Signatory</p>
                </div>
            </div>
        `;
    }

    /**
     * Send Order Confirmation
     */
    async sendOrderConfirmation(email, order) {
        const subject = `🛍️ Order Placed Successfully: #${order.orderId}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #1a1a1a;">Thank you for your order!</h2>
                <p>Your order <strong>#${order.orderId}</strong> has been placed and is currently <strong>Pending</strong>.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p><strong>Total Amount:</strong> ₹${order.total}</p>
                <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>
                <p>You can track your order directly on our home page or by visiting <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/track-order?id=${order.orderId}">Track Order</a>.</p>
                
                ${this.getStampAndSignature()}

                <footer style="margin-top: 40px; font-size: 0.8rem; color: #888;">
                    Urban Vibe Boutique &copy; 2026
                </footer>
            </div>
        `;
        await this.send(email, subject, html);
    }

    /**
     * Send Payment Success
     */
    async sendPaymentSuccess(email, orderId, amount) {
        const subject = `✅ Payment Successful: #${orderId}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #2ecc71;">Payment Received!</h2>
                <p>We have successfully received your payment of <strong>₹${amount}</strong> for order <strong>#${orderId}</strong>.</p>
                <p>Your order is now being processed.</p>
                <p>Track your order: <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/track-order?id=${orderId}">View Details</a></p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                
                 ${this.getStampAndSignature()}

                <p style="font-size: 0.9rem;">Need help? Contact our agent: <strong>Agent Rahul (+91 98765 43210)</strong></p>
            </div>
        `;
        await this.send(email, subject, html);
    }

    /**
     * Send Flight E-Ticket
     */
    async sendFlightTicket(email, ticketData) {
        const subject = `✈️ Your E-Ticket Confirmation: ${ticketData.code}`;
        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #2563eb; border-radius: 12px; overflow: hidden;">
                <div style="background: #2563eb; color: #fff; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 1.5rem;">URBAN TRAVEL E-TICKET</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Booking Reference: ${ticketData.confNo}</p>
                </div>
                <div style="padding: 30px; background: #fff;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                        <div>
                            <p style="color: #64748b; margin: 0; font-size: 0.8rem; text-transform: uppercase;">Passenger</p>
                            <p style="font-weight: 700; margin: 5px 0; font-size: 1.1rem;">${ticketData.passenger}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="color: #64748b; margin: 0; font-size: 0.8rem; text-transform: uppercase;">Flight / Code</p>
                            <p style="font-weight: 700; margin: 5px 0; font-size: 1.1rem;">${ticketData.carrier} (${ticketData.code})</p>
                        </div>
                    </div>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                        <table style="width: 100%;">
                            <tr>
                                <td style="width: 40%;">
                                    <p style="color: #64748b; margin: 0; font-size: 0.7rem;">FROM</p>
                                    <p style="font-weight: 800; font-size: 1.4rem; margin: 5px 0;">${ticketData.from}</p>
                                </td>
                                <td style="text-align: center; width: 20%; font-size: 1.5rem;">✈️</td>
                                <td style="text-align: right; width: 40%;">
                                    <p style="color: #64748b; margin: 0; font-size: 0.7rem;">TO</p>
                                    <p style="font-weight: 800; font-size: 1.4rem; margin: 5px 0;">${ticketData.to}</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div>
                        <p style="color: #64748b; margin: 0; font-size: 0.8rem; text-transform: uppercase;">Seats Assigned</p>
                        <p style="font-weight: 700; margin: 5px 0; color: #2563eb;">${ticketData.seats.join(', ')}</p>
                    </div>

                    ${this.getStampAndSignature()}

                </div>
                <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 0.75rem; color: #64748b;">
                    Please present this e-ticket at the check-in counter at least 3 hours before departure.
                </div>
            </div>
        `;
        await this.send(email, subject, html);
    }
}

module.exports = new EmailService();
