import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './confirmation.css';

export default function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Generate stable random values for this mount
  const [randomInfo] = useState(() => {
    const contact = Math.random().toString().slice(2, 12);
    const persons = ['Raj Kumar', 'Priya Singh', 'Arun Patel', 'Neha Sharma', 'Vikram Gupta'];
    const person = persons[Math.floor(Math.random() * persons.length)];
    const shipId = 'SHIP' + Math.random().toString(36).substr(2, 9).toUpperCase();
    return { deliveryContact: contact, deliveryPerson: person, shippingId: shipId };
  });

  if (!state) {
    navigate('/products');
    return null;
  }

  const { orderId, total, shippingAddress, items, estimatedDelivery, placedAt, payment, customerDetails } = state;
  const { deliveryContact, deliveryPerson, shippingId } = randomInfo;

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="conf-icon">🎉</div>
        <h1>Thank you for your order!</h1>
        <div className="order-id-display">
          <p>Order ID</p>
          <div className="id-copy-box">
            <strong>{orderId}</strong>
            <button
              className="copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(orderId);
                alert('Order ID copied to clipboard!');
              }}
              title="Copy Order ID"
            >
              📋 Copy
            </button>
          </div>
        </div>
        <div className="conf-row">
          <div>
            <h3>Shipping To</h3>
            <p className="muted">{shippingAddress}</p>
          </div>
          <div>
            <h3>Order Total</h3>
            <p className="total">₹{total}</p>
          </div>
        </div>

        {payment && (
          <div className="payment-success-section">
            <h3>✅ Payment Successful</h3>
            <div className="payment-details-grid">
              <div className="payment-detail">
                <span className="label">Method</span>
                <span className="value">{payment.methodDisplay || (payment.method === 'upi' ? '📱 UPI' : payment.method === 'razorpay' ? '💳 Card (Razorpay)' : '💳 Card')}</span>
              </div>
              <div className="payment-detail">
                <span className="label">Transaction ID</span>
                <span className="value code">{payment.transactionId}</span>
              </div>
              <div className="payment-detail">
                <span className="label">Amount</span>
                <span className="value">₹{payment.amount}</span>
              </div>
              <div className="payment-detail">
                <span className="label">Status</span>
                <span className="value status-success">{payment.status}</span>
              </div>
              <div className="payment-detail">
                <span className="label">Timestamp</span>
                <span className="value">{payment.timestamp}</span>
              </div>
            </div>
          </div>
        )}

        <div className="shipped-email-section">
          <h3>📦 Shipped Notification Email</h3>
          <div className="receipt-card shipped">
            <div className="receipt-header">
              <span className="receipt-label">To:</span>
              <span className="receipt-value">{customerDetails?.email}</span>
            </div>
            <div className="receipt-header">
              <span className="receipt-label">Subject:</span>
              <span className="receipt-value">Your Order #{orderId} Has Been Shipped!</span>
            </div>
            <div className="receipt-content">
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--accent)' }}>🚚 Your order has been shipped!</p>
              <p>Dear {customerDetails?.name},</p>
              <p>Great news! Your order has been dispatched and is on its way to you.</p>

              <div className="receipt-details">
                <div className="receipt-row">
                  <span>Order ID:</span>
                  <strong>{orderId}</strong>
                </div>
                <div className="receipt-row">
                  <span>Shipping ID:</span>
                  <strong>{shippingId}</strong>
                </div>
                <div className="receipt-row">
                  <span>Delivery Contact:</span>
                  <strong>+91 {deliveryContact}</strong>
                </div>
                <div className="receipt-row">
                  <span>Delivery Person:</span>
                  <strong>{deliveryPerson}</strong>
                </div>
                <div className="receipt-row">
                  <span>Estimated Delivery:</span>
                  <strong>{estimatedDelivery}</strong>
                </div>
              </div>

              <p style={{ marginTop: '12px', padding: '8px', backgroundColor: 'rgba(24, 144, 255, 0.1)', borderRadius: '4px' }}>
                ℹ️ <strong>We will contact you at {customerDetails?.phone} for delivery confirmation.</strong>
              </p>
              <p style={{ marginTop: '12px', color: 'var(--muted)' }}>
                Track your order in real-time using Shipping ID: <strong>{shippingId}</strong>
              </p>
              <p style={{ marginTop: '12px', fontWeight: '600' }}>
                Thank you for your patience! 🎉
              </p>
            </div>
          </div>
        </div>

        <div className="email-receipt-section">
          <h3>📧 Order Confirmation Email</h3>
          <div className="receipt-card">
            <div className="receipt-header">
              <span className="receipt-label">To:</span>
              <span className="receipt-value">{customerDetails?.email}</span>
            </div>
            <div className="receipt-header">
              <span className="receipt-label">Subject:</span>
              <span className="receipt-value">Order Confirmation #{orderId}</span>
            </div>
            <div className="receipt-content">
              <p>Dear {customerDetails?.name},</p>
              <p>Thank you for your order! Your payment has been received successfully.</p>

              <div className="receipt-details">
                <div className="receipt-row">
                  <span>Order ID:</span>
                  <strong>{orderId}</strong>
                </div>
                <div className="receipt-row">
                  <span>Order Date:</span>
                  <strong>{new Date(placedAt).toLocaleString()}</strong>
                </div>
                <div className="receipt-row">
                  <span>Payment Method:</span>
                  <strong>{payment?.methodDisplay || 'N/A'}</strong>
                </div>
                <div className="receipt-row">
                  <span>Transaction ID:</span>
                  <strong>{payment?.transactionId || 'N/A'}</strong>
                </div>
              </div>

              <p style={{ marginTop: '16px', fontWeight: '600' }}>Order Total: ₹{total}</p>
              <p>Estimated Delivery: {estimatedDelivery}</p>
              <p style={{ marginTop: '12px', color: 'var(--muted)' }}>
                A detailed receipt with items list has been sent to your email.
                You can track your order using Order ID above.
              </p>
              <p style={{ marginTop: '12px', fontWeight: '600' }}>
                Thank you for shopping with us! 🙏
              </p>
            </div>
          </div>
        </div>

        <div className="conf-row">
          <div>
            <h3>Estimated Delivery</h3>
            <p className="muted">Arriving by {estimatedDelivery}</p>
          </div>
          <div>
            <h3>Placed At</h3>
            <p className="muted">{new Date(placedAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="items-section">
          <h3>Items</h3>
          <div className="items-grid">
            {items.map(it => (
              <div className="item-card" key={it.id}>
                <img src={it.image} alt={it.title} />
                <div className="item-meta">
                  <div className="item-title">{it.title}</div>
                  <div className="item-qty">Qty: {it.qty}</div>
                </div>
                <div className="item-price">₹{it.price * it.qty}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="conf-actions">
          <button className="btn" onClick={() => navigate('/products')}>Choose More Products</button>
          <button className="btn btn-primary" onClick={() => navigate('/track-order?id=' + orderId)}>Track Order</button>
        </div>

        <div className="postdelivery-section">
          <h3>📨 Post-Delivery Thank You Email (After Delivery)</h3>
          <div className="receipt-card postdelivery">
            <div className="receipt-header">
              <span className="receipt-label">To:</span>
              <span className="receipt-value">{customerDetails?.email}</span>
            </div>
            <div className="receipt-header">
              <span className="receipt-label">Subject:</span>
              <span className="receipt-value">Thank You for Confirming Your Delivery - Order #{orderId}</span>
            </div>
            <div className="receipt-content">
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--accent)' }}>✅ Delivery Confirmed!</p>
              <p>Dear {customerDetails?.name},</p>
              <p>Thank you for confirming the delivery of your order. We hope you are satisfied with your purchase!</p>

              <div className="receipt-details">
                <div className="receipt-row">
                  <span>Order ID:</span>
                  <strong>{orderId}</strong>
                </div>
                <div className="receipt-row">
                  <span>Delivered By:</span>
                  <strong>{deliveryPerson}</strong>
                </div>
                <div className="receipt-row">
                  <span>Delivered On:</span>
                  <strong>{new Date().toLocaleDateString()}</strong>
                </div>
              </div>

              <p style={{ marginTop: '16px', padding: '12px', backgroundColor: 'rgba(255, 165, 0, 0.1)', borderRadius: '4px', fontWeight: '600' }}>
                ⚠️ <strong>Is there any issue with your order?</strong>
              </p>
              <p style={{ marginTop: '8px', color: 'var(--muted)' }}>
                If any product is damaged, or if you would like to exchange or return an item, please visit our
                <strong> Return Policy & Support Center</strong> within 30 days of delivery.
              </p>

              <p style={{ marginTop: '12px', fontWeight: '600' }}>
                Your satisfaction is our priority! Thank you for shopping with us! 🙏
              </p>
            </div>
          </div>
        </div>

        <div className="conf-actions">
          <button className="btn" onClick={() => navigate('/products')}>Continue Shopping</button>
          <button className="btn btn-primary" onClick={() => navigate('/return-policy')}>Return/Exchange Policy</button>
        </div>
      </div>
    </div>
  );
}
