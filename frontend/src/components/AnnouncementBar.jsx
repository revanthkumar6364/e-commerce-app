import { useState } from 'react';
import { X } from 'lucide-react';
import './AnnouncementBar.css';

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="announcement-bar animate-fade-in-down">
            <div className="announcement-content">
                <span>✨ Free Shipping on Orders Over ₹2,000 | Use Code: <strong>FREESHIP</strong></span>
            </div>
            <button className="announcement-close" onClick={() => setIsVisible(false)}>
                <X size={16} />
            </button>
        </div>
    );
}
