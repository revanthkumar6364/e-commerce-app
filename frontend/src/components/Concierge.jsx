import React, { useState } from 'react';
import { Sparkles, X, MessageSquare, Phone, MapPin, Package } from 'lucide-react';
import './concierge.css';

export default function Concierge() {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('menu'); // 'menu' | 'chat'
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! I am your personal AI shopping assistant. How can I help you find the perfect luxury item today?' }
    ]);
    const [input, setInput] = useState('');
    const [lastIntent, setLastIntent] = useState(null);

    React.useEffect(() => {
        const handleToggle = () => setIsOpen(prev => !prev);
        window.addEventListener('toggle-concierge', handleToggle);
        return () => window.removeEventListener('toggle-concierge', handleToggle);
    }, []);

    const getAIResponse = (text) => {
        const lower = text.toLowerCase();

        // Helper to pick random element
        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // --- CONTEXT LOOPS (Memory) ---

        // 1. Bag Issue Follow-up (The "Loop")
        if (lastIntent === 'bag_issue' && lower.match(/no|not|fail|stuck|error|same|tried|didn't work/)) {
            return {
                text: "I see the issue persists. Since refreshing didn't help, I've escalated this to Priority Tech Support. A live agent will check your session immediately. (Ticket #404-URBAN created)",
                intent: 'support_escalated'
            };
        }

        if (lastIntent === 'greeting' && lower.match(/yes|sure|okay|cool|ready/)) {
            return {
                text: "Excellent. Would you prefer to explore 'New Arrivals' or our exclusive 'Member Sale'?",
                intent: 'shopping_direction'
            };
        }

        // --- NEW INTENTS ---

        // 1. GREETINGS & WELCOME
        if (lower.match(/\b(hi|hello|hey|greetings|start|yo)\b/)) {
            const openers = ["Hello there!", "Welcome to Urban Vibe.", "Greetings!", "Hi!", "Good to see you.", "Welcome back."];
            const offers = ["Ready to explore our new collection?", "How can I elevate your style today?", "Looking for something specific?", "I'm here to assist with your precision shopping needs.", "What can I help you discover?"];
            return { text: `${pick(openers)} ${pick(offers)}`, intent: 'greeting' };
        }

        // 2. BAG / CART / ADD ISSUES
        if (lower.match(/bag|cart|add|buy|purchase/)) {
            const apologies = ["I see you're encountering a hurdle with the bag.", "That sounds frustrating.", "I apologize for the inconvenience with the cart.", "Let's sort out that bag issue.", "Hold on, let's fix that cart glitch."];
            const fixes = ["A quick page refresh usually clears this.", "Please verify if your size is currently in stock.", "Trying a different browser sometimes helps.", "It might be a temporary sync issue on our end."];
            const reassurance = ["If it persists, let me know and I'll connect you to support.", "Tell me if it's still stuck.", "We want your checkout to be flawless.", "Reply 'no' if you still can't add it."];
            return { text: `${pick(apologies)} ${pick(fixes)} ${pick(reassurance)}`, intent: 'bag_issue' };
        }

        // 3. TRACKING / ORDER STATUS
        if (lower.match(/track|order|shipping|delivery|where/)) {
            const tracks = ["For order updates, you can check the 'Track Package' section.", "Tracking is easy via the main menu.", "Curious about your delivery?", "Need a status update?"];
            const actions = ["Simply enter your Order ID there.", "The 'Track Package' button has real-time status.", "Just pop your ID into the tracker.", "Our global logistics tracker is ready for you."];
            return { text: `${pick(tracks)} ${pick(actions)}`, intent: 'tracking' };
        }

        // 4. GENERAL SHOPPING / FALLBACK
        const transition = ["That's a fascinating choice.", "I can certainly help with that.", "Let me see what I can find.", "Excellent taste.", "A bold selection.", "Interesting request."];
        const action = ["checking our global inventory...", "scanning for matching accessories...", "consulting our style database...", "finding the best options for you...", "looking up similar items...", "curating a list for you..."];
        return { text: `${pick(transition)} I am ${pick(action)}`, intent: 'general' };
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
        setInput('');

        // Mock AI Response (Faster: 200ms)
        setTimeout(() => {
            const response = getAIResponse(userMsg);
            // Handle both object return (new logic) and string return (safety)
            const aiText = typeof response === 'object' ? response.text : response;
            const newIntent = typeof response === 'object' ? response.intent : 'general';

            setMessages(prev => [...prev, { type: 'bot', text: aiText }]);
            setLastIntent(newIntent);
        }, 200);
    };

    return (
        <div className={`concierge-system ${isOpen ? 'active' : ''}`}>
            {/* Floating Trigger */}
            <button className="concierge-trigger" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Sparkles size={24} />}
                <span className="tooltip">Personal Concierge</span>
            </button>

            {/* Concierge Panel */}
            <div className="concierge-panel">
                <div className="panel-header">
                    {view === 'chat' && (
                        <button className="back-btn-chat" onClick={() => setView('menu')}>←</button>
                    )}
                    <Sparkles className="header-icon" />
                    <div className="header-text">
                        <h3>Urban Vibe AI</h3>
                        <p>{view === 'chat' ? 'Shopping Assistant' : 'Concierge Service'}</p>
                    </div>
                </div>

                <div className="panel-content">
                    {view === 'menu' ? (
                        <>
                            <p className="welcome-msg">Good afternoon. How may I assist your luxury journey today?</p>

                            <div className="quick-actions">
                                <button className="action-btn" onClick={() => window.location.href = '/track-order'}>
                                    <Package size={18} />
                                    <span>Track Package</span>
                                </button>
                                <button className="action-btn" onClick={() => window.location.href = '/wallet'}>
                                    <Sparkles size={18} />
                                    <span>Exclusive Tiers</span>
                                </button>
                                <button className="action-btn" onClick={() => setView('chat')}>
                                    <MessageSquare size={18} />
                                    <span>AI Shopping Guide</span>
                                </button>
                            </div>

                            <div className="direct-contact">
                                <h4>DIRECT CHANNELS</h4>
                                <div className="contact-links">
                                    <a href="tel:+1800URBAN"><Phone size={14} /> Priority Audio</a>
                                    <a href="#!" onClick={e => e.preventDefault()}><MapPin size={14} /> Boutique Locator</a>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="chat-interface">
                            <div className="chat-messages">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`chat-bubble ${msg.type}`}>
                                        {msg.text}
                                    </div>
                                ))}
                            </div>
                            <form className="chat-input-area" onSubmit={handleSend}>
                                <input
                                    type="text"
                                    placeholder="Ask me anything..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="panel-footer">
                    <span>Active Member Support 24/7</span>
                </div>
            </div>
        </div>
    );
}
