import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { couponsAndOffers, products } from '../data/products';
import { ShieldCheck, ChevronDown, Check, X } from 'lucide-react';
import AddressModal from './AddressModal';
import PaymentVerificationModal from './PaymentVerificationModal';
import PaymentSuccess from './PaymentSuccess';
import './cart.css';

export default function Cart() {
  const { items, removeItem, total, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ADDRESS STATE
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({
    name: 'Revanth Kumar',
    pincode: '560021',
    address: '37/9, 7th Cross, Hsr Extension, Bangalore, Karnataka'
  });

  // CHECKOUT FLOW STATE
  const [showVerification, setShowVerification] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // EMPTY STATE
  if (items.length === 0 && !orderSuccess) { // Added !orderSuccess to prevent empty cart screen after successful order
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <div className="empty-icon">
            {/* Premium Animated Urban Vibe Empty Bag SVG */}
            <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" className="premium-empty-svg">
              <defs>
                <linearGradient id="bagGradientPremium" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff3f6c" stopOpacity="0.3">
                    <animate attributeName="stop-opacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="#ff905a" stopOpacity="0.3">
                    <animate attributeName="stop-opacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
                  </stop>
                </linearGradient>
                <filter id="bagGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Pulsing background circle */}
              <circle cx="90" cy="90" r="70" fill="url(#bagGradientPremium)" opacity="0.15">
                <animate attributeName="r" values="65;75;65" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Shopping Bag with animation */}
              <g filter="url(#bagGlow)" className="floating-bag">
                <rect x="50" y="60" width="80" height="90" rx="6" fill="url(#bagGradientPremium)" stroke="#ff3f6c" strokeWidth="2" opacity="0.6">
                  <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite" />
                </rect>

                {/* Bag Handle with swing */}
                <path d="M 65 60 Q 65 35, 90 35 Q 115 35, 115 60" stroke="#ff3f6c" strokeWidth="3.5" fill="none" strokeLinecap="round">
                  <animateTransform attributeName="transform" type="rotate" values="0 90 60; -3 90 60; 3 90 60; 0 90 60" dur="4s" repeatCount="indefinite" />
                </path>

                {/* UV Letters with glow */}
                <text x="90" y="112" fontFamily="'Poppins', Arial, sans-serif" fontSize="32" fontWeight="900" fill="#ff3f6c" textAnchor="middle" opacity="0.7">
                  UV
                </text>

                {/* Star sparkles */}
                <circle cx="70" cy="80" r="2" fill="#ffd700" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="110" cy="85" r="2" fill="#ffd700" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
                </circle>
                <circle cx="90" cy="130" r="2" fill="#ffd700" opacity="0.6">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="1s" />
                </circle>
              </g>

              {/* Floating animation */}
              <animateTransform attributeName="transform" type="translate" values="0 0; 0 -5; 0 0" dur="3s" repeatCount="indefinite" />
            </svg>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#282c3f', marginBottom: '10px' }}>Hey, it feels so light!</h2>
          <p style={{ fontSize: '14px', color: '#7e818c', marginBottom: '30px' }}>There is nothing in your bag. Let's add some items.</p>
          <Link to="/wishlist" className="btn-wishlist-add" style={{
            border: '1px solid #ff3f6c',
            color: '#ff3f6c',
            background: '#fff',
            padding: '12px 25px',
            fontWeight: '700',
            textDecoration: 'none',
            fontSize: '14px',
            borderRadius: '2px',
            textTransform: 'uppercase'
          }}>
            ADD ITEMS FROM WISHLIST
          </Link>
        </div>
      </div>
    );
  }

  // COUPON LOGIC (PRESERVED)
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    const code = couponCode.trim().toUpperCase();
    const offer = couponsAndOffers.find(c => c.code === code);

    if (offer) {
      if (total < offer.minAmount) {
        alert(`Add items worth ₹${offer.minAmount - total} more to use this code.`);
        setAppliedCoupon(null);
        return;
      }
      setAppliedCoupon(offer);
      alert('Coupon applied successfully!');
    } else {
      alert('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // CALCULATIONS
  const shippingCost = total > 500 ? 0 : 99;
  let discountAmount = 0;
  let finalShipping = shippingCost;
  const platformFee = 20; // Mock Platform Fee as per screenshot

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = Math.round((total * appliedCoupon.discount) / 100);
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = appliedCoupon.discount;
    } else if (appliedCoupon.type === 'free-shipping') {
      finalShipping = 0;
    }
  }

  // const tax = Math.round((total - discountAmount) * 0.05);
  // Myntra screenshot shows "Total MRP", "Discount on MRP", "Coupon Discount", "Platform Fee", "Shipping Fee"
  // Let's adapt closer to that structure

  const totalMRP = Math.round(total * 1.2); // Mock: Assume current price is discounted, so MRP is higher
  const productDiscount = totalMRP - total;
  const finalTotal = total - discountAmount + finalShipping + platformFee;

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    setIsPlacingOrder(true);
    setShowVerification(true);
  };

  const onPaymentVerify = async () => {
    setIsPlacingOrder(true);
    try {
      const response = await fetch('http://localhost:5000/user/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': '65c1a2b3e4b0c1a2b3e4b0c1' // Using the same mock ID for now
        },
        body: JSON.stringify({
          items: items,
          totalAmount: finalTotal,
          address: {
            name: user?.name || 'Aura Customer',
            address: '12 Luxury Lane, Beverly Hills, CA 90210' // Mock for now
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setOrderSuccess({
          orderId: data.order.orderId,
          total: data.order.total,
          items: items,
          earnedCoins: data.earnedCoins
        });
        clearCart();
        setShowVerification(false);
      } else {
        alert(data.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Order Placement Error:', error);
      alert('Error connecting to server');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="cart-page-wrapper">
      {/* HEADER STEPPER */}
      <header className="cart-stepper">
        <Link to="/" style={{ position: 'absolute', left: '40px', textDecoration: 'none' }}>
          <span style={{ fontSize: '24px', fontWeight: '800', color: '#ff3f6c', letterSpacing: '-0.5px' }}>Urban Vibe</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="step active">BAG</span>
          <span className="step-divider"></span>
          <span className="step">ADDRESS</span>
          <span className="step-divider"></span>
          <span className="step">PAYMENT</span>
        </div>
        <div className="secure-icon">
          <ShieldCheck size={16} color="#20bd99" /> 100% SECURE
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="cart-two-column">

        {/* --- LEFT COLUMN --- */}
        <div className="cart-user-flow">

          {/* ADDRESS STRIP */}
          <div className="address-strip">
            <div className="address-details">
              <h4>Deliver to: <strong>{selectedAddress.name}, {selectedAddress.pincode}</strong></h4>
              <p>{selectedAddress.address.substring(0, 40)}...</p>
            </div>
            <button className="btn-change-address" onClick={() => setShowAddressModal(true)}>CHANGE ADDRESS</button>
          </div>

          {/* OFFERS STRIP */}
          <div className="offers-strip">
            <div className="offers-header">
              <span style={{ color: '#ff3f6c' }}>%</span> Available Offers
            </div>
          </div>

          {/* SELECTED ITEMS */}
          <div className="cart-items-container">
            <div className="selected-items-header">
              <span>{items.length} ITEMS SELECTED</span>
              <button onClick={clearCart} style={{ border: 'none', background: 'none', fontWeight: 700, color: '#282c3f', cursor: 'pointer', fontSize: '12px' }}>REMOVE ALL</button>
            </div>

            {items.map(item => (
              <div className="cart-item-card" key={item.id}>
                <button className="btn-remove-item" onClick={() => removeItem(item.id)}>
                  <X size={16} />
                </button>
                <div className="cart-item-main">
                  <input type="checkbox" checked className="item-checkbox" readOnly />
                  <img src={item.image} alt={item.title} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h3 className="cart-brand">{item.brand || 'Brand Name'}</h3>
                    <h4 className="cart-title">{item.title}</h4>
                    <p className="cart-sold-by">Sold By: OmniTech Retail</p>

                    <div className="cart-selectors">
                      <button className="selector-chip">
                        Size: {item.selectedSize || 'M'} <ChevronDown size={12} />
                      </button>
                      <button className="selector-chip">
                        Qty: {item.qty} <ChevronDown size={12} />
                      </button>
                    </div>

                    <div className="cart-price-line">
                      <span className="cp-current">₹{item.price}</span>
                      {/* Mock Original Price for visual fullness */}
                      <span className="cp-original">₹{Math.round(item.price * 1.3)}</span>
                      <span className="cp-off">30% OFF</span>
                    </div>

                    <div className="return-info">
                      <span style={{ fontWeight: 700 }}>14 days</span> return available
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="cart-price-flow">

          {/* COUPONS */}
          <div className="coupons-section">
            <div className="coupons-header">COUPONS</div>
            {!appliedCoupon ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="apply-coupon-btn" onClick={() => {
                  const code = prompt("Enter Coupon Code (TRY: MYNTRA200):");
                  if (code) { setCouponCode(code); handleApplyCoupon(); }
                }}>
                  <span>Apply Coupons</span>
                  <span style={{ border: '1px solid #ff3f6c', padding: '2px 8px', borderRadius: '2px' }}>APPLY</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span className="green-text">Coupon {appliedCoupon.code} Applied</span>
                <button onClick={removeCoupon} style={{ border: 'none', background: 'none', textDecoration: 'underline', cursor: 'pointer' }}>Remove</button>
              </div>
            )}
          </div>

          {/* GIFTING (Static Mock) */}
          <div className="price-block" style={{ marginBottom: '16px' }}>
            <div className="price-header">GIFTING & PERSONALIZATION</div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '12px' }}>
              <div style={{ width: '40px' }}>🎁</div>
              <div>
                <strong>Buying for a loved one?</strong><br />
                Gift wrap and personalized message on card, Only for ₹25
              </div>
            </div>
          </div>

          {/* PRICE DETAILS */}
          <div className="price-block">
            <div className="price-header">PRICE DETAILS ({items.length} Items)</div>

            <div className="price-row">
              <span>Total MRP</span>
              <span>₹{totalMRP}</span>
            </div>
            <div className="price-row">
              <span>Discount on MRP</span>
              <span className="green-text">-₹{productDiscount}</span>
            </div>
            <div className="price-row">
              <span>Coupon Discount</span>
              {discountAmount > 0 ? (
                <span className="green-text">-₹{discountAmount}</span>
              ) : (
                <span style={{ color: '#ff3f6c', cursor: 'pointer' }}>Apply Coupon</span>
              )}
            </div>
            <div className="price-row">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="price-row">
              <span>Shipping Fee</span>
              <span>{finalShipping === 0 ? <span className="green-text">FREE</span> : `₹${finalShipping} `}</span>
            </div>

            <div className="price-row total">
              <span>Total Amount</span>
              <span>₹{finalTotal}</span>
            </div>

            <button
              className="btn-place-order"
              onClick={handlePlaceOrder}
              disabled={items.length === 0 || isPlacingOrder}
            >
              {isPlacingOrder ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </button>
          </div>

        </div>
      </div>

      {/* YOU MAY ALSO LIKE */}
      <div className="may-like-section">
        <h3 className="may-like-header">You may also like:</h3>
        <div className="may-like-grid">
          {products.slice(0, 6).map(p => (
            <div key={p.id} className="ml-card">
              <img src={p.image} alt={p.title} className="ml-img" />
              <h4 style={{ fontSize: '12px', margin: '5px 0' }}>{p.title.substring(0, 50)}...</h4>
              <strong style={{ fontSize: '12px' }}>₹{p.price}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <AddressModal
          onClose={() => setShowAddressModal(false)}
          selectedId={selectedAddress.id || 1}
          onSelectAddress={(addr) => {
            setSelectedAddress({
              id: addr.id,
              name: addr.name,
              pincode: addr.state.split('-')[1]?.trim() || '560021',
              address: addr.address
            });
            setShowAddressModal(false);
          }}
        />
      )}

      {showVerification && (
        <PaymentVerificationModal
          onClose={() => {
            setShowVerification(false);
            setIsPlacingOrder(false);
          }}
          onVerify={onPaymentVerify}
        />
      )}

      {orderSuccess && (
        <PaymentSuccess
          orderId={orderSuccess.orderId}
          total={orderSuccess.total}
          itemsCount={orderSuccess.items.length}
          earnedCoins={orderSuccess.earnedCoins}
        />
      )}
    </div>
  );
}
