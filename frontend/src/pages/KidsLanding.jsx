import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { products } from '../data/products';
import { KIDS_CATEGORIES } from '../data/categoryImages';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import FadeInImage from '../components/FadeInImage';
import './landing.css';

// --- KIDS HERO SLIDES ---
const KIDS_SLIDES = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1621452773781-0f992fd0f5d9?w=1600&q=80',
        title: 'KIDS FASHION FEST',
        subtitle: 'Cute Styles for Little Ones | Up to 60% Off',
        cta: 'Shop Kids',
        link: '/products?category=fashion&sub=Kids'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1519238263496-6362d74c1123?w=1600&q=80',
        title: 'PLAYTIME READY',
        subtitle: 'Durable & Fun Outfits',
        cta: 'Explore',
        link: '/products?category=fashion&sub=Kids'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=1600&q=80',
        title: 'TOYS & MORE',
        subtitle: 'Best Gifts for Every Age',
        cta: 'View Toys',
        link: '/products?category=fashion&sub=Kids'
    }
];

// Use imported categories
const KIDS_CATS = KIDS_CATEGORIES;

// --- KIDS BRANDS ---
const KIDS_BRANDS = [
    { name: 'Mothercare', offer: 'Min 30% Off' },
    { name: 'Gini & Jony', offer: 'Flat 50% Off' },
    { name: 'Carter\'s', offer: 'New Arrivals' },
    { name: 'Hamleys', offer: 'Toy Sale' },
    { name: 'Crocs', offer: 'Under ₹1999' },
    { name: 'Barbie', offer: 'Dolls & Sets' }
];

export default function KidsLanding() {
    // const { addToCart } = useContext(CartContext);
    // const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20000);

    useEffect(() => {
        const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % KIDS_SLIDES.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % KIDS_SLIDES.length);
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + KIDS_SLIDES.length) % KIDS_SLIDES.length);

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

    // Filter only Kids products for deals
    const [kidsDeals] = useState(() => {
        return products.filter(p => p.subCategory === 'Kids' && p.price < 2000).slice(0, 5).map(p => ({
            ...p,
            randomDiscount: Math.floor(Math.random() * 20 + 20)
        }));
    });

    return (
        <div className="landing-page-v2">
            {/* HERO CAROUSEL */}
            <section className="hero-carousel-container">
                <div className="hero-slides-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {KIDS_SLIDES.map((slide) => (
                        <div key={slide.id} className="hero-slide">
                            <FadeInImage src={slide.image} alt={slide.title} className="hero-img-desktop" />
                            <div className="hero-overlay-content">
                                <h2 className="animate-fade-in-up">{slide.title}</h2>
                                <p className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>{slide.subtitle}</p>
                                <Link to={slide.link} className="hero-cta-btn animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{slide.cta}</Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hero-dots">
                    {KIDS_SLIDES.map((_, idx) => (
                        <div key={idx} className={`hero-dot ${idx === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(idx)}></div>
                    ))}
                </div>
                <button className="hero-arrow left" onClick={prevSlide}><ChevronLeft /></button>
                <button className="hero-arrow right" onClick={nextSlide}><ChevronRight /></button>
            </section>

            {/* KIDS CATEGORIES GRID */}
            <section className="categories-showcase-section">
                <h2 className="section-heading">SHOP BY CATEGORY</h2>
                <div className="categories-showcase-grid">
                    {KIDS_CATS.map(cat => (
                        <Link key={cat.id} to={cat.link} className="category-showcase-card">
                            <div className="category-showcase-img">
                                <FadeInImage src={cat.image} alt={cat.label} />
                            </div>
                            <div className="category-showcase-label">
                                <h3>{cat.label}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CRAZY DEALS FOR KIDS */}
            <section className="crazy-deals-section">
                <div className="deals-header">
                    <div className="deals-title">
                        <Zap className="text-orange" fill="orange" />
                        <h2>Crazy Deals - Kids</h2>
                    </div>
                    <div className="deals-timer">
                        <span>Ending in: </span>
                        <span className="timer-box">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className="deals-grid">
                    {kidsDeals.map(p => (
                        <Link to={`/products/${p.id}`} key={p.id} className="deal-card">
                            <div className="deal-img-box">
                                <FadeInImage src={p.image} alt={p.title} />
                                <span className="deal-badge">{p.randomDiscount}% OFF</span>
                            </div>
                            <div className="deal-info">
                                <h4>{p.brand}</h4>
                                <p>{p.title}</p>
                                <div className="deal-price">
                                    <span className="new-price">₹{p.price}</span>
                                    <span className="old-price">₹{Math.floor(p.price * 1.3)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* KIDS BRANDS */}
            <section className="brands-section">
                <h2 className="section-heading">KIDS TOP BRANDS</h2>
                <div className="brands-grid">
                    {KIDS_BRANDS.map((brand, i) => (
                        <div key={i} className="brand-card">
                            <div className="brand-logo-area">
                                <h3>{brand.name}</h3>
                            </div>
                            <div className="brand-offer">
                                {brand.offer}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* TRENDING CARD - KIDS SPECIFIC */}
            <section className="trending-section">
                <h2 className="section-heading">PLAYFUL PICKS</h2>
                <div className="trending-grid">
                    <Link to="/products?category=fashion&sub=Kids" className="trend-item large">
                        <FadeInImage src="https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?w=800&q=80" alt="Kids Trending" />
                        <div className="trend-overlay">
                            <h3>PARTY READY</h3>
                            <span>Festive Styles</span>
                        </div>
                    </Link>
                    <Link to="/products?category=fashion&sub=Kids" className="trend-item">
                        <FadeInImage src="https://images.unsplash.com/photo-1503919545885-d74981679089?w=800&q=80" alt="Games" />
                        <div className="trend-overlay">
                            <h3>FUN & GAMES</h3>
                        </div>
                    </Link>
                    <Link to="/products?category=fashion&sub=Kids" className="trend-item">
                        <FadeInImage src="https://images.unsplash.com/photo-1526315573752-d5951d18f5da?w=800&q=80" alt="Winter" />
                        <div className="trend-overlay">
                            <h3>WINTER WARMTH</h3>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
