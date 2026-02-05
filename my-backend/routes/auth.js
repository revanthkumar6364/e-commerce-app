const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');
const User = require('../models/User');
const { sendMail } = require('../utils/mail');
const { sendSms } = require('../utils/sms');

const router = express.Router();

function genCode() {
  return crypto.randomInt(100000, 999999).toString();
}

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already used' });
    const passwordHash = await bcrypt.hash(password, 10);
    const { phone } = req.body || {};
    const user = await User.create({ email, phone: phone || null, passwordHash, verified: true });
    return res.json({ ok: true, user: { email: user.email, id: user._id } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Missing' });
  try {
    // allow lookup by phone or email
    const isEmail = email.includes('@');
    const query = isEmail ? { email } : { phone: email };
    const user = await User.findOne(query);
    if (!user) return res.status(400).json({ error: 'Invalid' });
    if (user.verified) return res.json({ ok: true });
    if (user.verificationCode !== code) return res.status(400).json({ error: 'Wrong code' });
    if (user.codeExpiry && user.codeExpiry < new Date()) return res.status(400).json({ error: 'Code expired' });
    user.verified = true;
    user.verificationCode = undefined;
    user.codeExpiry = undefined;
    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    return res.json({ token, user: { email: user.email, id: user._id } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/request-reset', async (req, res) => {
  const { email, phone } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: true }); // do not reveal
    const resetCode = genCode();
    user.resetCode = resetCode;
    user.codeExpiry = new Date(Date.now() + 1000 * 60 * 30); // 30m
    await user.save();
    const sends = [];
    sends.push(sendMail({
      to: email,
      subject: 'Password reset code',
      text: `Your password reset code is ${resetCode}`,
      html: `<p>Your password reset code is <strong>${resetCode}</strong></p>`
    }).catch(err => {
      console.log('📧 Reset email not sent:', err.message);
      console.log('   → Code for testing:', resetCode);
    }));
    const toPhone = phone || user.phone;
    if (toPhone) {
      sends.push(sendSms({ to: toPhone, body: `Your password reset code is ${resetCode}` }).catch(err => {
        console.log('📱 Reset SMS not sent');
        console.log('   → Code for testing:', resetCode);
      }));
    }
    await Promise.all(sends);
    return res.json({ ok: true, code: resetCode });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/reset', async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) return res.status(400).json({ error: 'Missing' });
  try {
    const user = await User.findOne({ email });
    if (!user || user.resetCode !== code) return res.status(400).json({ error: 'Invalid' });
    if (user.codeExpiry && user.codeExpiry < new Date()) return res.status(400).json({ error: 'Code expired' });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.codeExpiry = undefined;
    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
