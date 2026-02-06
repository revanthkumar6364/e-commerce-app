import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShoppingBag, Heart, Zap, Gift, ArrowRight } from 'lucide-react';
import './Welcome.css';

export default function Welcome() {
    const navigate = useNavigate();
    const [user] = useState(() => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    });
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        // Hide confetti after animation
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const perks = [
        { icon: ShoppingBag, title: 'Personalized Shopping', desc: 'AI-powered recommendations just for you' },
        { icon: Heart, title: 'Save Favorites', desc: 'Build your wishlist and never miss a deal' },
        { icon: Zap, title: 'Express Checkout', desc: 'Lightning-fast orders with saved addresses' },
        { icon: Gift, title: 'Welcome Bonus', desc: '₹500 off on your first purchase!' }
    ];

    return (
        <div className="welcome-page">
            {showConfetti && <div className="confetti-bg"></div>}

            <div className="welcome-container">
                <div className="welcome-header">
                    <div className="sparkle-icon">
                        <Sparkles size={60} />
                    </div>
                    <h1>Welcome to Urban Vibe! 🎉</h1>
                    <p className="welcome-subtitle">
                        {user?.name ? `Hi ${user.name}!` : 'Hello!'} Your account is now verified and ready to go.
                    </p>
                </div>

                <div className="perks-grid">
                    {perks.map((perk, idx) => (
                        <div key={idx} className="perk-card">
                            <div className="perk-icon">
                                <perk.icon size={28} />
                            </div>
                            <h3>{perk.title}</h3>
                            <p>{perk.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="welcome-cta">
                    <button onClick={() => navigate('/')} className="btn-explore">
                        Start Shopping <ArrowRight size={20} />
                    </button>
                    <button onClick={() => navigate('/profile')} className="btn-profile">
                        Complete Profile
                    </button>
                </div>

                <div className="promo-banner">
                    <Gift className="gift-icon" />
                    <div>
                        <h4>Exclusive First-Time Offer!</h4>
                        <p>Use code <span className="promo-code">WELCOME500</span> for ₹500 off on orders above ₹2000</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
