import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { products } from '../data/products';
import { ChevronLeft, ChevronRight, Clock, Zap, Star } from 'lucide-react';
import './landing.css';

// --- DATA: HERO SLIDES ---
const HERO_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
    mobile: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    title: 'BIG FASHION FESTIVAL',
    subtitle: '50-80% OFF',
    cta: 'Shop Now',
    link: '/products?category=fashion'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80',
    mobile: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
    title: 'TRAVEL IN STYLE',
    subtitle: 'Flat 20% Off Flights',
    cta: 'Book Now',
    link: '/travel'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&q=80',
    mobile: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80',
    title: 'TECH MANIA',
    subtitle: 'Latest Gadgets at Best Prices',
    cta: 'Explore',
    link: '/products?category=electronics'
  }
];

// --- DATA: CATEGORY CIRCLES ---
const CATEGORIES = [
  { id: 'men', label: 'Men', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80' },
  { id: 'women', label: 'Women', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80' },
  { id: 'kids', label: 'Kids', image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&q=80' },
  { id: 'beauty', label: 'Beauty', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80' },
  { id: 'home', label: 'Home', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80' },
  { id: 'travel', label: 'Travel', image: 'https://images.unsplash.com/photo-1542296332-2e44a996aaad?w=400&q=80' }
];

const BRANDS = [
  { name: 'Nike', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', offer: 'Min 40% Off' },
  { name: 'Adidas', img: '/images/logos/adidas.png', offer: 'Flat 50% Off' },
  { name: 'Puma', img: '/images/logos/puma.png', offer: 'Under ₹999' },
  { name: 'H&M', img: '/images/logos/hm.png', offer: 'Buy 1 Get 1' },
  { name: 'Rare Rabbit', img: 'https://cdn.brandfetch.io/id_gB_O_3O/theme/dark/logo.png?v=1', offer: 'Classic Look' },
  { name: 'Zara', img: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg', offer: 'New Arrivals' },
  { name: 'Levi\'s', img: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Levi%27s_logo.svg', offer: 'Flat 40% Off' }
];

export default function Landing() {
  // const { addToCart } = useContext(CartContext);
  // const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(18000); // 5 hours in seconds

  // --- CAROUSEL LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  // --- TIMER LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h : ${m.toString().padStart(2, '0')}m : ${s.toString().padStart(2, '0')}s`;
  };

  const [dealProducts] = useState(() => {
    return products.filter(p => p.price < 2500).slice(0, 5).map((p, idx) => ({
      ...p,
      randomDiscount: 30 + (idx * 5) % 40 // Deterministic discount based on index
    }));
  });

  return (
    <div className="landing-page-v2">

      {/* 1. HERO CAROUSEL */}
      <section className="hero-carousel-container">
        <div className="hero-slides-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {HERO_SLIDES.map((slide) => (
            <div key={slide.id} className="hero-slide">
              <img src={slide.image} alt={slide.title} className="hero-img-desktop" />
              <div className="hero-overlay-content">
                <h2 className="animate-fade-in-up">{slide.title}</h2>
                <p className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>{slide.subtitle}</p>
                <Link to={slide.link} className="hero-cta-btn animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{slide.cta}</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="hero-dots">
          {HERO_SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            ></div>
          ))}
        </div>

        {/* Arrows */}
        <button className="hero-arrow left" onClick={prevSlide}><ChevronLeft /></button>
        <button className="hero-arrow right" onClick={nextSlide}><ChevronRight /></button>
      </section>


      {/* 2. CATEGORY CIRCLES */}
      <section className="category-circles-section">
        <div className="category-circles-container">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} className="circle-item">
              <div className="circle-img-wrapper">
                <img src={cat.image} alt={cat.label} />
              </div>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>


      {/* 3. CRAZY DEALS WITH TIMER */}
      <section className="crazy-deals-section">
        <div className="deals-header">
          <div className="deals-title">
            <Zap className="text-orange" fill="orange" />
            <h2>Crazy Deals</h2>
          </div>
          <div className="deals-timer">
            <span>Ending in: </span>
            <span className="timer-box">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="deals-grid">
          {dealProducts.map(p => (
            <Link to={`/products/${p.id}`} key={p.id} className="deal-card">
              <div className="deal-img-box">
                <img src={p.image} alt={p.title} />
                <span className="deal-badge">{p.randomDiscount}% OFF</span>
              </div>
              <div className="deal-info">
                <h4>{p.brand}</h4>
                <p>{p.title}</p>
                <div className="deal-price">
                  <span className="new-price">₹{p.price}</span>
                  <span className="old-price">₹{Math.floor(p.price * 1.5)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* 4. OMG! BRANDS */}
      <section className="brands-section">
        <h2 className="section-heading">OMG! DEALS</h2>
        <div className="brands-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {BRANDS.map((brand, i) => (
            <Link to={`/products?brands=${encodeURIComponent(brand.name)}`} key={i} className="brand-card">
              <div className="brand-logo-area">
                <img src={brand.img} alt={brand.name} className="brand-logo-img" />
              </div>
              <div className="brand-offer">
                {brand.offer}
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* 5. TRENDING NOW (Masonryish) */}
      <section className="trending-section">
        <h2 className="section-heading">TRENDING IN {new Date().toLocaleString('default', { month: 'long' }).toUpperCase()}</h2>
        <div className="trending-grid">
          <Link to="/products?category=fashion" className="trend-item large">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" alt="Fashion" />
            <div className="trend-overlay">
              <h3>SUMMER VIBES</h3>
              <span>UP TO 60% OFF</span>
            </div>
          </Link>
          <Link to="/products?category=electronics" className="trend-item">
            <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80" alt="Tech" />
            <div className="trend-overlay">
              <h3>WORK FROM HOME</h3>
            </div>
          </Link>
          <Link to="/products?category=beauty" className="trend-item">
            <img src="https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=1200&q=80" alt="Beauty" />
            <div className="trend-overlay">
              <h3>GLOW UP</h3>
            </div>
          </Link>
        </div>
      </section>


      {/* 6. ECO FRIENDLY BANNER */}
      <section className="eco-banner-section">
        <div className="eco-content">
          <h2>Conscious Choice 🌿</h2>
          <p>Shop our sustainable collection. 100% Organic Cotton & Recycled Materials.</p>
          <Link to="/products" className="eco-btn">View Eco-Friendly</Link>
        </div>
      </section>

    </div>
  );
}
