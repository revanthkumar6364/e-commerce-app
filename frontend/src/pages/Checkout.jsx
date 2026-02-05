import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShieldCheck, MapPin, CreditCard } from 'lucide-react';
import './checkout.css';

export default function Checkout() {
  const { items, total, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', zip: '', address: '', city: '', state: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Prices
  const discount = 500; // Mock Discount for visual
  const shipping = total > 999 ? 0 : 99;
  const finalTotal = total + shipping - discount;

  const handlePlaceOrder = async () => {
    if (!form.name || !form.address) {
      alert('Please fill in address details');
      return;
    }
    setLoading(true);
    // Simulate API
    setTimeout(() => {
      const orderId = 'ORD-' + Math.floor(Math.random() * 100000);

      // Build simple payload for confirmation page
      const orderPayload = {
        orderId,
        total: finalTotal > 0 ? finalTotal : 0,
        items,
        shippingAddress: form.address,
        payment: { method: paymentMethod, status: 'SUCCESS' }
      };

      clearCart();
      setLoading(false);
      alert(`✅ Order Placed Successfully! (${orderId})`);
      navigate('/confirmation', { state: orderPayload });
    }, 1500);
  };

  if (items.length === 0) return <div style={{ padding: 40, textAlign: 'center' }}><h2>Bag is Empty</h2></div>;

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* LEFT: FORMS */}
        <div className="checkout-main">

          {/* ADDRESS SECTION */}
          <div className="checkout-step">
            <h2><MapPin size={18} /> Delivery Address</h2>
            <div className="form-grid">
              <input className="input-field" name="name" placeholder="Full Name *" onChange={handleInput} />
              <input className="input-field" name="phone" placeholder="Mobile No *" onChange={handleInput} />
              <input className="input-field" name="zip" placeholder="Pincode *" onChange={handleInput} />
              <input className="input-field" name="city" placeholder="City *" onChange={handleInput} />
              <input className="input-field form-group-full" name="address" placeholder="Address (House No, Building, Street) *" onChange={handleInput} />
            </div>
          </div>

          {/* PAYMENT SECTION */}
          <div className="checkout-step">
            <h2><CreditCard size={18} /> Payment Options</h2>
            <div className="payment-options-vertical">

              <label className={`payment-tab ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input type="radio" name="pay" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <span className="payment-icon">💵</span>
                <span>Cash On Delivery (Cash/UPI)</span>
              </label>

              <label className={`payment-tab ${paymentMethod === 'upi' ? 'active' : ''}`}>
                <input type="radio" name="pay" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                <span className="payment-icon">📱</span>
                <span>PhonePe / Google Pay / UPI</span>
              </label>

              <label className={`payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input type="radio" name="pay" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                <span className="payment-icon">💳</span>
                <span>Credit / Debit Card</span>
              </label>

            </div>

            {/* MOCK PAYMENT DETAILS */}
            <div className="payment-details-panel">
              {paymentMethod === 'cod' && <p>Pay cash or via UPI at the time of delivery.</p>}
              {paymentMethod === 'upi' && <p>You will be redirected to your UPI app.</p>}
              {paymentMethod === 'card' && <p>Redirecting to Secure Payment Gateway...</p>}
            </div>
          </div>

        </div>

        {/* RIGHT: PRICE DETAILS */}
        <div className="price-details-container">
          <div className="price-details-card">
            <div className="price-header">Price Details ({items.length} Items)</div>

            <div className="checkout-mini-items">
              {items.map(i => (
                <div key={i.id} className="mini-item">
                  <img src={i.image} alt="" />
                  <div>
                    <div>{i.title}</div>
                    <div style={{ fontWeight: 'bold' }}>₹{i.price}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="price-row">
              <span>Total MRP</span>
              <span>₹{total}</span>
            </div>
            <div className="price-row">
              <span>Discount on MRP</span>
              <span className="text-teal">-₹{discount}</span>
            </div>
            <div className="price-row">
              <span>Shipping Fee</span>
              <span className="text-teal">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="price-row total">
              <span>Total Amount</span>
              <span>₹{finalTotal > 0 ? finalTotal : 0}</span>
            </div>

            <button className="btn-place-order" onClick={handlePlaceOrder} disabled={loading}>
              {loading ? 'PROCESSING...' : 'PLACE ORDER'}
            </button>

            <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555' }}>
              <ShieldCheck size={14} /> Safe and Secure Payments. 100% Authentic products.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
