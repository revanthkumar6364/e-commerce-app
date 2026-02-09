import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { X } from 'lucide-react';
import './wishlist.css';

export default function Wishlist() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch {
      return [];
    }
  });

  const { addItem } = useContext(CartContext);

  // Sync with LocalStorage on Mount removed as it's now initialized directly

  const handleRemove = (id) => {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
  };

  const handleMoveToBag = (item) => {
    // Add default price if missing (Wishlist items might come from minimal data)
    addItem({
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.price || 999,
      brand: item.brand || 'Urban Vibe',
      qty: 1
    });
    // Optional: Remove from wishlist after adding to bag? 
    // Usually standard e-commerce behavior retains it or asks, but let's keep it simple: Keep it.
    alert('✅ Moved to Bag');
  };

  if (items.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty">
          <div className="wishlist-empty-img">
            {/* Premium Animated Urban Vibe Empty Wishlist SVG */}
            <svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" className="premium-wishlist-svg">
              <defs>
                <linearGradient id="wishlistGradientPremium" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff3f6c" stopOpacity="0.25">
                    <animate attributeName="stop-opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="#ff905a" stopOpacity="0.25">
                    <animate attributeName="stop-opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" begin="0.5s" />
                  </stop>
                </linearGradient>
                <filter id="heartGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Pulsing circles */}
              <circle cx="75" cy="70" r="50" fill="url(#wishlistGradientPremium)" opacity="0.1">
                <animate attributeName="r" values="45;55;45" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Heart Shape with pulse animation */}
              <g filter="url(#heartGlow)">
                <path d="M 75 40 A 18 18 0 0 0 40 40 A 18 18 0 0 0 40 76 L 75 110 L 110 76 A 18 18 0 0 0 110 40 A 18 18 0 0 0 75 40 Z"
                  fill="url(#wishlistGradientPremium)"
                  stroke="#ff3f6c"
                  strokeWidth="2"
                  opacity="0.7">
                  <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" />
                  <animateTransform attributeName="transform" type="scale" values="1 1;1.05 1.05;1 1" dur="2s" repeatCount="indefinite" additive="sum" />
                </path>

                {/* UV Text with shine */}
                <text x="75" y="78" fontFamily="'Poppins', Arial, sans-serif" fontSize="24" fontWeight="900" fill="#ff3f6c" textAnchor="middle" opacity="0.8">
                  UV
                </text>

                {/* Heart sparkles */}
                <circle cx="55" cy="55" r="2" fill="#ffd700">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="95" cy="60" r="2" fill="#ffd700">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" begin="0.6s" />
                </circle>
                <circle cx="75" cy="95" r="2" fill="#ffd700">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" begin="1.2s" />
                </circle>
              </g>

              {/* Floating animation */}
              <animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="3s" repeatCount="indefinite" />
            </svg>
          </div>
          <h2>YOUR WISHLIST IS EMPTY</h2>
          <p>Add items that you like to your wishlist. Review them anytime and easily move them to the bag.</p>
          <Link to="/" className="btn-continue">CONTINUE SHOPPING</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>
      <p className="wishlist-count">{items.length} Items</p>

      <div className="wishlist-grid">
        {items.map(item => (
          <div key={item.id} className="wishlist-card">
            <div className="wishlist-img-box">
              <img src={item.image} alt={item.title} />
              <button className="btn-remove-cross" onClick={() => handleRemove(item.id)}>
                <X size={14} strokeWidth={2.5} />
              </button>
              {/* Mock Out of Stock for demo purposes (randomly applied or if specified) */}
              {!item.inStock && (
                <div className="out-of-stock-overlay">
                  <span>OUT OF STOCK</span>
                </div>
              )}
            </div>
            <div className="wishlist-text-content">
              <div className="wishlist-info">
                <h3>{item.title}</h3>
                <div className="wishlist-price">
                  Rs. {item.price || '999'}
                  <span className="discount-off">(50% OFF)</span>
                </div>
              </div>
            </div>
            {item.inStock ? (
              <button className="btn-move-bag" onClick={() => handleMoveToBag(item)}>
                MOVE TO BAG
              </button>
            ) : (
              <button className="btn-move-bag disabled" disabled>
                OUT OF STOCK
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
