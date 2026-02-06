import React from 'react';
import { XCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import './cancellations.css';

export default function Cancellations() {
    return (
        <div className="cancellations-page">
            <div className="can-header">
                <XCircle size={48} color="#f44336" strokeWidth={1.5} />
                <h1>Cancellation Policy</h1>
                <p>Simple and transparent cancellation terms for your peace of mind.</p>
            </div>

            <div className="can-container">
                <div className="can-highlight">
                    <Clock size={20} />
                    <span>You can cancel your order anytime before it is shipped for a full refund.</span>
                </div>

                <section className="can-section">
                    <h2>1. Before Shipping</h2>
                    <p>
                        If you change your mind shortly after placing an order, you can cancel it directly through your account dashboard
                        in the "My Orders" section. This option is available as long as the "Cancel" button is visible.
                    </p>
                    <div className="can-infobox success">
                        A 100% refund will be processed immediately to your original payment method.
                    </div>
                </section>

                <section className="can-section">
                    <h2>2. After Shipping</h2>
                    <p>
                        Once an order has been shipped, it cannot be cancelled. However, you can refuse the package at the time of delivery
                        or initiate a return request after receiving it, subject to our <a href="/return-policy">Return Policy</a>.
                    </p>
                </section>

                <section className="can-section">
                    <h2>3. Exceptions</h2>
                    <div className="can-warning">
                        <AlertTriangle size={20} />
                        <div>
                            <strong>Non-Cancellable Items:</strong> Custom-made products, personalized items, and specific hygiene-sensitive
                            categories cannot be cancelled once production or processing has started.
                        </div>
                    </div>
                </section>

                <section className="can-section">
                    <h2>4. Refund Process</h2>
                    <div className="can-steps">
                        <div className="can-step">
                            <ShieldCheck size={24} />
                            <div>
                                <h4>Secure Refunds</h4>
                                <p>Refunds usually take 3-5 business days to reflect in your bank account/wallet after confirmation.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="can-footer">
                <p>Need urgent help with a cancellation? <a href="/contact">Contact Support</a> or chat with our automated concierge.</p>
            </div>
        </div>
    );
}
