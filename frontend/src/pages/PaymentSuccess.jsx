import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Truck, Mail, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';
import './cart.css';

export default function PaymentSuccess({ orderId, total, itemsCount, earnedCoins = 0 }) {
    const navigate = useNavigate();
    const [showCoins, setShowCoins] = useState(false);

    useEffect(() => {
        // Trigger confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff3f6c', '#fff', '#ffd700']
        });

        // Trigger coin pop after a small delay
        const timer = setTimeout(() => {
            setShowCoins(true);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="payment-success-overlay">
            <div className="success-content">
                <div className="success-animation-wrapper">
                    <div className="success-circle">
                        <CheckCircle size={80} color="#fff" strokeWidth={3} />
                    </div>
                    <div className="confetti"></div>
                </div>

                <h1 className="success-title">Order Placed Successfully!</h1>
                <p className="success-subtitle">Hurray! Your luxury shipment is being prepared.</p>

                {earnedCoins > 0 && (
                    <div className={`coin-reward-pop ${showCoins ? 'visible' : ''}`}>
                        <div className="coin-wrapper">
                            <Coins size={40} color="#ffd700" fill="#ffd700" />
                            <span className="coin-count">+{earnedCoins}</span>
                        </div>
                        <p>Aura Coins Earned!</p>
                    </div>
                )}

                <div className="order-summary-box">
                    <div className="summary-row">
                        <span>Order ID</span>
                        <strong>#{orderId}</strong>
                    </div>
                    <div className="summary-row">
                        <span>Paid Amount</span>
                        <strong>₹{total.toLocaleString()}</strong>
                    </div>
                    <div className="summary-row">
                        <span>Items</span>
                        <strong>{itemsCount} Products</strong>
                    </div>
                </div>

                <div className="notification-toast">
                    <Mail size={16} /> Confirmation sent to your registered email.
                </div>

                <div className="success-actions">
                    <button className="btn-track-primary" onClick={() => navigate('/profile')}>
                        <Truck size={18} /> TRACK ORDER
                    </button>
                    <button className="btn-continue-shopping" onClick={() => navigate('/')}>
                        CONTINUE SHOPPING
                    </button>
                </div>

                <div className="floating-elements">
                    <div className="f-item item-1">📦</div>
                    <div className="f-item item-2">👜</div>
                    <div className="f-item item-3">✨</div>
                </div>
            </div>
        </div>
    );
}

// Simple internal Mail icon if lucide fails or for variety
function Mail({ size, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );
}
