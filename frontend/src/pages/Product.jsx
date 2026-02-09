import { useState, useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getProductById } from '../data/products';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';
import StickyProductBar from '../components/StickyProductBar';
import './product.css';

export default function Product() {
  const { id } = useParams();
  const p = getProductById(id);
  // const [qty, setQty] = useState(1);
  const qty = 1;
  const [selectedColor, setSelectedColor] = useState('default');
  const [selectedSize, setSelectedSize] = useState('M');
  // const [activeImg, setActiveImg] = useState(null);
  const activeImg = null;
  const { addItem } = useContext(CartContext);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [revLoading, setRevLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', userName: '' });
  const [submitting, setSubmitting] = useState(false);

  // Scroll to top on load for premium feel
  // Scroll to top logic removed to prevent jumping
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [id]);

  useEffect(() => {
    if (!p) return;
    const fetchReviews = async () => {
      try {
        const { data } = await api.get(`/products/${p.id}/reviews`);
        if (data.success) setReviews(data.reviews);
      } catch (err) {
        console.error('Reviews error:', err);
      } finally {
        setRevLoading(false);
      }
    };
    fetchReviews();
  }, [p]);

  if (!p) return <div className="not-found">Product not found</div>;

  const currentImage = activeImg || p.image;

  // Mock Variants
  const colors = [
    { name: 'Midnight Black', code: '#1a1a1a' },
    { name: 'Royal Blue', code: '#2874f0' },
    { name: 'Pearl White', code: '#f0f0f0' },
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    for (let i = 0; i < qty; i++) {
      addItem({ ...p, selectedColor, selectedSize });
    }
    toast.success(`✅ Added ${qty} item(s) to cart`);
  };

  // const shareText = `${p.title} - ₹${p.price} - ` + (typeof window !== 'undefined' ? window.location.href : '');

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: p.title, text: `${p.title} - ₹${p.price}`, url: window.location.href }).catch(() => { });
      return;
    }
    navigator.clipboard.writeText(window.location.href).then(() => toast.success('Link copied to clipboard'));
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return toast.error('Please fill all fields');
    setSubmitting(true);
    try {
      const { data } = await api.post(`/products/${p.id}/reviews`, newReview);
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setNewReview({ rating: 5, comment: '', userName: '' });
        toast.success('Review added successfully!');
      }
    } catch (err) {
      console.error('Review submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cinematic-product-page">
      {/* LEFT: IMMERSIVE GALLERY (Scrollable) */}
      <div className="cinematic-gallery">
        <div className="gallery-scroll-container">
          <div className="cinema-hero-wrapper">
            <img src={currentImage} alt={p.title} className="cinema-hero-img" />
          </div>
          {/* Duplicate images to simulate a rich gallery if none exist */}
          {(p.images && p.images.length > 0 ? p.images : [p.image, p.image]).map((img, i) => (
            <img key={i} src={img} alt="Detail view" className="cinema-detail-img" />
          ))}
        </div>
        <div className="floating-action-badges">
          <span className="badge-luxury">★ {p.rating} / 5.0</span>
          <span className="badge-luxury">BESTSELLER</span>
        </div>
      </div>

      {/* RIGHT: STICKY DETAILS PANEL */}
      <div className="product-sticky-panel">
        <div className="panel-content">
          <nav className="breadcrumbs-minimal">
            <Link to="/">HOME</Link> • <Link to="/products">COLLECTION</Link> • <span>{p.title.toUpperCase()}</span>
          </nav>

          <h1 className="cinema-title">{p.title}</h1>
          <p className="cinema-price">₹{p.price.toLocaleString()}</p>
          <p className="cinema-desc">{p.desc}</p>

          <button className="ai-view-btn">
            <span className="ai-icon">✨</span>
            View in 360° AI Simulation
          </button>

          <div className="selector-grid">
            <div className="selector-group">
              <label>COLOR</label>
              <div className="color-dots">
                {colors.map(c => (
                  <div
                    key={c.name}
                    className={`c-dot ${selectedColor === c.name ? 'active' : ''}`}
                    style={{ background: c.code }}
                    onClick={() => setSelectedColor(c.name)}
                  />
                ))}
              </div>
            </div>
            {(p.category === 'fashion' || p.category === 'kids') && (
              <div className="selector-group">
                <label>SIZE</label>
                <div className="size-text-btns">
                  {sizes.map(s => (
                    <button
                      key={s}
                      className={`s-text-btn ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="action-stack">
            <button className="add-bag-btn" onClick={handleAddToCart}>
              ADD TO BAG — ₹{p.price.toLocaleString()}
            </button>
            <div className="secondary-actions">
              <button className="icon-action" onClick={handleShare}>SHARE ↗</button>
              <button className="icon-action">WISHLIST ♡</button>
            </div>
          </div>

          <div className="accordion-info">
            <details open>
              <summary>DESCRIPTION</summary>
              <p>{p.desc} Crafted with premium materials for the discerning individual.</p>
            </details>
            <details>
              <summary>SHIPPING & RETURNS</summary>
              <p>Free express delivery within 24 hours. 7-day no-questions-asked return policy for Inner Circle members.</p>
            </details>
            <details>
              <summary>AUTHENTICITY</summary>
              <p>Verified by our master authenticators. Certificate of origin included.</p>
            </details>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="product-reviews-section">
        <div className="reviews-container">
          <div className="reviews-header">
            <h2>CLIENT FEEDBACK</h2>
            <div className="overall-rating">★ {p.rating} Overall Rating</div>
          </div>

          <div className="reviews-layout">
            <div className="reviews-list">
              {revLoading ? <p>Loading reviews...</p> : reviews.length === 0 ? <p>No reviews yet. Be the first to share your thoughts!</p> : (
                reviews.map((r, i) => (
                  <div key={i} className="review-card">
                    <div className="review-meta">
                      <span className="reviewer-name">{r.userName}</span>
                      <span className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    <p className="review-comment">{r.comment}</p>
                    <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>

            <div className="add-review-panel">
              <h3>WRITE A REVIEW</h3>
              <form onSubmit={handleReviewSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newReview.userName}
                  onChange={e => setNewReview({ ...newReview, userName: e.target.value })}
                  required
                />
                <select
                  value={newReview.rating}
                  onChange={e => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                >
                  <option value="5">5 Stars - Perfection</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Good</option>
                  <option value="2">2 Stars - Poor</option>
                  <option value="1">1 Star - Disappointing</option>
                </select>
                <textarea
                  placeholder="Share your experience with this product..."
                  value={newReview.comment}
                  onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={4}
                  required
                />
                <button type="submit" className="submit-rev-btn" disabled={submitting}>
                  {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <StickyProductBar product={p} onAddToCart={handleAddToCart} />
    </div>
  );
}
