import { useState, useEffect } from 'react';
import { X, Mail } from 'lucide-react';
import './NewsletterPopup.css';

export default function NewsletterPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Show popup after 5 seconds
        const timer = setTimeout(() => {
            // Check if already shown in this session
            if (!sessionStorage.getItem('newsletterShown')) {
                setIsVisible(true);
                sessionStorage.setItem('newsletterShown', 'true');
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 3000);
    };

    if (!isVisible) return null;

    return (
        <div className="newsletter-overlay">
            <div className="newsletter-box">
                <div className="newsletter-content">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="newsletter-close-btn"
                    >
                        <X size={20} />
                    </button>

                    {!submitted ? (
                        <>
                            <div className="newsletter-icon-wrapper">
                                <Mail size={24} />
                            </div>
                            <h3 className="newsletter-title">Unlock 15% Off</h3>
                            <p className="newsletter-desc">Subscribe to our newsletter and get exclusive access to drops and discounts.</p>

                            <form onSubmit={handleSubmit} className="newsletter-form">
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    className="newsletter-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="newsletter-submit-btn"
                                >
                                    Get My Code
                                </button>
                            </form>
                            <p className="newsletter-privacy">We respect your privacy. Unsubscribe anytime.</p>
                        </>
                    ) : (
                        <div className="newsletter-success">
                            <div className="success-check">✓</div>
                            <h3 className="success-title">You're on the list!</h3>
                            <p className="success-desc">Check your inbox for your coupon code.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
