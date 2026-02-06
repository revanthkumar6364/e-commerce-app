import { useState, useEffect } from 'react';
import { MessageSquare, X, Bell } from 'lucide-react';
import './sms.css';

export default function SMSNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/user/notifications', {
                headers: { 'user-id': '65c1a2b3e4b0c1a2b3e4b0c1' }
            });
            const data = await response.json();
            if (data.success) {
                // Keep all SMS, including promotional ones
                const newNotifs = data.notifications.filter(n => n.type === 'SMS');
                if (newNotifs.length > notifications.length) {
                    setUnreadCount(prev => prev + (newNotifs.length - notifications.length));
                }
                setNotifications(newNotifs);
            }
        } catch (error) {
            console.error('Error fetching SMS:', error);
        }
    };

    const deleteNotif = async (id, e) => {
        e.stopPropagation();
        try {
            const response = await fetch(`http://127.0.0.1:5000/user/notifications/${id}`, {
                method: 'DELETE',
                headers: { 'user-id': '65c1a2b3e4b0c1a2b3e4b0c1' }
            });
            const data = await response.json();
            if (data.success) {
                setNotifications(prev => prev.filter(n => n._id !== id));
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const triggerPromos = async () => {
        try {
            await fetch('http://127.0.0.1:5000/user/send-promotions', {
                method: 'POST',
                headers: { 'user-id': '65c1a2b3e4b0c1a2b3e4b0c1' }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Promo trigger error:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [notifications.length]);

    const handleOpen = () => {
        setIsOpen(!isOpen);
        setUnreadCount(0);
    };

    return (
        <div className="sms-simulation-container">
            <button className={`sms-trigger-btn ${unreadCount > 0 ? 'pulse' : ''}`} onClick={handleOpen}>
                <MessageSquare size={24} color="#fff" />
                {unreadCount > 0 && <span className="sms-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="sms-window">
                    <div className="sms-header">
                        <span><Bell size={14} /> SMS Messages</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button onClick={triggerPromos} className="sms-promo-trigger" title="Simulate Daily Promos">📢</button>
                            <button onClick={() => setIsOpen(false)} className="sms-close"><X size={16} /></button>
                        </div>
                    </div>
                    <div className="sms-body">
                        {notifications.length === 0 ? (
                            <div className="sms-empty">No messages yet</div>
                        ) : (
                            notifications.map((notif, idx) => (
                                <div key={notif._id || idx} className={`sms-bubble ${notif.title.includes('SALE') || notif.title.includes('DISCOUNT') ? 'promo' : ''}`}>
                                    <div className="sms-bubble-header">
                                        <div className="sms-sender">{notif.title.includes('SALE') ? '🔥 URBAN OFFERS' : 'Aura Premium'}</div>
                                        <button className="sms-delete-btn" onClick={(e) => deleteNotif(notif._id, e)}>
                                            <X size={10} />
                                        </button>
                                    </div>
                                    <div className="sms-message">{notif.message}</div>
                                    <div className="sms-time">
                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="sms-footer">
                        Simulated SMS Inbox
                    </div>
                </div>
            )}
        </div>
    );
}
