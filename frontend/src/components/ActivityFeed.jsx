import { useState, useEffect } from 'react';
import './activity-feed.css';

const ACTIVITIES = [
    { city: 'Mumbai', item: 'Diamond Rolex Watch', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&q=80' },
    { city: 'Paris', item: 'Velvet Evening Gown', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=100&q=80' },
    { city: 'Dubai', item: 'Gold Plated iPhone', img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=100&q=80' },
    { city: 'London', item: 'Leather Weekender', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&q=80' },
    { city: 'New York', item: 'Limited Sneakers', img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=100&q=80' },
];

export default function ActivityFeed() {
    const [active, setActive] = useState(false);
    const [current, setCurrent] = useState(ACTIVITIES[0]);

    const cycleActivity = () => {
        setActive(false);
        setTimeout(() => {
            const randomActivity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
            setCurrent(randomActivity);
            setActive(true);

            // Hide after 6 seconds
            setTimeout(() => setActive(false), 6000);
        }, 1000);
    };

    useEffect(() => {
        // Show first popup after 5 seconds
        const initialTimeout = setTimeout(() => {
            cycleActivity();
        }, 5000);

        const interval = setInterval(() => {
            cycleActivity();
        }, 15000); // New activity every 15 seconds

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    if (!active) return null;

    return (
        <div className={`activity-toast ${active ? 'slide-in' : ''}`}>
            <div className="activity-img">
                <img src={current.img} alt="Product" />
            </div>
            <div className="activity-info">
                <p className="activity-text">
                    Someone in <span className="gold-text">{current.city}</span> purchased
                </p>
                <p className="activity-item">{current.item}</p>
                <span className="activity-time">Just now</span>
            </div>
        </div>
    );
}
