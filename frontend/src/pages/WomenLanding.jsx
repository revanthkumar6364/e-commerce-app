import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { products } from '../data/products';
import { WOMEN_CATEGORIES } from '../data/categoryImages';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import FadeInImage from '../components/FadeInImage';
import './landing.css';

// --- WOMEN'S HERO SLIDES ---
const WOMEN_SLIDES = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
        title: 'WOMEN\'S FASHION',
        subtitle: 'Dresses, Tops & Ethnic Wear | 50-80% Off',
        cta: 'Explore Women',
        link: '/products?category=fashion&sub=Women'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=1600&q=80',
        title: 'BEAUTY & GLAM',
        subtitle: 'Premium Cosmetics & Skincare',
        cta: 'Shop Beauty',
        link: '/products?category=beauty'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80',
        title: 'ETHNIC ELEGANCE',
        subtitle: 'Sarees, Kurtas & Sets',
        cta: 'View Collection',
        link: '/products?category=fashion&sub=Women'
    }
];

// Use imported categories
const WOMEN_CATS = WOMEN_CATEGORIES;

// --- WOMEN'S BRANDS ---
const WOMEN_BRANDS = [
    { name: 'Zara', offer: 'New Season' },
    { name: 'H&M', offer: 'Flat 30% Off' },
    { name: 'Forever 21', offer: 'Under ₹999' },
    { name: 'Mango', offer: 'Min 40% Off' },
    { name: 'Biba', offer: 'Ethnic Sale' },
    { name: 'Vero Moda', offer: 'Buy 2 Get 1' }
];

export default function WomenLanding() {
    // const { addToCart } = useContext(CartContext);
    // const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15000);

    useEffect(() => {
        const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % WOMEN_SLIDES.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % WOMEN_SLIDES.length);
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + WOMEN_SLIDES.length) % WOMEN_SLIDES.length);

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

    // Filter only Women's products for deals
    const [womenDeals] = useState(() => {
        return products.filter(p => p.subCategory === 'Women' && p.price < 4000).slice(0, 5).map(p => ({
            ...p,
            randomDiscount: Math.floor(Math.random() * 20 + 20)
        }));
    });

    return (
        <div className="landing-page-v2">
            {/* HERO CAROUSEL */}
            <section className="hero-carousel-container">
                <div className="hero-slides-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {WOMEN_SLIDES.map((slide) => (
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
                    {WOMEN_SLIDES.map((_, idx) => (
                        <div key={idx} className={`hero-dot ${idx === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(idx)}></div>
                    ))}
                </div>
                <button className="hero-arrow left" onClick={prevSlide}><ChevronLeft /></button>
                <button className="hero-arrow right" onClick={nextSlide}><ChevronRight /></button>
            </section>

            {/* WOMEN'S CATEGORIES GRID */}
            <section className="categories-showcase-section">
                <h2 className="section-heading">SHOP BY CATEGORY</h2>
                <div className="categories-showcase-grid">
                    {WOMEN_CATS.map(cat => (
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

            {/* CRAZY DEALS FOR WOMEN */}
            <section className="crazy-deals-section">
                <div className="deals-header">
                    <div className="deals-title">
                        <Zap className="text-orange" fill="orange" />
                        <h2>Crazy Deals - Women</h2>
                    </div>
                    <div className="deals-timer">
                        <span>Ending in: </span>
                        <span className="timer-box">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className="deals-grid">
                    {womenDeals.map(p => (
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

            {/* WOMEN'S BRANDS */}
            <section className="brands-section">
                <h2 className="section-heading">WOMEN'S TOP BRANDS</h2>
                <div className="brands-grid">
                    {WOMEN_BRANDS.map((brand, i) => (
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

            {/* TRENDING CARD - WOMEN SPECIFIC */}
            <section className="trending-section">
                <h2 className="section-heading">TRENDING FOR HER</h2>
                <div className="trending-grid">
                    <Link to="/products?category=fashion&sub=Women" className="trend-item large">
                        <FadeInImage src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" alt="Women Trending" />
                        <div className="trend-overlay">
                            <h3>PARTY WEAR</h3>
                            <span>Up to 70% Off</span>
                        </div>
                    </Link>
                    <Link to="/products?category=fashion&sub=Women" className="trend-item">
                        <FadeInImage src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=800&q=80" alt="Beauty" />
                        <div className="trend-overlay">
                            <h3>MAKEUP & MORE</h3>
                        </div>
                    </Link>
                    <Link to="/products?category=fashion&sub=Women" className="trend-item">
                        <FadeInImage src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80" alt="Bags" />
                        <div className="trend-overlay">
                            <h3>LUXURY BAGS</h3>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
