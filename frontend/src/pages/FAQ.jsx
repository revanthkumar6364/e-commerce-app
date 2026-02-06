import React, { useState } from 'react';
import { HelpCircle, Package, RefreshCcw, CreditCard, User } from 'lucide-react';
import './faq.css';

const FAQ_DATA = [
    {
        category: 'Orders & Tracking',
        icon: <Package size={24} />,
        questions: [
            {
                q: 'How do I track my order?',
                a: 'You can track your order in real-time by visiting the "Track Order" page and entering your Order ID. You will also receive an email and SMS with a tracking link once your order is shipped.'
            },
            {
                q: 'Can I change my delivery address after placing an order?',
                a: 'Address changes are only possible before the order is processed (usually within 2 hours of placement). Please contact our support team immediately for assistance.'
            },
            {
                q: 'What should I do if my order is delayed?',
                a: 'While we strive for on-time delivery, delays can occasionally happen due to logistical issues. If your order is significantly delayed, please check the status on the "Track Order" page or contact us.'
            }
        ]
    },
    {
        category: 'Returns & Refunds',
        icon: <RefreshCcw size={24} />,
        questions: [
            {
                q: 'What is your return policy?',
                a: 'We offer a 7-day no-questions-asked return policy for most products. The items must be in their original condition with tags intact. Some categories like innerwear and cosmetics are non-returnable.'
            },
            {
                q: 'How long does a refund take?',
                a: 'Once your return is picked up and passes the quality check at our warehouse, the refund is initiated. It typically takes 3-5 business days for the amount to reflect in your original payment method.'
            },
            {
                q: 'Is there a return shipping fee?',
                a: 'Returns are free for defective or incorrect items. For change-of-mind returns, a nominal shipping fee may be deducted from the refund amount.'
            }
        ]
    },
    {
        category: 'Payment & Wallet',
        icon: <CreditCard size={24} />,
        questions: [
            {
                q: 'What payment methods do you accept?',
                a: 'We accept all major Credit/Debit cards, UPI, Net Banking, and select Wallets. Cash on Delivery (COD) is available for most locations.'
            },
            {
                q: 'Is it safe to use my credit card on Urban Vibe?',
                a: 'Yes, your payment security is our top priority. We use industry-standard encryption and secure payment gateways to ensure your data is always protected.'
            }
        ]
    },
    {
        category: 'Membership',
        icon: <User size={24} />,
        questions: [
            {
                q: 'What are the benefits of the Inner Circle membership?',
                a: 'Inner Circle members enjoy early access to sales, exclusive discounts, free express shipping, and a dedicated customer support line.'
            }
        ]
    }
];

export default function FAQ() {
    const [activeQuestion, setActiveQuestion] = useState(null);

    const toggleQuestion = (index) => {
        setActiveQuestion(activeQuestion === index ? null : index);
    };

    return (
        <div className="faq-page">
            <div className="faq-header">
                <HelpCircle size={48} color="#ff3f6c" strokeWidth={1.5} />
                <h1>Frequently Asked Questions</h1>
                <p>Find answers to common questions about Urban Vibe.</p>
            </div>

            <div className="faq-container">
                {FAQ_DATA.map((section, sIdx) => (
                    <div key={sIdx} className="faq-category-section">
                        <div className="category-header">
                            {section.icon}
                            <h2>{section.category}</h2>
                        </div>
                        <div className="questions-list">
                            {section.questions.map((item, qIdx) => {
                                const uniqueIdx = `${sIdx}-${qIdx}`;
                                const isOpen = activeQuestion === uniqueIdx;
                                return (
                                    <div key={qIdx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                                        <div className="faq-question" onClick={() => toggleQuestion(uniqueIdx)}>
                                            <span>{item.q}</span>
                                            <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                                        </div>
                                        {isOpen && <div className="faq-answer">{item.a}</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="faq-footer">
                <h3>Still have questions?</h3>
                <p>If you couldn't find what you were looking for, our support team is ready to help.</p>
                <div className="faq-cta-row">
                    <a href="/contact" className="faq-btn primary">Contact Support</a>
                    <button onClick={() => window.dispatchEvent(new CustomEvent('toggle-concierge'))} className="faq-btn secondary">Chat with Concierge</button>
                </div>
            </div>
        </div>
    );
}
