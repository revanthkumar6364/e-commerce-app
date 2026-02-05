import { useState } from 'react';
import { couponsAndOffers } from '../data/products';
import './coupons.css';

export default function CouponsDisplay() {
  const [copied, setCopied] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="coupons-section">
      <div className="coupons-header">
        <h2>🎯 Exclusive Offers for You</h2>
        <p>Use these coupon codes to get amazing discounts on your purchases</p>
      </div>

      <div className="coupons-grid">
        {couponsAndOffers.map((coupon) => (
          <div key={coupon.code} className="coupon-card">
            <div className="coupon-badge">
              {coupon.type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
              {coupon.type === 'free-shipping' && '🚚'}
            </div>
            <div className="coupon-content">
              <h3>{coupon.desc}</h3>
              <p className="min-amount">
                {coupon.minAmount > 0 ? `Min purchase: ₹${coupon.minAmount}` : 'No minimum purchase'}
              </p>
              <div className="coupon-code-section">
                <code className="coupon-code">{coupon.code}</code>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(coupon.code)}
                  title="Copy code"
                >
                  {copied === coupon.code ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="first-time-banner">
        <h3>🎁 New Member Bonus</h3>
        <p>Get <strong>WELCOME15</strong> for 15% off on your first order! Use code at checkout.</p>
      </div>
    </section>
  );
}
