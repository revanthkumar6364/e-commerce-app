import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Truck, Mail, Coins, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import './cart.css';

export default function PaymentSuccess({ orderId, total, itemsCount, earnedCoins = 0 }) {
    const navigate = useNavigate();
    const [showCoins, setShowCoins] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Premium Gold Rain Confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#ffd700', '#ffae00', '#fff'] });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#ffd700', '#ffae00', '#fff'] });
        }, 250);

        // Trigger coin pop after a small delay
        const timer = setTimeout(() => {
            setShowCoins(true);
        }, 800);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const copyOrderId = () => {
        navigator.clipboard.writeText(orderId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
                    <div className="summary-row premium">
                        <span>Order ID</span>
                        <div className="order-id-copy" onClick={copyOrderId}>
                            <strong>#{orderId}</strong>
                            {copied ? <Check size={14} color="#20bd99" /> : <Copy size={14} color="#ff3f6c" />}
                            {copied && <span className="copy-toast">Copied!</span>}
                        </div>
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


