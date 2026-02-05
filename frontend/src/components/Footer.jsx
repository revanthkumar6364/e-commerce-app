import { useState } from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

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
            <li><Link to="/contact">FAQ</Link></li>
            <li><Link to="/contact">T&C</Link></li>
            <li><Link to="/track-order">Track Orders</Link></li>
            <li><Link to="/return-policy">Returns</Link></li>
            <li><Link to="/return-policy">Cancellations</Link></li>
          </ul>
        </div>

        {/* Column 3: Experience App */}
        <div className="footer-col">
          <h5 className="footer-heading">EXPERIENCE OUR APP</h5>
          <div className="app-download-row">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="store-badge" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg" alt="App Store" className="store-badge" />
          </div>

          <h5 className="footer-heading" style={{ marginTop: '20px' }}>KEEP IN TOUCH</h5>
          <div className="social-icons-row">
            <span className="social-icon">Instagram</span>
            <span className="social-icon">Twitter</span>
            <span className="social-icon">Facebook</span>
          </div>
        </div>

        {/* Column 4: Useful Links / Guarantee */}
        <div className="footer-col" style={{ minWidth: '250px' }}>
          <div className="guarantee-box">
            <img src="https://constant.myntassets.com/web/assets/img/6c3306ca-1efa-4a27-8769-3b69d16948741574602902451-original.png" alt="Original" style={{ width: '40px' }} />
            <div>
              <strong>100% ORIGINAL</strong> products
            </div>
          </div>
          <div className="guarantee-box">
            <img src="https://constant.myntassets.com/web/assets/img/ef05d6ec-950a-4d01-bbfa-e8e5af80ffe31574602902427-30days.png" alt="Return" style={{ width: '40px' }} />
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
