import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, RefreshCw } from 'lucide-react';
import './VerifyOTP.css';

const api = 'http://localhost:5000'; // Direct connection to fix Network Error

export default function VerifyOTP() {
    const location = useLocation();
    const navigate = useNavigate();

    const { identifier, channel, isSignup, name } = location.state || {};

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (!identifier) {
            navigate('/login');
        }
    }, [identifier, navigate]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setMsg('');

        if (!otp || otp.length !== 6) {
            setMsg('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                channel,
                [channel === 'sms' ? 'phone' : 'email']: identifier,
                otp,
                ...(isSignup && name ? { name } : {})
            };

            const res = await axios.post(`${api}/auth/otp/verify`, payload);
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setTimeout(() => {
                if (isSignup) {
                    navigate('/welcome');
                } else {
                    navigate('/profile');
                }
            }, 500);

        } catch (err) {
            console.error('OTP Verification Error:', err);
            setMsg(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setMsg('');
        setLoading(true);
        setCanResend(false);
        setCountdown(60);

        try {
            const payload = {
                channel,
                [channel === 'sms' ? 'phone' : 'email']: identifier
            };

            await axios.post(`${api}/auth/otp/request`, payload);
            setMsg('OTP sent successfully!');

        } catch (err) {
            console.error('Resend OTP Error:', err);
            setMsg(err.response?.data?.message || 'Failed to resend');
            setCanResend(true);
        } finally {
            setLoading(false);
        }
    };

    const maskIdentifier = (id) => {
        if (channel === 'sms') {
            return `+91******${id.slice(-4)}`;
        } else {
            const [local, domain] = id.split('@');
            return `${local[0]}***@${domain}`;
        }
    };

    return (
        <div className="myntra-verify-page">
            <div className="myntra-verify-container">

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

                {/* Right Side - OTP Form */}
                <div className="myntra-verify-form">

                    <div className="verify-header">
                        <h2>Verify OTP</h2>
                        <p className="sent-to">OTP sent to <strong>{maskIdentifier(identifier)}</strong></p>
                    </div>

                    <form onSubmit={handleVerify} className="otp-form">

                        <div className="form-group">
                            <label>Enter OTP</label>
                            <input
                                type="text"
                                className="otp-input-field"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                autoFocus
                                required
                            />
                        </div>

                        {/* Resend OTP */}
                        <div className="resend-wrapper">
                            {!canResend ? (
                                <span className="timer-text">Resend OTP in {countdown}s</span>
                            ) : (
                                <button
                                    type="button"
                                    className="resend-link"
                                    onClick={handleResend}
                                    disabled={loading}
                                >
                                    <RefreshCw size={14} /> Resend OTP
                                </button>
                            )}
                        </div>

                        {/* Message */}
                        {msg && (
                            <div className={`myntra-msg ${msg.includes('success') ? 'success' : 'error'}`}>
                                ✕ {msg}
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" className="myntra-submit-btn" disabled={loading || otp.length !== 6}>
                            {loading ? <Loader2 className="spin" size={20} /> : 'VERIFY & LOGIN'}
                        </button>
                    </form>

                    <div className="verify-footer">
                        <p>
                            <Link to="/login">← Back to Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
