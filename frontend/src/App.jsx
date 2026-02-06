import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Welcome from './pages/Welcome';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


import Landing from './pages/Landing';
import MenLanding from './pages/MenLanding';
import WomenLanding from './pages/WomenLanding';
import KidsLanding from './pages/KidsLanding';
import BeautyLanding from './pages/BeautyLanding';
import Products from './pages/Products';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import Footer from './components/Footer';
import Travel from './pages/Travel';
import Wallet from './pages/Wallet';
import TrackOrder from './pages/TrackOrder';
import Confirmation from './pages/Confirmation';
import Contact from './pages/Contact';


import Admin from './pages/Admin';
import ReturnPolicy from './pages/ReturnPolicy';
import InitiateReturn from './pages/InitiateReturn';
import Wishlist from './pages/Wishlist';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Cancellations from './pages/Cancellations';
import './App.css';

import Navbar from './components/Navbar';
import Concierge from './components/Concierge';
import ActivityFeed from './components/ActivityFeed';
import ScrollToTop from './components/ScrollToTop';

function App() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          {/* <ScrollToTop /> - Disabled to fix scroll jumping issues */}
          <Navbar />
          <div className="nav-spacer"></div>
          <main className="container">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/men" element={<MenLanding />} />
              <Route path="/women" element={<WomenLanding />} />
              <Route path="/kids" element={<KidsLanding />} />
              <Route path="/beauty" element={<BeautyLanding />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<Product />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cancellations" element={<Cancellations />} />
              <Route path="/initiate-return/:orderId" element={<InitiateReturn />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </main>
          <Concierge />
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
