import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Mail, Phone, Lock, User, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignup, setIsSignup] = useState(false);
  const [loginMode, setLoginMode] = useState('otp'); // 'otp' or 'password'

  // Form fields
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // phone or email
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [channel, setChannel] = useState('sms'); // 'sms' or 'email'

  // State
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Check for message from redirects
  useEffect(() => {
    if (location.state?.message) {
      setMsg(`✅ ${location.state.message}`);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Handle OTP Login Flow
  const handleOTPLogin = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!identifier) {
      setMsg('Please enter your phone number or email');
      return;
    }

    if (isSignup && !name) {
      setMsg('Please enter your name');
      return;
    }

    // Basic Validation
    if (channel === 'sms') {
      const phoneRegex = identifier.startsWith('+') ? /^\+\d{10,15}$/ : /^\d{10}$/;
      if (!phoneRegex.test(identifier)) {
        setMsg(identifier.startsWith('+') ? 'Please enter a valid international phone number (+ digits)' : 'Please enter a valid 10-digit mobile number');
        return;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        setMsg('Please enter a valid email address');
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        channel,
        [channel === 'sms' ? 'phone' : 'email']: identifier
      };

      await api.post('/auth/otp/request', payload);

      navigate('/verify-otp', {
        state: {
          identifier,
          channel,
          isSignup,
          name: isSignup ? name : null
        }
      });

    } catch (err) {
      console.error('OTP Request Error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to send OTP';
      setMsg(errorMsg);

      if (!err.response) {
        setMsg('Network Error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!identifier || !password) {
      setMsg('Please enter both email/phone and password');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/login/password', {
        identifier,
        password
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setTimeout(() => {
        navigate('/profile');
      }, 500);

    } catch (err) {
      console.error('Password Login Error:', err);
      setMsg(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="myntra-login-page">
      <div className="myntra-login-container">

        {/* Left Side - Hero Image */}
        <div className="myntra-login-hero">
          <img
            src={isSignup ? "/images/banners/fashion-hero.png" : "/images/summer-hero.png"}
            alt="Fashion Model"
            className="hero-image"
          />
          <div className="hero-overlay">
            <h1>{isSignup ? "Create Your Style" : "Join the Vibe"}</h1>
            <p>{isSignup ? "Sign up to unlock exclusive deals and personalized recommendations" : "Get access to your Orders, Wishlist and Recommendations"}</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="myntra-login-form">

          {/* Header */}
          <div className="form-header">
            <h2>{isSignup ? 'Signup' : 'Login'}</h2>
            <p className="switch-mode">
              {isSignup ? (
                <>Already have an account? <Link to="/login" onClick={() => setIsSignup(false)}>Login</Link></>
              ) : (
                <>New to Urban Vibe? <Link to="/register" onClick={() => setIsSignup(true)}>Signup</Link></>
              )}
            </p>
          </div>

          {/* Login Mode Toggle - Only for Login */}
          {!isSignup && (
            <div className="auth-mode-tabs">
              <button
                className={`auth-mode-tab ${loginMode === 'otp' ? 'active' : ''}`}
                onClick={() => setLoginMode('otp')}
              >
                Login with OTP
              </button>
              <button
                className={`auth-mode-tab ${loginMode === 'password' ? 'active' : ''}`}
                onClick={() => setLoginMode('password')}
              >
                Login with Password
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={loginMode === 'password' && !isSignup ? handlePasswordLogin : handleOTPLogin} className="myntra-form">

            {/* Name - Only for Signup with OTP */}
            {isSignup && loginMode === 'otp' && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Identifier (Phone/Email) */}
            <div className="form-group">
              <label>{channel === 'sms' ? 'Mobile Number' : 'Email Address'}</label>
              <input
                type={channel === 'sms' ? 'tel' : 'email'}
                placeholder={channel === 'sms' ? 'Enter 10-digit mobile number' : 'Enter your email'}
                value={identifier}
                onChange={e => {
                  let val = e.target.value;
                  if (channel === 'sms') {
                    // Allow '+' only at the start
                    if (val.startsWith('+')) {
                      // Remove non-numeric after '+'
                      val = '+' + val.slice(1).replace(/\D/g, '');
                      // Limit global numbers to 15 digits (standard max)
                      if (val.length > 16) return;
                    } else {
                      // Local number: remove all non-numeric and limit to 10
                      val = val.replace(/\D/g, '');
                      if (val.length > 10) return;
                    }
                  }
                  setIdentifier(val);
                }}
                required
              />

              {/* Channel Switch - Only for OTP mode */}
              {loginMode === 'otp' && (
                <span className="switch-channel" onClick={() => {
                  setChannel(channel === 'sms' ? 'email' : 'sms');
                  setIdentifier('');
                }}>
                  {channel === 'sms' ? 'Use Email instead' : 'Use Mobile instead'}
                </span>
              )}
            </div>

            {/* Password - Only for Password Mode */}
            {loginMode === 'password' && !isSignup && (
              <div className="form-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password - Only for Password mode */}
            {loginMode === 'password' && !isSignup && (
              <div className="forgot-link-wrapper">
                <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
              </div>
            )}

            {/* Terms */}
            <p className="terms-text">
              By continuing, I agree to the <a href="/terms">Terms of Use</a> & <a href="/privacy">Privacy Policy</a>
            </p>

            {/* Submit Button */}
            <button type="submit" className="myntra-submit-btn" disabled={loading}>
              {loading ? <Loader2 className="spin" size={20} /> : 'CONTINUE'}
            </button>

            {/* Error Message */}
            {msg && (
              <div className={`myntra-msg ${msg.includes('✅') ? 'success' : 'error'}`}>
                ✕ {msg.replace('✅ ', '')}
              </div>
            )}
          </form>

          {/* Footer Links */}
          <div className="form-footer">
            <p>Have trouble logging in? <Link to="/contact">Get help</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
