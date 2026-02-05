const nodemailer = require('nodemailer');

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendMail({ to, subject, text, html }) {
  const transporter = getTransport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  return transporter.sendMail({ from, to, subject, text, html });
}

module.exports = { sendMail };
