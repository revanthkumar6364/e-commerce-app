import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Concierge from './Concierge';
import SMSNotifications from './SMSNotifications';
import BackToTop from './BackToTop';

/**
 * StandardLayout: Use for functional pages like Cart, Profile, Products
 * Includes a max-width container to keep content centered and readable.
 */
export const StandardLayout = () => {
    return (
        <>
            <Navbar />
            <div className="nav-spacer"></div>
            <main className="container">
                <Outlet />
            </main>
            <Concierge />
            <SMSNotifications />
            <BackToTop />
            <Footer />
        </>
    );
};

/**
 * FullWidthLayout: Use for Landing pages (Home, Men, Women, etc.)
 * No max-width container, allowing content to span the full screen width.
 */
export const FullWidthLayout = () => {
    return (
        <>
            <Navbar />
            <div className="nav-spacer"></div>
            <main style={{ width: '100%', overflowX: 'hidden' }}>
                <Outlet />
            </main>
            <Concierge />
            <SMSNotifications />
            <BackToTop />
            <Footer />
        </>
    );
};
