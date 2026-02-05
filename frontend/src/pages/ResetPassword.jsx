import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import './ResetPassword.css';

const api = 'http://localhost:5000'; // Direct connection to fix Network Error

export default function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    const { identifier, channel } = location.state || {};

    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');

        if (!otp || otp.length !== 6) {
            setMsg('❌ Please enter the 6-digit OTP');
            return;
        }

        if (newPassword.length < 8) {
            setMsg('❌ Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${api}/auth/password/reset`, {
                identifier,
                otp,
                newPassword,
                channel
            });

            setMsg('✅ Password reset successful! Redirecting to login...');

            setTimeout(() => {
                navigate('/login', { state: { message: 'Password reset successful! Please login.' } });
            }, 2000);

        } catch (err) {
            console.error('Reset Password Error:', err);
            setMsg(`❌ ${err.response?.data?.message || 'Failed to reset password'}`);
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = () => {
        if (!newPassword) return null;
        if (newPassword.length < 8) return { label: 'Too Short', color: '#d32f2f' };
        if (newPassword.length < 10) return { label: 'Weak', color: '#ff9800' };
        if (/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) {
            return { label: 'Strong', color: '#4caf50' };
        }
        return { label: 'Medium', color: '#ffc107' };
    };

    const strength = getPasswordStrength();

    return (
        <div className="reset-password-page">
            <div className="reset-password-container">

                {/* Left Side - Hero */}
                <div className="myntra-login-hero">
                    <img
                        src="file:///C:/Users/test/.gemini/antigravity/brain/4378dd63-2eb8-4d48-b1d8-8096b24e4b3c/login_hero_fashion_1770282382215.png"
                        alt="Fashion Model"
                        className="hero-image"
                    />
                    <div className="hero-overlay">
                        <h1>Join the Vibe</h1>
                        <p>Get access to your Orders, Wishlist and Recommendations</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="reset-form-wrapper">

                    <div className="reset-header">
                        <CheckCircle2 size={48} color="#ff3f6c" />
                        <h1>Reset Password</h1>
                        <p>Enter the OTP sent to your {channel === 'sms' ? 'phone' : 'email'} and create a new password</p>
                    </div>

                    <form onSubmit={handleSubmit} className="reset-form">

                        {/* OTP Input */}
                        <div className="input-group">
                            <label>Verification Code</label>
                            <input
                                type="text"
                                className="reset-input"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                required
                            />
                        </div>

                        {/* New Password Input */}
                        <div className="input-group">
                            <label>New Password</label>
                            <div className="password-field">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="reset-input"
                                    placeholder="Enter new password (min 8 characters)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Password Strength */}
                            {strength && (
                                <div className="password-strength">
                                    <div className="strength-bar" style={{ width: `${(strength.label === 'Too Short' ? 25 : strength.label === 'Weak' ? 40 : strength.label === 'Medium' ? 70 : 100)}%`, backgroundColor: strength.color }}></div>
                                    <span className="strength-label" style={{ color: strength.color }}>
                                        {strength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Message */}
                        {msg && (
                            <div className={`reset-msg ${msg.startsWith('✅') ? 'success' : 'error'}`}>
                                {msg}
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" className="reset-submit-btn" disabled={loading}>
                            {loading ? <Loader2 className="spin" size={20} /> : 'RESET PASSWORD'}
                        </button>
                    </form>

                    <div className="reset-footer">
                        <p>
                            <Link to="/login">Back to Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
