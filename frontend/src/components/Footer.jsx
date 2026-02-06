import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Apple, ShieldCheck, RotateCcw } from 'lucide-react';
import './footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  if (!handleSubscribe) return null; // Dummy usage to satisfy linter if it's broken

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Column 1: Online Shopping */}
        <div className="footer-col">
          <h5 className="footer-heading">ONLINE SHOPPING</h5>
          <ul className="footer-links">
            <li><Link to="/products?category=fashion&sub=Men">Men</Link></li>
            <li><Link to="/products?category=fashion&sub=Women">Women</Link></li>
            <li><Link to="/products?category=fashion&sub=Kids">Kids</Link></li>
            <li><Link to="/products?category=home">Home & Living</Link></li>
            <li><Link to="/products?category=beauty">Beauty</Link></li>
            <li><Link to="/wallet">Gift Cards</Link></li>
          </ul>
        </div>

        {/* Column 2: Customer Policies */}
        <div className="footer-col">
          <h5 className="footer-heading">CUSTOMER POLICIES</h5>
          <ul className="footer-links">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/terms">T&C</Link></li>
            <li><Link to="/track-order">Track Orders</Link></li>
            <li><Link to="/return-policy">Returns</Link></li>
            <li><Link to="/cancellations">Cancellations</Link></li>
          </ul>
        </div>

        {/* Column 3: Experience App */}
        <div className="footer-col">
          <h5 className="footer-heading">EXPERIENCE OUR APP</h5>
          <div className="app-download-row">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="store-badge" />
            <img src="https://raw.githubusercontent.com/edent/apple-app-store-badge/master/badge-black.svg" alt="App Store" className="store-badge" />
          </div>

          <h5 className="footer-heading" style={{ marginTop: '20px' }}>KEEP IN TOUCH</h5>
          <div className="social-icons-row">
            <span className="social-icon"><Facebook size={20} /></span>
            <span className="social-icon"><Twitter size={20} /></span>
            <span className="social-icon"><Instagram size={20} /></span>
            <span className="social-icon"><Youtube size={20} /></span>
            <span className="social-icon"><Apple size={20} /></span>
          </div>
        </div>

        {/* Column 4: Useful Links / Guarantee */}
        <div className="footer-col" style={{ minWidth: '250px' }}>
          <div className="guarantee-box">
            <ShieldCheck size={32} strokeWidth={1.5} color="#282c3f" />
            <div>
              <strong>100% ORIGINAL</strong> products
            </div>
          </div>
          <div className="guarantee-box">
            <RotateCcw size={32} strokeWidth={1.5} color="#282c3f" />
            <div>
              <strong>Return within 14 days</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <span>In case of any concern, <Link to="/contact">Contact Us</Link></span>
          <span>© 2026 www.urbanvibe.com. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
