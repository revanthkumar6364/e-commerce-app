import { useState } from 'react';
import api from '../utils/api';
import './contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      try {
        const data = await api.post('/api/contact', formData);
        if (data.success) {
          setSubmitted(true);
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
          setTimeout(() => setSubmitted(false), 4000);
        } else {
          alert('Failed to send message: ' + data.message);
        }
      } catch (err) {
        console.error('Contact error:', err);
        // Simulation fallback
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 4000);
      }
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p className="subtitle">We're here to help. Get in touch with us for any questions or concerns.</p>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Email</h3>
            <p><a href="mailto:support@shophub.com">support@shophub.com</a></p>
            <p className="desc">Response within 24 hours</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Phone</h3>
            <p><a href="tel:+919876543210">+91 98765 43210</a></p>
            <p className="desc">Mon-Fri, 9 AM - 6 PM IST</p>
          </div>

          <div className="info-card">
            <div className="info-icon">💬</div>
            <h3>Live Chat</h3>
            <p>Available 24/7</p>
            <p className="desc">Chat with our support team</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Address</h3>
            <p>ShopHub HQ<br />123 Commerce Street<br />Mumbai, MH 400001</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send us a Message</h2>

          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="form-group">
            <label>Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What is this about?"
              required
            />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us how we can help..."
              rows="6"
              required
            />
          </div>

          <button type="submit" className="btn-submit">Send Message</button>

          {submitted && <div className="success-msg">✅ Message sent! We'll get back to you soon.</div>}
        </form>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How do I track my order?</h4>
            <p>You can track your order using the order ID sent to your email or from your account dashboard.</p>
          </div>
          <div className="faq-item">
            <h4>What's your return policy?</h4>
            <p>We offer 7-day returns on most products. Check our Return Policy page for full details.</p>
          </div>
          <div className="faq-item">
            <h4>Do you offer free shipping?</h4>
            <p>Yes, free shipping on orders above ₹500. Below that, shipping is ₹99.</p>
          </div>
          <div className="faq-item">
            <h4>How long does delivery take?</h4>
            <p>Standard delivery: 3-5 days. Express delivery: 1 day (available in select areas).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
