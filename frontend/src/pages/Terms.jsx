import React from 'react';
import { FileText, Shield, Scale, Info } from 'lucide-react';
import './terms.css';

export default function Terms() {
    return (
        <div className="terms-page">
            <div className="terms-header">
                <FileText size={48} color="#282c3f" strokeWidth={1.5} />
                <h1>Terms & Conditions</h1>
                <p>Effective Date: January 1, 2026</p>
            </div>

            <div className="terms-container">
                <section className="terms-section">
                    <div className="section-title">
                        <Info size={20} />
                        <h2>1. Introduction</h2>
                    </div>
                    <p>
                        Welcome to Urban Vibe. By accessing or using our website, you agree to be bound by these Terms and Conditions.
                        If you do not agree with any part of these terms, please do not use our services.
                    </p>
                </section>

                <section className="terms-section">
                    <div className="section-title">
                        <Shield size={20} />
                        <h2>2. User Accounts</h2>
                    </div>
                    <p>
                        To access certain features of Urban Vibe, you may be required to create an account. You are responsible for maintaining
                        the confidentiality of your account information and for all activities that occur under your account.
                        We reserves the right to terminate accounts that violate our policies.
                    </p>
                </section>

                <section className="terms-section">
                    <div className="section-title">
                        <Scale size={20} />
                        <h2>3. Intellectual Property</h2>
                    </div>
                    <p>
                        All content on Urban Vibe, including text, graphics, logos, and images, is the property of Urban Vibe or its content
                        suppliers and is protected by international copyright laws. Unauthorized use of this content is strictly prohibited.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>4. Limitation of Liability</h2>
                    <p>
                        Urban Vibe shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or
                        the inability to use our services, or for the cost of procurement of substitute goods and services.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>5. Governing Law</h2>
                    <p>
                        These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes
                        relating to these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai.
                    </p>
                </section>
            </div>

            <div className="terms-footer">
                <p>Have questions about our Terms? <a href="/contact">Contact us</a></p>
            </div>
        </div>
    );
}
