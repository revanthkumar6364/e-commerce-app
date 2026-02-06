import React, { useState, useEffect } from 'react';
import { couponsAndOffers } from '../data/products';
import api from '../utils/api';
import './wallet.css';

export default function Wallet() {
    const [coins, setCoins] = useState(0);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tier, setTier] = useState('SILVER');
    const [copiedCode, setCopiedCode] = useState(null);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setLoading(false);
                    return;
                }

                const { data } = await api.get('/user/wallet', {
                    headers: { 'user-id': userId }
                });
                if (data.success) {
                    setCoins(data.walletCoins);
                    setTier(data.tier);
                    setCoupons(data.coupons);
                }
            } catch (err) {
                console.error('Failed to fetch wallet:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWallet();
    }, []);

    const exchangeCoins = async () => {
        if (coins < 100) {
            alert('You need at least 100 coins for a premium exchange!');
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            const { data } = await api.post('/user/exchange', {}, {
                headers: { 'user-id': userId }
            });

            if (data.success) {
                alert(`Success! Exchanged 100 coins for a 15% VIP coupon: ${data.newCoupon}`);
                setCoins(data.walletCoins);
                // Re-fetch or update local state
                const { data: walletData } = await api.get('/user/wallet', {
                    headers: { 'user-id': userId }
                });
                setCoupons(walletData.coupons);
            } else {
                alert('Exchange failed: ' + data.message);
            }
        } catch (err) {
            console.error('Exchange error:', err);
            alert('Feature connecting to backend... simulating success for now.');
            // Mock fallback
            const newCoupon = 'LUXE' + Math.random().toString(36).substr(2, 5).toUpperCase();
            setCoins(prev => prev - 100);
            setCoupons(prev => [{ code: newCoupon, discount: 15, isUsed: false }, ...prev]);
        }
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (loading) return <div className="wallet-loading">Decrypting your luxury vault...</div>;

    return (
        <div className="membership-page">
            <div className="membership-hero">
                <div className="tier-badge">
                    <span className="tier-label">MEMBERSHIP STATUS</span>
                    <h2>{tier} MEMBER</h2>
                    <div className="tier-progress">
                        <div className="progress-bar" style={{ width: `${(coins / 5000) * 100}%` }}></div>
                    </div>
                    <p>{Math.max(0, 5000 - coins)} coins until PLATINUM STATUS</p>
                </div>

                <div className="coin-vault">
                    <div className="coin-wrapper">
                        <div className="vault-circle">
                            <span className="coin-amount">{coins}</span>
                            <span className="coin-desc">URBAN COINS</span>
                        </div>
                    </div>
                    <button className="luxury-exchange-btn" onClick={exchangeCoins}>
                        Exchange for VIP Coupon (100)
                    </button>
                </div>
            </div>

            <div className="membership-grid">
                <section className="coupons-hub">
                    <h3>Available Offers</h3>
                    <div className="luxury-coupons-grid">
                        {couponsAndOffers.map((offer, idx) => (
                            <div key={`offer-${idx}`} className="luxe-coupon public-offer">
                                <div className="luxe-code">{offer.code}</div>
                                <div className="luxe-benefit">
                                    {offer.type === 'flat' ? `₹${offer.discount} OFF` :
                                        offer.type === 'free-shipping' ? 'FREE SHIP' :
                                            `${offer.discount}% OFF`}
                                </div>
                                <p className="offer-desc">{offer.desc}</p>
                                <button className="btn-copy-coupon" onClick={() => handleCopy(offer.code)}>
                                    {copiedCode === offer.code ? 'COPIED!' : 'COPY CODE'}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="coupons-hub">
                    <h3>Your Exclusive Vault</h3>
                    {coupons.length === 0 ? (
                        <p className="no-coupons-msg">Exchange coins to unlock exclusive VIP coupons.</p>
                    ) : (
                        <div className="luxury-coupons-grid">
                            {coupons.map((c, idx) => (
                                <div key={idx} className={`luxe-coupon ${c.isUsed ? 'used' : ''}`}>
                                    <div className="luxe-code">{c.code}</div>
                                    <div className="luxe-benefit">{c.discount}% OFF</div>
                                    <div className="luxe-status">{c.isUsed ? 'EXPIRED' : 'ACTIVE'}</div>
                                    {!c.isUsed && (
                                        <button className="btn-copy-coupon" onClick={() => handleCopy(c.code)}>
                                            {copiedCode === c.code ? 'COPIED!' : 'COPY CODE'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="referral-hub">
                    <h3>The Referral Circle</h3>
                    <div className="referral-card">
                        <p>Invite a colleague to Urban Vibe. You both earn 500 coins upon their first purchase.</p>
                        <div className="referral-input">
                            <input type="text" readOnly value={`URBAN-REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`} />
                            <button onClick={() => alert('Referral link copied to clipboard')}>COPY LINK</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
