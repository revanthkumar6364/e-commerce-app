const twilio = require('twilio');

function getClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured');
  }
  return twilio(accountSid, authToken);
}

async function sendSms({ to, body }) {
  const from = process.env.TWILIO_FROM;
  if (!from) throw new Error('TWILIO_FROM not configured');
  const client = getClient();
  return client.messages.create({ from, to, body });
}

module.exports = { sendSms };
