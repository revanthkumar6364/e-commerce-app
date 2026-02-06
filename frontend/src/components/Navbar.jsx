import { useState, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { Search, ShoppingBag, Heart, User, Sparkles } from 'lucide-react';
import MegaMenu from './MegaMenu';
import { NAV_DATA } from '../data/navigation';
import './navbar.css';

export default function Navbar() {
    const { items } = useContext(CartContext);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCategory, setVisibleCategory] = useState(null); // 'men', 'women', etc.
    const closeTimeoutRef = useRef(null);

    const handleNavEnter = (category) => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setVisibleCategory(category);
    };

    const handleNavLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setVisibleCategory(null);
        }, 300);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="navbar-container">
            <div className="navbar-content">
                {/* 1. Logo & Department Links */}
                <div className="nav-left">
                    <Link to="/" className="nav-logo">
                        <Logo />
                    </Link>
                    <nav className="nav-links" onMouseLeave={handleNavLeave}>
                        <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter('men')}>
                            <Link to="/men" className={visibleCategory === 'men' ? 'nav-active' : ''}>MEN</Link>
                        </div>
                        <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter('women')}>
                            <Link to="/women" className={visibleCategory === 'women' ? 'nav-active' : ''}>WOMEN</Link>
                        </div>
                        <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter('kids')}>
                            <Link to="/kids" className={visibleCategory === 'kids' ? 'nav-active' : ''}>KIDS</Link>
                        </div>
                        <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter('beauty')}>
                            <Link to="/beauty" className={visibleCategory === 'beauty' ? 'nav-active' : ''}>BEAUTY</Link>
                        </div>
                        <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter('home')}>
                            <Link to="/products?category=home" className={visibleCategory === 'home' ? 'nav-active' : ''}>HOME & LIVING</Link>
                        </div>
                        <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter(null)}>
                            <Link to="/travel">TRAVEL</Link>
                        </div>
                    </nav>
                </div>

                {/* 2. Search Bar (Center, Wide) */}
                <div className="nav-search-container">
                    <div className={`nav-search-box ${searchFocused ? 'focused' : ''}`}>
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search for products, brands and more"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </div>
                </div>

                {/* 3. Action Icons (Right) */}
                <div className="nav-actions">
                    <div className="nav-action-item">
                        <Link to={token ? "/profile" : "/login"} className="action-link">
                            <User size={20} />
                            <span>Profile</span>
                        </Link>
                    </div>

                    <div className="nav-action-item">
                        <Link to="/wishlist" className="action-link">
                            <Heart size={20} />
                            <span>Wishlist</span>
                        </Link>
                    </div>

                    <div className="nav-action-item">
                        <Link to="/cart" className="action-link">
                            <ShoppingBag size={20} />
                            {items.length > 0 && <span className="nav-badge">{items.length}</span>}
                            <span>Bag</span>
                        </Link>
                    </div>

                    {/* Concierge (Floating or Icon) */}
                    <button className="nav-concierge-trigger" onClick={() => window.dispatchEvent(new CustomEvent('toggle-concierge'))}>
                        <div className="nav-concierge-icon">
                            <Sparkles size={18} />
                        </div>
                    </button>
                </div>
            </div>

            {/* MEGA MENU RENDER */}
            <div
                onMouseEnter={() => { if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current); }}
                onMouseLeave={handleNavLeave}
            >
                <MegaMenu
                    data={NAV_DATA[visibleCategory]}
                    onClose={() => setVisibleCategory(null)}
                />
            </div>
        </header>
    );
}
