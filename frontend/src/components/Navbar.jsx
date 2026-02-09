import { useState, useContext, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Logo from './Logo';
import { Search, ShoppingBag, Heart, User, Sparkles, X } from 'lucide-react';
import MegaMenu from './MegaMenu';
import { NAV_DATA } from '../data/navigation';
import { products } from '../data/products';
import './navbar.css';


export default function Navbar() {
    const { items, toggleDrawer } = useContext(CartContext);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation(); // Hook for checking current URL
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
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

    const isHomeCategoryActive = location.pathname === '/products' && location.search.includes('category=home');

    // --- SEARCH LOGIC ---
    useEffect(() => {
        if (searchQuery.trim().length > 1) {
            const query = searchQuery.toLowerCase();
            const matches = products.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            ).slice(0, 6); // Limit to 6 suggestions
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchFocused(false);
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (id) => {
        navigate(`/products/${id}`);
        setSearchFocused(false);
        setSearchQuery('');
        setSuggestions([]);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSuggestions([]);
        setSearchFocused(true); // Keep focus
    }; return (
        <>
            {/* ... (overlay) ... */}

            <header className={`navbar-container ${searchFocused ? 'search-active' : ''}`}>
                <div className="navbar-content">
                    {/* 1. Logo & Department Links */}
                    <div className="nav-left">
                        <Link to="/" className="nav-logo">
                            <Logo />
                        </Link>
                        <nav className="nav-links" onMouseLeave={handleNavLeave}>
                            <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter('men')}>
                                <NavLink to="/men" className={({ isActive }) => isActive || visibleCategory === 'men' ? 'nav-active' : ''}>MEN</NavLink>
                            </div>
                            <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter('women')}>
                                <NavLink to="/women" className={({ isActive }) => isActive || visibleCategory === 'women' ? 'nav-active' : ''}>WOMEN</NavLink>
                            </div>
                            <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter('kids')}>
                                <NavLink to="/kids" className={({ isActive }) => isActive || visibleCategory === 'kids' ? 'nav-active' : ''}>KIDS</NavLink>
                            </div>
                            <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter('beauty')}>
                                <NavLink to="/beauty" className={({ isActive }) => isActive || visibleCategory === 'beauty' ? 'nav-active' : ''}>BEAUTY</NavLink>
                            </div>
                            <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter('home')}>
                                {/* Custom Active Check for Query Params */}
                                <Link to="/products?category=home" className={isHomeCategoryActive || visibleCategory === 'home' ? 'nav-active' : ''}>HOME & LIVING</Link>
                            </div>
                            <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter(null)}>
                                <NavLink to="/travel" className={({ isActive }) => isActive ? 'nav-active' : ''}>TRAVEL</NavLink>
                            </div>
                            <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter(null)}>
                                <NavLink to="/style-hub" className={({ isActive }) => isActive ? 'nav-active nav-highlight' : 'nav-highlight'}>STUDIO</NavLink>
                            </div>
                            <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter(null)}>
                                <NavLink to="/lookbook" className={({ isActive }) => isActive ? 'nav-active' : ''}>LOOKBOOK</NavLink>
                            </div>
                            <div className="nav-item-wrapper" onMouseEnter={() => handleNavEnter(null)}>
                                <NavLink to="/mix-match" className={({ isActive }) => isActive ? 'nav-active nav-highlight-pink' : 'nav-highlight-pink'}>MIX & MATCH</NavLink>
                            </div>
                        </nav>
                    </div>
                    {/* ... (rest of render) ... */}

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
                            // onBlur handled by backdrop to allow clicking suggestions
                            />
                            {searchQuery && (
                                <button className="clear-search-btn" onClick={clearSearch}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Search Suggestions Dropdown */}
                        {searchFocused && suggestions.length > 0 && (
                            <div className="search-suggestions-dropdown">
                                <ul>
                                    {suggestions.map(product => (
                                        <li key={product.id} onClick={() => handleSuggestionClick(product.id)}>
                                            <div className="suggestion-item">
                                                <img src={product.image} alt={product.title} />
                                                <div className="suggestion-info">
                                                    <span className="suggestion-title">{product.title}</span>
                                                    <span className="suggestion-brand">{product.brand}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* 3. Action Icons (Right) */}
                    <div className="nav-actions">
                        <div className="nav-action-item">
                            <Link to={token ? "/profile" : "/login"} className="action-link">
                                <User size={20} />
                                <span className='nav-label'>Profile</span>
                            </Link>
                        </div>

                        <div className="nav-action-item">
                            <Link to="/wishlist" className="action-link">
                                <Heart size={20} />
                                <span className='nav-label'>Wishlist</span>
                            </Link>
                        </div>

                        <div className="nav-action-item">
                            <button onClick={toggleDrawer} className="action-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <ShoppingBag size={20} />
                                {items.length > 0 && <span className="nav-badge">{items.length}</span>}
                                <span className='nav-label'>Bag</span>
                            </button>
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
        </>
    );
}
