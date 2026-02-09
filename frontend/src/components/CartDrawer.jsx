import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer() {
    const { isDrawerOpen, closeDrawer, items, total, updateQty, removeItem } = useContext(CartContext);
    const navigate = useNavigate();

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isDrawerOpen]);

    const handleCheckout = () => {
        closeDrawer();
        navigate('/checkout'); // Assuming a checkout route exists, or use /cart if not
    };

    const handleViewCart = () => {
        closeDrawer();
        navigate('/cart');
    };

    if (!isDrawerOpen) return null;

    return (
        <>
            <div className="drawer-overlay" onClick={closeDrawer} />
            <div className="cart-drawer animate-slide-in-right">
                <div className="drawer-header">
                    <h2>Shopping Bag ({items.length})</h2>
                    <button className="drawer-close" onClick={closeDrawer}>
                        <X size={24} />
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="drawer-empty">
                        <div className="empty-icon-wrapper">
                            <ShoppingBag size={48} />
                        </div>
                        <h3>Your bag is empty</h3>
                        <p>Looks like you haven't added anything to your bag yet.</p>
                        <button className="start-shopping-btn" onClick={closeDrawer}>
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="drawer-items">
                            {items.map((item) => (
                                <div key={item.id} className="drawer-item">
                                    <div className="drawer-item-img">
                                        <img src={item.image} alt={item.title} />
                                    </div>
                                    <div className="drawer-item-details">
                                        <div className="item-top">
                                            <h4>{item.brand}</h4>
                                            <p className="item-title">{item.title}</p>
                                        </div>
                                        <div className="item-price">
                                            <span className="current-price">₹{item.price}</span>
                                            {item.mrp > item.price && (
                                                <span className="original-price">₹{item.mrp}</span>
                                            )}
                                        </div>
                                        <div className="item-controls">
                                            <div className="qty-selector">
                                                <button onClick={() => updateQty(item, Math.max(0, item.qty - 1))}>
                                                    {item.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                                                </button>
                                                <span>{item.qty}</span>
                                                <button onClick={() => updateQty(item, item.qty + 1)}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button className="remove-btn" onClick={() => removeItem(item.id)}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="drawer-footer">
                            <div className="footer-row total-row">
                                <span>Subtotal</span>
                                <span className="total-amount">₹{total.toLocaleString()}</span>
                            </div>
                            <p className="shipping-note">Tax included. Shipping calculated at checkout.</p>
                            <div className="drawer-actions">
                                <button className="view-cart-btn" onClick={handleViewCart}>
                                    View Cart
                                </button>
                                <button className="checkout-btn" onClick={handleCheckout}>
                                    Checkout • ₹{total.toLocaleString()}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
