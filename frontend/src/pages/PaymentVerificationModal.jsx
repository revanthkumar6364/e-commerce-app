import { useState, useEffect } from 'react';
import { ShieldCheck, Smartphone, Mail, X } from 'lucide-react';
import './cart.css';

export default function PaymentVerificationModal({ onVerify, onClose }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [method, setMethod] = useState('email'); // 'email' or 'sms'
    const [message, setMessage] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const sendOTP = async () => {
        if (resendTimer > 0) return;

        setMessage('Sending OTP...');
        try {
            const response = await fetch('http://127.0.0.1:5000/user/send-otp', {
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
                setResendTimer(30); // Start 30s countdown
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Send OTP Error:', error);
            setMessage('Failed to send OTP. Try again.');
        }
    };

    // Auto-read logic for SMS
    useEffect(() => {
        let pollTimer;
        if (method === 'sms' && otp.join('').length === 0) {
            pollTimer = setInterval(async () => {
                try {
                    const response = await fetch('http://127.0.0.1:5000/user/notifications', {
                        headers: { 'user-id': '65c1a2b3e4b0c1a2b3e4b0c1' }
                    });
                    const data = await response.json();
                    if (data.success) {
                        const sms = data.notifications.find(n => n.type === 'SMS' && n.message.includes('OTP'));
                        if (sms) {
                            const match = sms.message.match(/\b\d{6}\b/);
                            if (match && match[0]) {
                                console.log('Auto-reading OTP from SMS:', match[0]);
                                setOtp(match[0].split(''));
                                setMessage('Auto-read from SMS simulation');
                            }
                        }
                    }
                } catch (e) {
                    console.error('Auto-read scan failed', e);
                }
            }, 3000); // Check every 3s
        }
        return () => clearInterval(pollTimer);
    }, [method, otp.join('')]);

    // Resend Timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        sendOTP();
    }, [method]);

    const handleChange = (index, value) => {
        // Handle pasting of full code
        if (value.length > 1) {
            const pastedCode = value.replace(/\D/g, '').substring(0, 6);
            if (pastedCode.length === 6) {
                setOtp(pastedCode.split(''));
                document.getElementById('otp-5')?.focus();
                return;
            }
        }

        // Handle single digit (including overwrite)
        const char = value.length > 0 ? value[value.length - 1] : '';
        if (char && !/^\d$/.test(char)) return; // Only digits

        const newOtp = [...otp];
        newOtp[index] = char;
        setOtp(newOtp);

        // Auto-focus move logic
        if (char && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                const prevInput = document.getElementById(`otp-${index - 1}`);
                if (prevInput) prevInput.focus();
            }
        }
    };

    const handleVerify = async () => {
        console.log('--- START VERIFICATION ---');
        console.log('OTP Entered:', otp.join(''));
        setIsVerifying(true);
        setMessage('');
        try {
            console.log('Fetching from backend...');
            const response = await fetch('http://127.0.0.1:5000/user/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': '65c1a2b3e4b0c1a2b3e4b0c1'
                },
                body: JSON.stringify({ otp: otp.join('') })
            });

            console.log('Response Status:', response.status);
            const data = await response.json();
            console.log('Response Data:', data);

            if (data.success) {
                console.log('Verification Success, triggering onVerify...');
                onVerify();
                // We keep isVerifying true because the modal will close soon anyway
            } else {
                console.log('Verification Failed:', data.message);
                setMessage(data.message || 'Invalid OTP');
                setIsVerifying(false);
            }
        } catch (error) {
            console.error('Verify OTP Error:', error);
            setMessage('Error connecting to server. Please check your connection.');
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
                        color: message.includes('Error') || message.includes('Failed') ? '#ff3f6c' : '#20bd99',
                        marginBottom: '20px',
                        fontWeight: '600',
                        background: message.includes('Error') || message.includes('Failed') ? '#fff1f0' : '#e6f7f3',
                        padding: '8px',
                        borderRadius: '4px'
                    }}>
                        {message}
                    </div>
                )}

                <div className="method-toggle" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                    <button
                        className={`otp-method-btn ${method === 'email' ? 'active' : ''}`}
                        onClick={() => { setMethod('email'); setOtp(['', '', '', '', '', '']); setMessage(''); }}
                    >
                        <Mail size={16} /> Email
                    </button>
                    <button
                        className={`otp-method-btn ${method === 'sms' ? 'active' : ''}`}
                        onClick={() => { setMethod('sms'); setOtp(['', '', '', '', '', '']); setMessage(''); }}
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
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => handleChange(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            onFocus={(e) => e.target.select()}
                            autoComplete="one-time-code"
                            style={{
                                width: '40px',
                                height: '50px',
                                textAlign: 'center',
                                fontSize: '20px',
                                fontWeight: '700',
                                border: '1px solid #d4d5d9',
                                borderRadius: '4px',
                                outline: 'none',
                                borderColor: digit ? '#ff3f6c' : '#d4d5d9'
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
                    Didn't receive the code? {resendTimer > 0 ? (
                        <span style={{ fontWeight: '700', color: '#94969f' }}>Resend in {resendTimer}s</span>
                    ) : (
                        <span onClick={sendOTP} style={{ color: '#ff3f6c', fontWeight: '700', cursor: 'pointer' }}>Resend</span>
                    )}
                </p>
            </div>
        </div>
    );
}
