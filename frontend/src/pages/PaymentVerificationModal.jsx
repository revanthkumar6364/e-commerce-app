import { useState, useEffect } from 'react';
import { ShieldCheck, Smartphone, Mail, X } from 'lucide-react';
import './cart.css';

export default function PaymentVerificationModal({ email, phone, onVerify, onClose }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [method, setMethod] = useState('email'); // 'email' or 'sms'
    const [message, setMessage] = useState('');

    const sendOTP = async () => {
        setMessage('Sending OTP...');
        try {
            const response = await fetch('http://localhost:5000/user/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': '65c1a2b3e4b0c1a2b3e4b0c1'
                },
                body: JSON.stringify({ method })
            });
            const data = await response.json();
            if (data.success) {
                setMessage(`OTP sent to your ${method}`);
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Send OTP Error:', error);
            setMessage('Failed to send OTP. Try again.');
        }
    };

    useEffect(() => {
        sendOTP();
    }, [method]);

    const handleChange = (index, value) => {
        if (value.length > 1) value = value[0];
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleVerify = async () => {
        setIsVerifying(true);
        setMessage('');
        try {
            const response = await fetch('http://localhost:5000/user/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': '65c1a2b3e4b0c1a2b3e4b0c1'
                },
                body: JSON.stringify({ otp: otp.join('') })
            });
            const data = await response.json();
            if (data.success) {
                onVerify();
            } else {
                setMessage(data.message || 'Invalid OTP');
                setIsVerifying(false);
            }
        } catch (error) {
            console.error('Verify OTP Error:', error);
            setMessage('Error verifying OTP');
            setIsVerifying(false);
        }
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 3000 }}>
            <div className="address-modal" style={{ width: '400px', textAlign: 'center', padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <div className="verification-icon-large">
                    <ShieldCheck size={64} color="#20bd99" />
                </div>

                <h2 style={{ fontSize: '20px', margin: '20px 0 10px' }}>Verify Payment</h2>
                <p style={{ fontSize: '14px', color: '#696e79', marginBottom: '10px' }}>
                    A verification code has been sent to your {method === 'email' ? 'registered email' : 'mobile number'}.
                </p>

                {message && (
                    <div style={{
                        fontSize: '12px',
                        color: message.startsWith('Error') || message.startsWith('Failed') ? '#ff3f6c' : '#20bd99',
                        marginBottom: '20px',
                        fontWeight: '600',
                        background: message.startsWith('Error') || message.startsWith('Failed') ? '#fff1f0' : '#e6f7f3',
                        padding: '8px',
                        borderRadius: '4px'
                    }}>
                        {message}
                    </div>
                )}

                <div className="method-toggle" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                    <button
                        className={`otp-method-btn ${method === 'email' ? 'active' : ''}`}
                        onClick={() => setMethod('email')}
                    >
                        <Mail size={16} /> Email
                    </button>
                    <button
                        className={`otp-method-btn ${method === 'sms' ? 'active' : ''}`}
                        onClick={() => setMethod('sms')}
                    >
                        <Smartphone size={16} /> SMS
                    </button>
                </div>

                <div className="otp-input-container" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            id={`otp-${idx}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            style={{
                                width: '40px',
                                height: '50px',
                                textAlign: 'center',
                                fontSize: '20px',
                                fontWeight: '700',
                                border: '1px solid #d4d5d9',
                                borderRadius: '4px',
                                outline: 'none'
                            }}
                        />
                    ))}
                </div>

                <button
                    className="btn-place-order"
                    onClick={handleVerify}
                    disabled={otp.join('').length < 6 || isVerifying}
                    style={{ margin: 0, opacity: isVerifying ? 0.7 : 1 }}
                >
                    {isVerifying ? 'VERIFYING...' : 'COMPLETE PURCHASE'}
                </button>

                <p style={{ marginTop: '20px', fontSize: '12px', color: '#94969f' }}>
                    Didn't receive the code? <span onClick={sendOTP} style={{ color: '#ff3f6c', fontWeight: '700', cursor: 'pointer' }}>Resend</span>
                </p>
            </div>
        </div>
    );
}
