const twilio = require('twilio');

class SmsService {
    constructor() {
        this.client = null;
    }

    /**
     * Send SMS OTP
     * @param {string} phone - E.164 phone number (+91...)
     * @param {string} text - Message content
     */
    async send(phone, text) {
        // Check if credentials exist
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
            console.log('\n--- [MOCK SMS VERIFICATION] ---');
            console.log(`To: ${phone}`);
            console.log(`Message: ${text}`);
            console.log('--------------------------------\n');
            return;
        }

        // Initialize client if not already done
        if (!this.client) {
            try {
                this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            } catch (err) {
                console.error('Failed to initialize Twilio client:', err.message);
                return; // Fallback or fail
            }
        }

        try {
            await this.client.messages.create({
                body: text,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone
            });
            console.log(`[SMS] Sent to ${phone}`);
        } catch (error) {
            console.error(`[SMS] Failed to send to ${phone}:`, error);
            throw new Error('Failed to send SMS');
        }
    }

    /**
     * Send Order Confirmation SMS
     */
    async sendOrderConfirmation(phone, orderId) {
        const text = `🛍️ Urban Vibe: Order #${orderId} placed successfully! Track: ${process.env.CLIENT_URL || 'http://localhost:5173'}/track-order?id=${orderId}`;
        await this.send(phone, text);
    }

    /**
     * Send Payment Success SMS
     */
    async sendPaymentSuccess(phone, orderId, amount) {
        const text = `✅ Urban Vibe: Payment of ₹${amount} received for order #${orderId}. Your order is now being processed!`;
        await this.send(phone, text);
    }
}

module.exports = new SmsService();
