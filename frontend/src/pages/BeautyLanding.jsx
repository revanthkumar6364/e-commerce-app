import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { products } from '../data/products';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import FadeInImage from '../components/FadeInImage';
import './landing.css';

// --- BEAUTY HERO SLIDES ---
const BEAUTY_SLIDES = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=1600&q=80', // Premium 3D Podium aesthetic
        title: 'LUXURY BEAUTY',
        subtitle: 'Top International Brands | Up to 40% Off',
        cta: 'Shop Beauty',
        link: '/products?category=beauty'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=1600&q=80',
        title: 'SKINCARE ESSENTIALS',
        subtitle: 'Glow from Within',
        cta: 'Explore',
        link: '/products?category=beauty'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1600&q=80',
        title: 'FRAGRANCE LOUNGE',
        subtitle: 'Signatures Scents for You',
        cta: 'View Collection',
        link: '/products?category=beauty'
    }
];

// --- BEAUTY CATEGORIES ---
const BEAUTY_CATS = [
    { id: 'Makeup', label: 'Makeup', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
    { id: 'Skincare', label: 'Skincare', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80' },
    { id: 'Haircare', label: 'Haircare', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&q=80' },
    { id: 'Fragrance', label: 'Perfumes', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80' },
    { id: 'BathBody', label: 'Bath & Body', image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=400&q=80' },
    { id: 'Natural', label: 'Natural', image: 'https://images.unsplash.com/photo-1556228578-8c89e6fb2f56?w=400&q=80' }
];

// --- BEAUTY BRANDS ---
const BEAUTY_BRANDS = [
    {
        id: 1,
        name: 'MAC',
        logo: 'https://cdn.worldvectorlogo.com/logos/mac-cosmetics-1.svg',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=800&q=80', // High-end makeup
        offer: 'Free Lipstick'
    },
    {
        id: 2,
        name: 'Lakme',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Lakm%C3%A9_logo.jpg', // Fallback to JPG as vector is hard to find direct
        image: 'https://images.unsplash.com/photo-1522335208468-9732264197c8?w=800&q=80', // Fashion week vibe
        offer: 'Flat 20% Off'
    },
    {
        id: 3,
        name: 'Maybelline',
        logo: 'https://cdn.worldvectorlogo.com/logos/maybelline.svg',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', // Urban chic
        offer: 'Buy 2 Get 1'
    },
    {
        id: 4,
        name: 'L\'Oreal',
        logo: 'https://cdn.worldvectorlogo.com/logos/loreal.svg',
        image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80', // Hair luxury
        offer: 'Hair Spa Kit'
    },
    {
        id: 5,
        name: 'Clinique',
        logo: 'https://cdn.worldvectorlogo.com/logos/clinique.svg',
        image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800&q=80', // Clean skincare
        offer: 'Gift Set'
    },
    {
        id: 6,
        name: 'The Body Shop',
        logo: 'https://cdn.worldvectorlogo.com/logos/the-body-shop-2.svg',
        image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=800&q=80', // Nature/Botanical
        offer: 'Flat 25% Off'
    }
];

export default function BeautyLanding() {
    // const { addToCart } = useContext(CartContext);
    // const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState(25000);

    useEffect(() => {
        const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % BEAUTY_SLIDES.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % BEAUTY_SLIDES.length);
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + BEAUTY_SLIDES.length) % BEAUTY_SLIDES.length);

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

    // Filter proper beauty products
    const [beautyDeals] = useState(() => {
        return products.filter(p => p.category === 'beauty' && p.price < 3000).slice(0, 5).map(p => ({
            ...p,
            randomDiscount: Math.floor(Math.random() * 20 + 20)
        }));
    });

    return (
        <div className="landing-page-v2">
            {/* HERO CAROUSEL */}
            <section className="hero-carousel-container">
                <div className="hero-slides-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {BEAUTY_SLIDES.map((slide) => (
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
                    {BEAUTY_SLIDES.map((_, idx) => (
                        <div key={idx} className={`hero-dot ${idx === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(idx)}></div>
                    ))}
                </div>
                <button className="hero-arrow left" onClick={prevSlide}><ChevronLeft /></button>
                <button className="hero-arrow right" onClick={nextSlide}><ChevronRight /></button>
            </section>

            {/* BEAUTY CIRCLES */}
            <section className="category-circles-section">
                <div className="category-circles-container">
                    {BEAUTY_CATS.map(cat => (
                        <Link key={cat.id} to={`/products?category=beauty&type=${cat.id}`} className="circle-item">
                            <div className="circle-img-wrapper">
                                <FadeInImage src={cat.image} alt={cat.label} />
                            </div>
                            <span>{cat.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CRAZY DEALS FOR BEAUTY */}
            <section className="crazy-deals-section">
                <div className="deals-header">
                    <div className="deals-title">
                        <Zap className="text-orange" fill="orange" />
                        <h2>Beauty Steals</h2>
                    </div>
                    <div className="deals-timer">
                        <span>Ending in: </span>
                        <span className="timer-box">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className="deals-grid">
                    {beautyDeals.map(p => (
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

            {/* BEAUTY BRANDS */}
            <section className="brands-section">
                <h2 className="section-heading">TOP BEAUTY BRANDS</h2>
                <div className="brands-grid">
                    {BEAUTY_BRANDS.map((brand) => (
                        <div key={brand.id} className="brand-card">
                            <div className="brand-logo-area">
                                <img src={brand.logo} alt={brand.name} className="brand-logo-img" />
                            </div>
                            <div className="brand-image-preview">
                                <FadeInImage src={brand.image} alt={`${brand.name} Aesthetic`} />
                            </div>
                            <div className="brand-offer">
                                {brand.offer}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* TRENDING CARD - BEAUTY SPECIFIC */}
            <section className="trending-section">
                <h2 className="section-heading">BEAUTY TRENDS</h2>
                <div className="trending-grid">
                    <Link to="/products?category=beauty" className="trend-item large">
                        <FadeInImage src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=800&q=80" alt="Beauty Trending" />
                        <div className="trend-overlay">
                            <h3>GLOW UP ESSENTIALS</h3>
                            <span>K-Beauty & More</span>
                        </div>
                    </Link>
                    <Link to="/products?category=beauty" className="trend-item">
                        <FadeInImage src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80" alt="Makeup" />
                        <div className="trend-overlay">
                            <h3>PARTY MAKEUP</h3>
                        </div>
                    </Link>
                    <Link to="/products?category=beauty" className="trend-item">
                        <FadeInImage src="https://images.unsplash.com/photo-1556228720-1987ba83dd3c?w=800&q=80" alt="Serum" />
                        <div className="trend-overlay">
                            <h3>NIGHT CARE</h3>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
