import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { products } from '../data/products';
import { MEN_CATEGORIES } from '../data/categoryImages';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import FadeInImage from '../components/FadeInImage';
import './landing.css';

// --- MEN'S HERO SLIDES ---
const MEN_SLIDES = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1617137968427-85924c809a10?w=1600&q=80',
        title: 'MEN\'S FESTIVAL',
        subtitle: 'Suits, Sneakers & More | 40-70% Off',
        cta: 'Explore Men',
        link: '/products?category=fashion&sub=Men'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1600&q=80',
        title: 'STREETWEAR DROPS',
        subtitle: 'New Hoodies & Jackets',
        cta: 'Shop Now',
        link: '/products?category=fashion&sub=Men'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1600&q=80',
        title: 'THE SUIT EDIT',
        subtitle: 'Sharp Looks for Work & Weddings',
        cta: 'View Collection',
        link: '/products?category=fashion&sub=Men'
    }
];

// Use imported categories
const MEN_CATS = MEN_CATEGORIES;

// --- MEN'S BRANDS ---
const MEN_BRANDS = [
    {
        name: 'Nike',
        offer: 'Flat 40% Off',
        logo: '/images/logos/nike.png'
    },
    {
        name: 'Adidas',
        offer: 'Min 50% Off',
        logo: '/images/logos/adidas.png'
    },
    {
        name: 'Puma',
        offer: 'Under ₹1499',
        logo: '/images/logos/puma.png'
    },
    {
        name: 'Levi\'s',
        offer: 'Buy 1 Get 1',
        logo: '/images/logos/levis.png'
    },
    {
        name: 'Calvin Klein',
        offer: 'Flat 30% Off',
        logo: 'https://images.unsplash.com/photo-1582533081023-455b706f9798?w=800&q=80'
    },
    {
        name: 'Tommy Hilfiger',
        offer: 'New Arrivals',
        logo: 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?w=800&q=80'
    }
];

export default function MenLanding() {
    // const { addToCart } = useContext(CartContext);
    // const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState(12000); // Specific timer for men

    useEffect(() => {
        const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % MEN_SLIDES.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % MEN_SLIDES.length);
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + MEN_SLIDES.length) % MEN_SLIDES.length);

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

    // Filter only Men's products for deals
    const [menDeals] = useState(() => {
        return products.filter(p => p.subCategory === 'Men' && p.price < 3000).slice(0, 5).map(p => ({
            ...p,
            randomDiscount: Math.floor(Math.random() * 20 + 20)
        }));
    });

    return (
        <div className="landing-page-v2">
            {/* HERO CAROUSEL */}
            <section className="hero-carousel-container">
                <div className="hero-slides-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {MEN_SLIDES.map((slide) => (
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
                    {MEN_SLIDES.map((_, idx) => (
                        <div key={idx} className={`hero-dot ${idx === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(idx)}></div>
                    ))}
                </div>
                <button className="hero-arrow left" onClick={prevSlide}><ChevronLeft /></button>
                <button className="hero-arrow right" onClick={nextSlide}><ChevronRight /></button>
            </section>

            {/* MEN'S CATEGORIES GRID */}
            <section className="categories-showcase-section">
                <h2 className="section-heading">SHOP BY CATEGORY</h2>
                <div className="categories-showcase-grid">
                    {MEN_CATS.map(cat => (
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

            {/* CRAZY DEALS FOR MEN */}
            <section className="crazy-deals-section">
                <div className="deals-header">
                    <div className="deals-title">
                        <Zap className="text-orange" fill="orange" />
                        <h2>Crazy Deals - Men</h2>
                    </div>
                    <div className="deals-timer">
                        <span>Ending in: </span>
                        <span className="timer-box">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className="deals-grid">
                    {menDeals.map(p => (
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

            {/* MEN'S BRANDS */}
            <section className="brands-section">
                <h2 className="section-heading">MEN'S TOP BRANDS</h2>
                <div className="brands-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                    {MEN_BRANDS.map((brand, i) => (
                        <div key={i} className="brand-card">
                            <div className="brand-logo-area">
                                <FadeInImage src={brand.logo} alt={brand.name} className="brand-logo-img" />
                            </div>
                            <div className="brand-offer">
                                {brand.offer}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* TRENDING CARD - MEN SPECIFIC */}
            <section className="trending-section">
                <h2 className="section-heading">TRENDING FOR HIM</h2>
                <div className="trending-grid">
                    <Link to="/products?category=fashion&sub=Men" className="trend-item large">
                        <FadeInImage src="https://images.unsplash.com/photo-1516257984-b1b4d8c9230c?w=800&q=80" alt="Men Trending" />
                        <div className="trend-overlay">
                            <h3>URBAN CASUALS</h3>
                            <span>Starting ₹499</span>
                        </div>
                    </Link>
                    <Link to="/products?category=fashion&sub=Men" className="trend-item">
                        <FadeInImage src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80" alt="Suits" />
                        <div className="trend-overlay">
                            <h3>FORMAL EDIT</h3>
                        </div>
                    </Link>
                    <Link to="/products?category=fashion&sub=Men" className="trend-item">
                        <FadeInImage src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80" alt="Gym" />
                        <div className="trend-overlay">
                            <h3>GYM WEAR</h3>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
}
