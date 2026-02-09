import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import AnnouncementBar from './components/AnnouncementBar';
import CartDrawer from './components/CartDrawer';

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
import NotFound from './pages/NotFound';
import StyleHub from './pages/StyleHub';
import Lookbook from './pages/Lookbook';
import MixMatch from './pages/MixMatch';


import Admin from './pages/Admin';
import ReturnPolicy from './pages/ReturnPolicy';
import InitiateReturn from './pages/InitiateReturn';
import Wishlist from './pages/Wishlist';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Cancellations from './pages/Cancellations';
import './App.css';

import Navbar from './components/Navbar';
// import Concierge from './components/Concierge'; // Handled in Layouts
// import SMSNotifications from './components/SMSNotifications'; // Handled in Layouts
// import BackToTop from './components/BackToTop'; // Handled in Layouts
import { StandardLayout, FullWidthLayout } from './components/Layouts';

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
          <Toaster position="top-center" reverseOrder={false} />
          <ScrollToTop />
          <AnnouncementBar />
          <Routes>
            {/* FULL WIDTH LAYOUT ROUTES */}
            <Route element={<FullWidthLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/men" element={<MenLanding />} />
              <Route path="/women" element={<WomenLanding />} />
              <Route path="/kids" element={<KidsLanding />} />
              <Route path="/beauty" element={<BeautyLanding />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/style-hub" element={<StyleHub />} />
              <Route path="/lookbook" element={<Lookbook />} />
              <Route path="/mix-match" element={<MixMatch />} />
            </Route>

            {/* STANDARD LAYOUT ROUTES (With container) */}
            <Route element={<StandardLayout />}>
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<Product />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmation" element={<Confirmation />} />
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
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <CartDrawer />
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
