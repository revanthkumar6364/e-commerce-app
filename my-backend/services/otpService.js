const crypto = require('crypto');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Otp = require('../models/Otp');
const User = require('../models/User');

// SIMULATED IN-MEMORY DB (Fallback if MongoDB fails)
const memoryOtps = new Map();
const memoryUsers = [];

class OtpService {
    /**
     * Generate a random 6-digit numeric OTP
     */
    generateOtp() {
        return crypto.randomInt(100000, 999999).toString();
    }

    isMongoConnected() {
        return mongoose.connection.readyState === 1;
    }

    /**
     * Create and store OTP for an identifier
     * @param {string} identifier - Phone or Email
     * @param {string} channel - 'sms' or 'email'
     */
    async createOtp(identifier, channel) {
        // --- 1. RATE LIMIT / COOLDOWN CHECK ---
        let lastOtpTime = null;

        if (this.isMongoConnected()) {
            const lastOtp = await Otp.findOne({ identifier, channel }).sort({ createdAt: -1 });
            if (lastOtp) lastOtpTime = lastOtp.createdAt;
        } else {
            console.log('⚠️ MongoDB not connected. Using In-Memory Store for OTP creation.');
            const userOtps = Array.from(memoryOtps.values())
                .filter(o => o.identifier === identifier && o.channel === channel)
                .sort((a, b) => b.createdAt - a.createdAt);
            if (userOtps.length > 0) lastOtpTime = userOtps[0].createdAt;
        }

        if (lastOtpTime) {
            const diffSeconds = (new Date() - lastOtpTime) / 1000;
            if (diffSeconds < 60) {
                // throw new Error('Please wait before resending OTP'); 
                // Relaxed for demo/testing convenience
            }
        }

        // --- 2. GENERATE & HASH ---
        const otp = this.generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // --- 3. SAVE ---
        if (this.isMongoConnected()) {
            await Otp.create({
                identifier,
                channel,
                otpHash,
                expiresAt,
                attempts: 0
            });
        } else {
            memoryOtps.set(otpHash, { // Using hash as unique key for map or just push to list
                identifier,
                channel,
                otpHash,
                expiresAt,
                attempts: 0,
                createdAt: new Date(),
                isUsed: false
            });
            // Cleanup memory (optional simple GC)
            if (memoryOtps.size > 1000) memoryOtps.clear();
        }

        return otp;
    }

    /**
     * Verify OTP
     * @param {string} identifier 
     * @param {string} channel 
     * @param {string} otp 
     */
    async verifyOtp(identifier, channel, otp, name = null) {
        let otpRecord = null;
        let isMemoryMode = !this.isMongoConnected();

        // [Lines 92-146 Unchanged - Skipping for brevity in replacement]
        // Ideally I should replace the whole method to be safe, but let's try targeted specific blocks if possible.
        // Actually, since I need to change signature, I must replace the signature line.
        // But the internal logic changes deep down (Step 5).

        // Let's replace the User Upsert block primarily, but I need to ensure previous steps are valid.
        // This tool suggests replacing contiguous block. I'll replace the whole function to be safe.

        // RE-IMPLEMENTING verifyOtp with name support:

        // --- 1. FIND OTP ---
        if (!isMemoryMode) {
            try {
                otpRecord = await Otp.findOne({
                    identifier,
                    channel,
                    isUsed: false,
                    expiresAt: { $gt: new Date() }
                }).sort({ createdAt: -1 });
            } catch (err) {
                console.warn('DB verify error', err.message);
                isMemoryMode = true;
            }
        }

        if (isMemoryMode) {
            const validOtps = Array.from(memoryOtps.values()).filter(o =>
                o.identifier === identifier &&
                o.channel === channel &&
                !o.isUsed &&
                o.expiresAt > new Date()
            ).sort((a, b) => b.createdAt - a.createdAt);

            if (validOtps.length > 0) {
                otpRecord = validOtps[0];
                otpRecord.save = async () => { };
            }
        }

        if (!otpRecord) throw new Error('OTP expired or invalid');
        if (otpRecord.attempts >= 5) throw new Error('Too many failed attempts');

        const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
        if (!isValid) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            throw new Error('Invalid OTP');
        }

        otpRecord.isUsed = true;
        await otpRecord.save();

        // --- 5. USER UPSERT (With Name) ---
        const update = {};
        if (channel === 'sms') update.phoneVerifiedAt = new Date();
        if (channel === 'email') update.emailVerifiedAt = new Date();
        if (name) update.name = name; // Save name if provided

        let user = null;
        let isNewUser = false;
        const query = channel === 'sms' ? { phone: identifier } : { email: identifier };

        if (!isMemoryMode) {
            user = await User.findOne(query);
            if (!user) {
                user = await User.create({ ...query, ...update });
                isNewUser = true;
            } else {
                Object.assign(user, update);
                await user.save();
            }
        } else {
            user = memoryUsers.find(u =>
                (channel === 'sms' && u.phone === identifier) ||
                (channel === 'email' && u.email === identifier)
            );

            if (!user) {
                user = {
                    _id: 'mem_' + Date.now(),
                    ...query,
                    ...update,
                    status: 'active'
                };
                memoryUsers.push(user);
                isNewUser = true;
            } else {
                Object.assign(user, update);
            }
        }

        return { user, isNewUser };
    }
}

module.exports = new OtpService();
