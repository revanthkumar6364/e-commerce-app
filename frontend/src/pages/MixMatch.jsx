import { useState, useEffect, useContext } from 'react';
import { products } from '../data/products';
import { CartContext } from '../context/CartContext';
import { Shuffle, Lock, Unlock, ShoppingBag, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import './MixMatch.css';
import toast from 'react-hot-toast';

export default function MixMatch() {
    const { addToCart } = useContext(CartContext);

    // Filter products
    // Filter products based on 'type' which contains the actual garment name
    const tops = products.filter(p =>
        ['Shirt', 'T-Shirt', 'Tee', 'Top', 'Blouse', 'Jacket', 'Hoodie', 'Sweater', 'Coat', 'Blazer'].some(t => p.type.includes(t))
    );
    const bottoms = products.filter(p =>
        ['Jeans', 'Pants', 'Trousers', 'Skirt', 'Shorts', 'Joggers'].some(t => p.type.includes(t))
    );

    // Fallback if low data
    const safeTops = tops.length > 0 ? tops : products.slice(0, 5);
    const safeBottoms = bottoms.length > 0 ? bottoms : products.slice(5, 10);

    const [topIndex, setTopIndex] = useState(0);
    const [bottomIndex, setBottomIndex] = useState(0);
    const [isTopLocked, setIsTopLocked] = useState(false);
    const [isBottomLocked, setIsBottomLocked] = useState(false);

    const handleNextTop = () => {
        if (!isTopLocked) setTopIndex((prev) => (prev + 1) % safeTops.length);
    };

    const handlePrevTop = () => {
        if (!isTopLocked) setTopIndex((prev) => (prev - 1 + safeTops.length) % safeTops.length);
    };

    const handleNextBottom = () => {
        if (!isBottomLocked) setBottomIndex((prev) => (prev + 1) % safeBottoms.length);
    };

    const handlePrevBottom = () => {
        if (!isBottomLocked) setBottomIndex((prev) => (prev - 1 + safeBottoms.length) % safeBottoms.length);
    };

    const shuffle = () => {
        if (!isTopLocked) setTopIndex(Math.floor(Math.random() * safeTops.length));
        if (!isBottomLocked) setBottomIndex(Math.floor(Math.random() * safeBottoms.length));
        toast.success('Shuffled!');
    };

    const addLookToBag = () => {
        const top = safeTops[topIndex];
        const bottom = safeBottoms[bottomIndex];
        addToCart(top, 1);
        addToCart(bottom, 1);
        toast.success('Complete Look added to Bag! 🛍️');
    };

    if (safeTops.length === 0 || safeBottoms.length === 0) return <div className="mix-match-loader">Loading Studio...</div>;

    return (
        <div className="mix-match-container">
            <div className="mix-match-header">
                <h2>MIX & MATCH STUDIO</h2>
                <div className="mm-controls-global">
                    <button onClick={shuffle} className="mm-btn-icon" title="Shuffle Look"><Shuffle size={20} /></button>
                    <button onClick={addLookToBag} className="mm-btn-primary">
                        <ShoppingBag size={18} /> ADD LOOK
                    </button>
                </div>
            </div>

            <div className="split-screen">
                {/* TOP SECTION */}
                <div className="split-pane top-pane">
                    <div className="product-display">
                        <img src={safeTops[topIndex].image} alt={safeTops[topIndex].name} className="mm-image" />
                        <div className="mm-overlay">
                            <button className="nav-btn left" onClick={handlePrevTop}><ChevronLeft /></button>
                            <div className="mm-info">
                                <h3>{safeTops[topIndex].name}</h3>
                                <p>₹{safeTops[topIndex].price}</p>
                            </div>
                            <button className="nav-btn right" onClick={handleNextTop}><ChevronRight /></button>

                            <button className={`lock-btn ${isTopLocked ? 'locked' : ''}`} onClick={() => setIsTopLocked(!isTopLocked)}>
                                {isTopLocked ? <Lock size={16} /> : <Unlock size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION */}
                <div className="split-pane bottom-pane">
                    <div className="product-display">
                        <img src={safeBottoms[bottomIndex].image} alt={safeBottoms[bottomIndex].name} className="mm-image" />
                        <div className="mm-overlay">
                            <button className="nav-btn left" onClick={handlePrevBottom}><ChevronLeft /></button>
                            <div className="mm-info">
                                <h3>{safeBottoms[bottomIndex].name}</h3>
                                <p>₹{safeBottoms[bottomIndex].price}</p>
                            </div>
                            <button className="nav-btn right" onClick={handleNextBottom}><ChevronRight /></button>

                            <button className={`lock-btn ${isBottomLocked ? 'locked' : ''}`} onClick={() => setIsBottomLocked(!isBottomLocked)}>
                                {isBottomLocked ? <Lock size={16} /> : <Unlock size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
