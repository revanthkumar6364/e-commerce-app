import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './track-order.css';

export default function TrackOrder() {
    const query = new URLSearchParams(useLocation().search);
    const initialId = query.get('id') || '';

    const [orderId, setOrderId] = useState(initialId);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialId) {
            handleTrack(initialId);
        }
    }, [initialId]);

    const handleTrack = async (id) => {
        setLoading(true);
        setError('');
        setOrder(null);
        try {
            const res = await fetch(`http://localhost:5000/orders/${id}`);
            const data = await res.json();
            if (data.success) {
                setOrder(data.order);
            } else {
                setError('Order not found. Please check the Order ID.');
            }
        } catch (err) {
            setError('Connection failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="track-order-page">
            <div className="track-header">
                <h1>Track Your Shipment</h1>
                <p>Get real-time updates on your Urban Vibe order.</p>
            </div>

            <div className="track-input-section">
                <input
                    type="text"
                    placeholder="Enter Order ID (e.g. ORD12345678)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="main-track-input"
                />
                <button onClick={() => handleTrack(orderId)} className="main-track-btn" disabled={loading}>
                    {loading ? 'Searching...' : 'Track Now'}
                </button>
            </div>

            {error && <div className="track-error">{error}</div>}

            {order && (
                <div className="order-details-card">
                    <div className="status-container">
                        <div className="status-banner">
                            <span className="status-label">Tracking Number</span>
                            <span className="status-value">{order.id}</span>
                        </div>
                        <div className="status-update">
                            <span className="last-update">Last update: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    <div className="immersive-journey-map">
                        <div className="map-line">
                            <div className="map-progress" style={{
                                width: `${(Math.max(0, ['confirmed', 'processed', 'shipped', 'out_for_delivery', 'delivered'].indexOf(order.status.toLowerCase())) / 4) * 100}%`
                            }}></div>
                            <div className="map-marker source active">
                                <span className="marker-dot"></span>
                                <span className="marker-city">Warehouse</span>
                            </div>
                            <div className={`map-marker mid ${order.status === 'shipped' || order.status === 'out_for_delivery' || order.status === 'delivered' ? 'active' : ''}`}>
                                <span className="marker-dot"></span>
                                <span className="marker-city">Transit Hub</span>
                            </div>
                            <div className={`map-marker dest ${order.status === 'out_for_delivery' || order.status === 'delivered' ? 'active' : ''}`}>
                                <span className="marker-dot"></span>
                                <span className="marker-city">Destination</span>
                            </div>
                            <div className="courier-icon-movable" style={{
                                left: `${(Math.max(0, ['confirmed', 'processed', 'shipped', 'out_for_delivery', 'delivered'].indexOf(order.status.toLowerCase())) / 4) * 100}%`
                            }}>
                                🚚
                            </div>
                        </div>
                    </div>

                    <div className="tracking-stepper">
                        {[
                            { label: 'Order Placed', status: 'confirmed', icon: '📝' },
                            { label: 'Processing', status: 'processed', icon: '⚙️' },
                            { label: 'Shipped', status: 'shipped', icon: '🚚' },
                            { label: 'Out for Delivery', status: 'out_for_delivery', icon: '📦' },
                            { label: 'Delivered', status: 'delivered', icon: '✅' }
                        ].map((step, index, array) => {
                            const statusesOrder = ['confirmed', 'processed', 'shipped', 'out_for_delivery', 'delivered', 'completed'];
                            const currentStatusIndex = statusesOrder.indexOf(order.status.toLowerCase());
                            const stepIndex = index;
                            const isCompleted = currentStatusIndex >= stepIndex;
                            const isActive = currentStatusIndex === stepIndex;

                            return (
                                <div key={step.label} className={`step-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                                    <div className="step-point">
                                        <span className="step-icon">{step.icon}</span>
                                    </div>
                                    <div className="step-label">{step.label}</div>
                                    {index < array.length - 1 && <div className="step-line"></div>}
                                </div>
                            );
                        })}
                    </div>

                    <div className="details-grid">
                        <div className="detail-item">
                            <label>Delivery To</label>
                            <p>{order.shippingAddress}</p>
                        </div>
                        <div className="detail-item">
                            <label>Estimated Delivery</label>
                            <p>{order.estimatedDelivery}</p>
                        </div>
                        <div className="detail-item">
                            <label>Carrier</label>
                            <p>Urban Logistics Express</p>
                            <button
                                className="concierge-hotline-btn"
                                onClick={() => window.dispatchEvent(new CustomEvent('toggle-concierge'))}
                            >
                                📞 Connect with Concierge
                            </button>
                        </div>
                    </div>

                    <div className="order-items-list">
                        <h3>Package Contents</h3>
                        <div className="items-scroll">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="order-item-row">
                                    <img src={item.image} alt={item.title} />
                                    <div className="item-info">
                                        <p className="item-title">{item.title}</p>
                                        <p className="item-qty">Qty: {item.qty} • ₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="order-summary-footer">
                        <div className="summary-left">
                            <p className="order-date">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="summary-right">
                            <p><strong>Total Paid:</strong> ₹{order.total}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
