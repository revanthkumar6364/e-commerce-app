import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ArrowLeft, Mail, Phone } from 'lucide-react';
import './ForgotPassword.css';

const api = 'http://localhost:5000'; // Direct connection to fix Network Error

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState('');
    const [channel, setChannel] = useState('email'); // 'email' or 'sms'
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');

        if (!identifier) {
            setMsg('❌ Please enter your email or phone number');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${api}/auth/password/forgot`, {
                identifier,
                channel
            });

            setMsg('✅ Reset OTP sent! Redirecting...');

            setTimeout(() => {
                navigate('/reset-password', {
                    state: { identifier, channel }
                });
            }, 1500);

        } catch (err) {
            console.error('Forgot Password Error:', err);
            setMsg(`❌ ${err.response?.data?.message || 'Failed to send reset OTP'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">

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
                <div className="forgot-form-wrapper">

                    <div className="forgot-header">
                        <button className="back-btn" onClick={() => navigate('/login')}>
                            <ArrowLeft size={20} />
                        </button>
                        <h1>Forgot Password?</h1>
                    </div>

                    <p className="forgot-subtitle">
                        No worries! Enter your email or phone number and we'll send you a reset code.
                    </p>

                    <form onSubmit={handleSubmit} className="forgot-form">

                        {/* Channel Toggle */}
                        <div className="channel-toggle">
                            <button
                                type="button"
                                className={`channel-btn ${channel === 'email' ? 'active' : ''}`}
                                onClick={() => setChannel('email')}
                            >
                                <Mail size={18} /> Email
                            </button>
                            <button
                                type="button"
                                className={`channel-btn ${channel === 'sms' ? 'active' : ''}`}
                                onClick={() => setChannel('sms')}
                            >
                                <Phone size={18} /> Phone
                            </button>
                        </div>

                        {/* Input */}
                        <div className="input-group">
                            <input
                                type={channel === 'email' ? 'email' : 'tel'}
                                className="forgot-input"
                                placeholder={channel === 'email' ? 'Enter your email' : 'Enter your phone number'}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </div>

                        {/* Message */}
                        {msg && (
                            <div className={`forgot-msg ${msg.startsWith('✅') ? 'success' : 'error'}`}>
                                {msg}
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" className="forgot-submit-btn" disabled={loading}>
                            {loading ? <Loader2 className="spin" size={20} /> : 'SEND RESET CODE'}
                        </button>
                    </form>

                    <div className="forgot-footer">
                        <p>
                            Remember your password? <Link to="/login">Back to Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
