const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const otpService = require('../services/otpService');
const smsService = require('../services/smsService');
const emailService = require('../services/emailService');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, status: user.status },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: '1d' }
    );
};

exports.requestOtp = async (req, res) => {
    try {
        const { channel, phone, email } = req.body;

        // Validate Input
        if (!channel || !['sms', 'email'].includes(channel)) {
            return res.status(400).json({ message: 'Invalid channel' });
        }

        let identifier;
        if (channel === 'sms') {
            if (!phone) return res.status(400).json({ message: 'Phone is required for SMS' });
            // Basic normalization logic for UI input to E.164
            identifier = phone.startsWith('+') ? phone : `+91${phone}`;
        } else {
            if (!email) return res.status(400).json({ message: 'Email is required for Email' });
            identifier = email.toLowerCase();
        }

        // Create OTP
        const otp = await otpService.createOtp(identifier, channel);

        // Send OTP
        if (channel === 'sms') {
            await smsService.send(identifier, `Your OTP is ${otp}. Valid for 5 minutes.`);
        } else {
            await emailService.send(identifier, 'Your Verification Code', `<p>Your OTP is <b>${otp}</b>. Valid for 5 minutes.</p>`);
        }

        // Return Success
        res.json({ message: 'OTP sent successfully' });

    } catch (error) {
        console.error('Request OTP Error:', error);
        res.status(400).json({ message: error.message || 'Failed to send OTP' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { channel, phone, email, otp } = req.body;

        if (!otp) return res.status(400).json({ message: 'OTP is required' });

        let identifier;
        if (channel === 'sms') {
            identifier = phone.startsWith('+') ? phone : `+91${phone}`;
        } else {
            identifier = email ? email.toLowerCase() : null;
        }

        if (!identifier) return res.status(400).json({ message: 'Identifier required' });

        // Verify
        const { user, isNewUser } = await otpService.verifyOtp(identifier, channel, otp, req.body.name);

        // Issue Token
        // NOTE: For Mode 2 (2FA), you would check if BOTH verified here. 
        // For now, implementing "Either" mode (login on single success).
        const token = generateToken(user);

        // Security Notification: Alert user of new login or Welcome them (if email is available)
        if (user.email) {
            // Don't await this, let it run in background to keep login fast
            const subject = isNewUser ? 'Welcome to Our Platform! 🎉' : 'New Login Detected 🛡️';
            const html = isNewUser
                ? `<p>Welcome! Your account has been successfully created via ${channel === 'sms' ? 'Mobile' : 'Email'} verification.</p>`
                : `<p>Hello,</p><p>We detected a new successful login to your account via ${channel === 'sms' ? 'Mobile OTP' : 'Email OTP'}.</p><p>If this was you, you can ignore this email.</p>`;

            emailService.send(user.email, subject, html)
                .catch(err => console.error('Failed to send login alert:', err.message));
        }

        res.json({
            message: 'Verified successfully',
            token,
            user: {
                id: user._id,
                phone: user.phone,
                email: user.email,
                phoneVerified: !!user.phoneVerifiedAt,
                emailVerified: !!user.emailVerifiedAt
            }
        });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(400).json({ message: error.message || 'Verification failed' });
    }
};

exports.logout = (req, res) => {
    // Client-side token removal mostly
    res.json({ message: 'Logged out successfully' });
};

// ==================== PASSWORD AUTHENTICATION ====================

/**
 * Register with Email/Phone + Password
 */
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validation
        if (!name || !password) {
            return res.status(400).json({ message: 'Name and password are required' });
        }
        if (!email && !phone) {
            return res.status(400).json({ message: 'Either email or phone is required' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        // Normalize identifiers
        const normalizedEmail = email ? email.toLowerCase() : null;
        const normalizedPhone = phone ? (phone.startsWith('+') ? phone : `+91${phone}`) : null;

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { phone: normalizedPhone }
            ].filter(Boolean)
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. Please login.' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = new User({
            name,
            email: normalizedEmail,
            phone: normalizedPhone,
            password: passwordHash,
            status: 'active'
        });

        await user.save();

        // Generate token
        const token = generateToken(user);

        // Send welcome email if email provided
        if (normalizedEmail) {
            emailService.send(
                normalizedEmail,
                'Welcome to Urban Vibe! 🎉',
                `<h2>Welcome ${name}!</h2><p>Your account has been successfully created. Start exploring our latest fashion trends!</p>`
            ).catch(err => console.error('Failed to send welcome email:', err.message));
        }

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: error.message || 'Registration failed' });
    }
};

/**
 * Login with Email/Phone + Password
 */
exports.loginWithPassword = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be email or phone

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Email/Phone and password are required' });
        }

        // Normalize identifier
        let query;
        if (identifier.includes('@')) {
            // Email login
            query = { email: identifier.toLowerCase() };
        } else {
            // Phone login
            const normalizedPhone = identifier.startsWith('+') ? identifier : `+91${identifier}`;
            query = { phone: normalizedPhone };
        }

        // Find user with password field
        const user = await User.findOne(query).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.password) {
            return res.status(401).json({ message: 'Please use OTP login or set a password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        // Send login alert if email exists
        if (user.email) {
            emailService.send(
                user.email,
                'New Login to Your Account 🛡️',
                `<p>Hello ${user.name || 'there'},</p><p>We detected a successful login to your account using password.</p><p>If this wasn't you, please reset your password immediately.</p>`
            ).catch(err => console.error('Failed to send login alert:', err.message));
        }

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: error.message || 'Login failed' });
    }
};

/**
 * Forgot Password - Send Reset OTP
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { identifier, channel } = req.body; // identifier: email or phone, channel: 'email' or 'sms'

        if (!identifier) {
            return res.status(400).json({ message: 'Email or phone is required' });
        }

        // Normalize identifier
        let query, normalizedIdentifier;
        if (identifier.includes('@')) {
            normalizedIdentifier = identifier.toLowerCase();
            query = { email: normalizedIdentifier };
        } else {
            normalizedIdentifier = identifier.startsWith('+') ? identifier : `+91${identifier}`;
            query = { phone: normalizedIdentifier };
        }

        // Check if user exists
        const user = await User.findOne(query);

        if (!user) {
            // Security: Don't reveal if user exists or not
            return res.json({ message: 'If the account exists, a reset OTP has been sent' });
        }

        // Generate OTP for password reset
        const otp = await otpService.createOtp(normalizedIdentifier, channel || (identifier.includes('@') ? 'email' : 'sms'));

        // Send OTP
        if (channel === 'sms' || !identifier.includes('@')) {
            await smsService.send(normalizedIdentifier, `Your password reset OTP is ${otp}. Valid for 10 minutes.`);
        } else {
            await emailService.send(
                normalizedIdentifier,
                'Password Reset Request 🔐',
                `<h3>Reset Your Password</h3><p>Your reset OTP is: <strong style="font-size: 24px; letter-spacing: 3px;">${otp}</strong></p><p>This code will expire in 10 minutes.</p><p>If you didn't request this, please ignore this email.</p>`
            );
        }

        res.json({ message: 'Reset OTP sent successfully' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: error.message || 'Failed to process request' });
    }
};

/**
 * Reset Password with OTP
 */
exports.resetPassword = async (req, res) => {
    try {
        const { identifier, otp, newPassword, channel } = req.body;

        if (!identifier || !otp || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        // Normalize identifier
        let normalizedIdentifier;
        if (identifier.includes('@')) {
            normalizedIdentifier = identifier.toLowerCase();
        } else {
            normalizedIdentifier = identifier.startsWith('+') ? identifier : `+91${identifier}`;
        }

        // Verify OTP (without creating user if doesn't exist)
        const { user } = await otpService.verifyOtp(normalizedIdentifier, channel || (identifier.includes('@') ? 'email' : 'sms'), otp);

        // Hash new password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        user.password = passwordHash;
        await user.save();

        // Send confirmation email
        if (user.email) {
            emailService.send(
                user.email,
                'Password Changed Successfully ✅',
                `<p>Hello ${user.name || 'there'},</p><p>Your password has been successfully changed.</p><p>If you didn't make this change, please contact support immediately.</p>`
            ).catch(err => console.error('Failed to send password change email:', err.message));
        }

        res.json({ message: 'Password reset successfully. Please login with your new password.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(400).json({ message: error.message || 'Password reset failed' });
    }
};
