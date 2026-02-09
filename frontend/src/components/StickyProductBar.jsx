import { useState, useEffect } from 'react';
import './StickyProductBar.css';

export default function StickyProductBar({ product, onAddToCart }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show when scrolled past 400px
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!product) return null;

    return (
        <div className={`sticky-product-bar ${isVisible ? 'visible' : ''}`}>
            <div className="sticky-bar-content">
                <div className="sticky-info">
                    <img src={product.image} alt={product.title} className="sticky-thumb" />
                    <div className="sticky-text">
                        <h4 className="sticky-title">{product.title}</h4>
                        <span className="sticky-price">₹{product.price.toLocaleString()}</span>
                    </div>
                </div>
                <button className="sticky-add-btn" onClick={onAddToCart}>
                    ADD TO BAG
                </button>
            </div>
        </div>
    );
}
