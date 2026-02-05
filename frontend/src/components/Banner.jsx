import { useEffect, useState } from 'react';
import { collections } from '../data/products';
import './banner.css';

export default function Banner() {
  const [scrollY, setScrollY] = useState(0);
  const [currentSeason, setCurrentSeason] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotate seasonal collections
  useEffect(() => {
    const seasonalCollections = collections.slice(0, 3);
    const timer = setInterval(() => {
      setCurrentSeason(s => (s + 1) % seasonalCollections.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const seasonalCollections = collections.slice(0, 3);
  const featured = seasonalCollections[currentSeason];

  return (
    <div className="banner-wrapper">
      {/* Professional Hero Banner */}
      <section className="hero-banner">
        {/* Gradient Background */}
        <div className="banner-bg" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <div className="gradient-circle gradient-1"></div>
          <div className="gradient-circle gradient-2"></div>
          <div className="gradient-circle gradient-3"></div>
        </div>

        {/* Content */}
        <div className="banner-content">
          <div className="banner-text">
            <h1 className="banner-title">
              <span className="highlight">{featured?.name}</span>
              <br />
              Amazing Deals & Offers
            </h1>
            <p className="banner-subtitle">
              {featured?.offer && <strong>🎉 {featured.offer}</strong>} | Save big on thousands of products across all categories
            </p>
            <div className="banner-stats">
              <div className="stat">
                <span className="stat-number">100+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat">
                <span className="stat-number">11</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick shipping to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>Protected transactions & data</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Quality Assured</h3>
              <p>Verified products & sellers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>Hassle-free 30-day returns</p>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </section>

      {/* Promo Bar */}
      <div className="promo-bar">
        <div className="promo-content">
          <span className="promo-icon">🎉</span>
          <span className="promo-text">
            New customers: Get <strong>15% OFF</strong> on first purchase with code <strong>WELCOME15</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
