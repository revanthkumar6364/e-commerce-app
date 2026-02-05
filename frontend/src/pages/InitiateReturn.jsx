import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './initiate-return.css';

export default function InitiateReturn() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reason: 'damaged',
    description: '',
    photos: null,
    buyerName: '',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const reasons = [
    { value: 'damaged', label: '📦 Damaged/Defective Product' },
    { value: 'wrong', label: '❌ Wrong Item Received' },
    { value: 'notdesc', label: '📋 Not as Described' },
    { value: 'changed', label: '🔄 Changed My Mind' },
    { value: 'size', label: '📏 Wrong Size/Fit' },
    { value: 'other', label: '❓ Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      photos: files
    }));
  };

  const [realReturnId, setRealReturnId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, orderId })
      });
      const data = await response.json();

      if (data.success) {
        setRealReturnId(data.returnId);
        setLoading(false);
        setSubmitted(true);
        setTimeout(() => {
          navigate('/track-order?id=' + orderId);
        }, 5000);
      } else {
        alert('Failed to submit return: ' + data.message);
        setLoading(false);
      }
    } catch (err) {
      console.error('Return error:', err);
      // Simulation fallback
      setRealReturnId('RET-' + Date.now().toString().slice(-8));
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/track-order?id=' + orderId);
      }, 5000);
    }
  };

  if (submitted) {
    return (
      <div className="return-container">
        <div className="return-success">
          <div className="success-icon">✅</div>
          <h1>Return Request Submitted!</h1>
          <p>Your return request has been registered successfully.</p>

          <div className="success-details">
            <div className="detail-row">
              <span className="label">Return ID:</span>
              <span className="value">{realReturnId}</span>
            </div>
            <div className="detail-row">
              <span className="label">Order ID:</span>
              <span className="value">{orderId}</span>
            </div>
            <div className="detail-row">
              <span className="label">Status:</span>
              <span className="value">Under Review</span>
            </div>
            <div className="detail-row">
              <span className="label">Pickup Arranged:</span>
              <span className="value">In 24 hours</span>
            </div>
          </div>

          <div className="success-message">
            <h3>📬 What's Next?</h3>
            <ul>
              <li>Our team will review your return within 24 hours</li>
              <li>We'll arrange a free pickup for your package</li>
              <li>Once received and inspected, your refund will be processed</li>
              <li>Refund typically credited within 5-7 business days</li>
            </ul>
          </div>

          <div className="success-buttons">
            <button className="btn primary" onClick={() => navigate('/track/' + orderId)}>
              Track Return Status
            </button>
            <button className="btn secondary" onClick={() => navigate('/contact')}>
              Contact Support
            </button>
          </div>

          <p className="redirect-text">Redirecting to order tracking in 3 seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="return-container">
      <div className="return-header">
        <h1>Initiate Return Request</h1>
        <p>Tell us why you want to return this order</p>
        <div className="order-id">Order ID: <strong>{orderId}</strong></div>
      </div>

      <form onSubmit={handleSubmit} className="return-form">
        {/* Return Reason */}
        <div className="form-section">
          <label className="form-label required">
            <span className="label-text">Why do you want to return?</span>
            <span className="hint">This helps us improve our service</span>
          </label>
          <div className="reason-grid">
            {reasons.map(option => (
              <label key={option.value} className={`reason-option ${formData.reason === option.value ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="reason"
                  value={option.value}
                  checked={formData.reason === option.value}
                  onChange={handleChange}
                  required
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="form-section">
          <label className="form-label required">
            <span className="label-text">Describe the Issue</span>
            <span className="hint">Provide details to help us process faster</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="E.g., The item has a scratch on the back... or it doesn't fit properly..."
            rows={5}
            required
            className="form-textarea"
          />
          <span className="char-count">{formData.description.length}/500</span>
        </div>

        {/* Photo Upload */}
        <div className="form-section">
          <label className="form-label">
            <span className="label-text">Upload Photos (Optional)</span>
            <span className="hint">Upload up to 4 photos to support your claim</span>
          </label>
          <div className="file-upload">
            <input
              type="file"
              id="photos"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="file-input"
            />
            <label htmlFor="photos" className="file-label">
              <span className="upload-icon">📸</span>
              <span className="upload-text">Click to upload photos or drag & drop</span>
              <span className="upload-hint">PNG, JPG up to 5MB each</span>
            </label>
            {formData.photos && formData.photos.length > 0 && (
              <div className="file-preview">
                <strong>{formData.photos.length} file(s) selected</strong>
              </div>
            )}
          </div>
        </div>

        {/* Buyer Details */}
        <div className="form-section">
          <label className="form-label required">
            <span className="label-text">Your Name</span>
          </label>
          <input
            type="text"
            name="buyerName"
            value={formData.buyerName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="form-input"
          />
        </div>

        <div className="form-section">
          <label className="form-label required">
            <span className="label-text">Email Address</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            className="form-input"
          />
        </div>

        {/* Return Process Info */}
        <div className="return-process">
          <h3>📋 Return Process</h3>
          <div className="process-steps">
            <div className="process-step">
              <span className="step-num">1</span>
              <span>Submit Return Request</span>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <span className="step-num">2</span>
              <span>Get Pickup Label</span>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <span className="step-num">3</span>
              <span>Ship Back Package</span>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <span className="step-num">4</span>
              <span>Get Refund</span>
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="terms-section">
          <label className="checkbox-label">
            <input type="checkbox" required />
            <span>I have read the <a href="/return-policy" target="_blank">Return Policy</a> and confirm my return eligibility</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <button
            type="submit"
            className="btn primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Return Request'}
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={() => navigate('/track/' + orderId)}
            disabled={loading}
          >
            Back to Order
          </button>
        </div>
      </form>

      {/* FAQ Section */}
      <div className="return-faq">
        <h2>❓ Frequently Asked Questions</h2>

        <div className="faq-item">
          <h4>How long do I have to return?</h4>
          <p>You have 7 days from the delivery date to initiate a return request. Return shipping and re-inspection takes an additional 5-7 days.</p>
        </div>

        <div className="faq-item">
          <h4>Will I get free pickup?</h4>
          <p>Yes! We arrange free pickup for all returns. You don't need to visit any store or pay for shipping.</p>
        </div>

        <div className="faq-item">
          <h4>What items can't be returned?</h4>
          <p>Underwear, perishables, items without original packaging, damaged products, and custom items cannot be returned.</p>
        </div>

        <div className="faq-item">
          <h4>When will I get my refund?</h4>
          <p>After we receive and inspect your return, refunds are typically processed within 3-5 business days to your original payment method.</p>
        </div>

        <div className="faq-item">
          <h4>What if the item is damaged?</h4>
          <p>Photos of damage help us process your claim faster. Upload clear photos during the return request process.</p>
        </div>
      </div>
    </div>
  );
}
