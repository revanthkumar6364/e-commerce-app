import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingBag, Eye, ArrowDown } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { LOOKBOOK_DATA } from '../data/lookbookData';
import toast from 'react-hot-toast';
import FadeInImage from '../components/FadeInImage';
import './Lookbook.css';

export default function Lookbook() {
    const [activeHotspot, setActiveHotspot] = useState(null);
    const [visibleCount, setVisibleCount] = useState(6);
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const handleSpotClick = (spot) => {
        if (activeHotspot && activeHotspot.id === spot.id) {
            setActiveHotspot(null);
        } else {
            setActiveHotspot(spot);
        }
    };

    const handleAddToCart = (e, spot) => {
        e.stopPropagation();
        addToCart({
            id: spot.productId,
            title: spot.title,
            price: spot.price,
            image: spot.image
        });
        toast.success(`Added ${spot.title} to Bag`);
    };

    const loadMore = () => {
        setVisibleCount(prev => Math.min(prev + 6, LOOKBOOK_DATA.length));
    };

    const visibleLooks = LOOKBOOK_DATA.slice(0, visibleCount);

    return (
        <div className="lookbook-page">
            <div className="lookbook-header">
                <h1>Editorial Lookbook</h1>
                <p>Shop the latest trends directly from the image.</p>
            </div>

            <div className="lookbook-grid">
                {visibleLooks.map(look => (
                    <div key={look.id} className="look-card">
                        <div className="look-image-wrapper">
                            <FadeInImage src={look.image} alt={look.title} className="look-img" />

                            {/* Hotspots */}
                            {look.hotspots.map(spot => (
                                <div
                                    key={spot.id}
                                    className={`hotspot ${activeHotspot?.id === spot.id ? 'active' : ''}`}
                                    style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSpotClick(spot);
                                    }}
                                >
                                    <div className="pulsing-circle">
                                        <Plus size={12} strokeWidth={3} />
                                    </div>

                                    {/* Popover */}
                                    <div className={`hotspot-popover ${activeHotspot?.id === spot.id ? 'visible' : ''}`}>
                                        <div className="popover-content">
                                            <h4>{spot.title}</h4>
                                            <span className="popover-price">₹{spot.price.toLocaleString()}</span>
                                            <div className="popover-actions">
                                                <button className="popover-shop-btn" onClick={(e) => handleAddToCart(e, spot)}>
                                                    Add to Bag <ShoppingBag size={12} />
                                                </button>
                                                <button className="popover-view-btn" onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/products/${spot.productId}`);
                                                }}>
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="look-details">
                            <h3>{look.title}</h3>
                            <p>{look.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {visibleCount < LOOKBOOK_DATA.length && (
                <div className="lookbook-footer">
                    <button className="load-more-btn" onClick={loadMore}>
                        Load More Looks <ArrowDown size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}
