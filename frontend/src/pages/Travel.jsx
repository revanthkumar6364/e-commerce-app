import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Plane, Train } from 'lucide-react';
import { couponsAndOffers } from '../data/products';
import api from '../utils/api';
import './travel.css';

export default function Travel() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialType = searchParams.get('type') || 'flight';
    const [bookingType, setBookingType] = useState(initialType);
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState(null);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookingStep, setBookingStep] = useState('search'); // search, seats, payment, ticket
    const [passengerEmail, setPassengerEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const flowSectionRef = useRef(null);

    // Dynamic Airport/Station Images
    const travelHeroImg = bookingType === 'flight'
        ? 'https://images.unsplash.com/photo-1436491865332-7a61a109c05d?q=80&w=2074&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1474487548417-781cb714c22d?q=80&w=2070&auto=format&fit=crop';

    const travelBannerImg = bookingType === 'flight'
        ? 'https://images.unsplash.com/photo-1540339832862-437f267a0afa?q=80&w=2070&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?q=80&w=2070&auto=format&fit=crop';

    useEffect(() => {
        const toParam = searchParams.get('to');
        if (toParam === 'Delhi') {
            setBookingType('flight');
            setTimeout(() => {
                const flightOptions = getFlightOptions();
                setResults(flightOptions);
                const delhiFlight = flightOptions.find(f => f.to === 'Delhi' || f.from === 'Delhi');
                if (delhiFlight) setSelectedTrip(delhiFlight);
            }, 500);
        }
    }, [searchParams]);

    const getTrainOptions = () => [
        { id: 't1', carrier: 'Vande Bharat', code: 'VB-2241', from: 'Mumbai', to: 'Goa', dep: '05:30 AM', arr: '11:30 AM', duration: '6h 00m', price: 2450, status: 'On Time', available: 12, type: 'Executive Chair', img: 'https://images.unsplash.com/photo-1590644365607-1c5a519a9a37?w=400&h=250&fit=crop' },
        { id: 't2', carrier: 'Rajdhani Exp', code: 'RAJD-12952', from: 'Delhi', to: 'Mumbai', dep: '04:40 PM', arr: '08:35 AM', duration: '15h 55m', price: 4800, status: 'On Time', available: 5, type: '1st AC Sleeper', img: 'https://images.unsplash.com/photo-1541414779316-956a5084c0d4?w=400&h=250&fit=crop' },
        { id: 't3', carrier: 'Tejas Express', code: 'TEJAS-22119', from: 'Chennai', to: 'Madurai', dep: '06:00 AM', arr: '12:15 PM', duration: '6h 15m', price: 1850, status: 'On Time', available: 20, type: 'Smart AC', img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc132f7?w=400&h=250&fit=crop' },
        { id: 't4', carrier: 'Duronto Exp', code: 'DUR-12260', from: 'Kolkata', to: 'Delhi', dep: '05:00 PM', arr: '10:30 AM', duration: '17h 30m', price: 3900, status: 'Delayed 1h', available: 8, type: 'AC Tier 2', img: 'https://images.unsplash.com/photo-1541414779316-956a5084c0d4?w=400&h=250&fit=crop' },
    ];

    const getFlightOptions = () => [
        { id: 'f1', carrier: 'Urban Airways', code: 'UA-2026', from: 'Mumbai', to: 'Dubai', dep: '09:00 AM', arr: '12:30 PM', duration: '3h 30m', price: 15400, status: 'Boarding', available: 8, aircraft: 'Boeing 787 Dreamliner', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109c05d?w=400&h=250&fit=crop' },
        { id: 'f2', carrier: 'Sky Luxury', code: 'SL-77', from: 'Delhi', to: 'Singapore', dep: '11:45 PM', arr: '07:30 AM', duration: '5h 15m', price: 28900, status: 'On Time', available: 4, aircraft: 'Airbus A380 Premium', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=250&fit=crop' },
        { id: 'f3', carrier: 'Global Connect', code: 'GC-402', from: 'London', to: 'New York', dep: '02:00 PM', arr: '05:45 PM', duration: '7h 45m', price: 54000, status: 'Check-in', available: 15, aircraft: 'Boeing 777X', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=250&fit=crop' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        setSearching(true);
        setTimeout(() => {
            setSearching(false);
            setResults(bookingType === 'flight' ? getFlightOptions() : getTrainOptions());
        }, 1200);
    };

    const handleSelectTrip = (trip) => {
        setSelectedTrip(trip);
        setBookingStep('seats');
    };

    const toggleSeat = (id) => {
        if (selectedSeats.includes(id)) {
            setSelectedSeats(selectedSeats.filter(s => s !== id));
        } else {
            setSelectedSeats([...selectedSeats, id]);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const { data } = await api.post('/travel/book', {
                email: passengerEmail,
                passenger: 'Urban Traveler',
                carrier: selectedTrip.carrier,
                code: selectedTrip.code,
                from: selectedTrip.from,
                to: selectedTrip.to,
                seats: selectedSeats
            });
            if (data.success) {
                setBookingStep('ticket');
            } else {
                alert('Booking failed: ' + data.message);
            }
        } catch (err) {
            console.error('Booking error:', err);
            alert('Booking engine simulated success (Backend connection optional for test).');
            setBookingStep('ticket');
        } finally {
            setIsProcessing(false);
        }
    };

    const renderSeats = () => {
        const isTrain = bookingType === 'train';
        const seats = [];
        const rows = isTrain ? ['W', 'M', 'A'] : ['A', 'B', 'C', 'D', 'E', 'F'];
        const numRows = isTrain ? 15 : 10;

        for (let i = 1; i <= numRows; i++) {
            rows.forEach(row => {
                const id = `${i}${row}`;
                const isBooked = (i * row.charCodeAt(0)) % 7 === 0;
                const isSelected = selectedSeats.includes(id);
                seats.push(
                    <div
                        key={id}
                        className={`seat-premium ${bookingType}-style ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => !isBooked && toggleSeat(id)}
                    >
                        <span className="seat-label">{id}</span>
                    </div>
                );
            });
        }
        return seats;
    };

    if (bookingStep === 'ticket') {
        const isTrain = bookingType === 'train';
        return (
            <div className="travel-page ticket-view">
                <div className="ticket-card-premium">
                    <div className="ticket-top-section">
                        <div className="brand-header">{isTrain ? 'LUXURY RAILS INDIA' : 'URBAN AIRWAYS GLOBAL'}</div>
                        <div className="booking-ref">PNR: {Math.floor(Math.random() * 900000 + 100000)}</div>
                    </div>
                    <div className="ticket-main-section">
                        <div className="traveler-details">
                            <h2>{selectedTrip.carrier}</h2>
                            <p className="flight-code-badge">{selectedTrip.code}</p>
                            <div className="pax-name">Traveler: <span>Urban Explorer</span></div>
                        </div>
                        <div className="route-visual">
                            <div className="city-box">
                                <p className="city-code">{selectedTrip.from.slice(0, 3).toUpperCase()}</p>
                                <p className="city-name">{selectedTrip.from}</p>
                            </div>
                            <div className="plane-line">
                                <span className="plane-icon-ticket">{isTrain ? '🚆' : '✈️'}</span>
                                <div className="dotted-line"></div>
                            </div>
                            <div className="city-box text-right">
                                <p className="city-code">{selectedTrip.to.slice(0, 3).toUpperCase()}</p>
                                <p className="city-name">{selectedTrip.to}</p>
                            </div>
                        </div>
                        <div className="booking-meta">
                            <div className="meta-item">
                                <p className="label">DATE</p>
                                <p className="val">28 FEB 2026</p>
                            </div>
                            <div className="meta-item">
                                <p className="label">SEATS</p>
                                <p className="val">{selectedSeats.join(', ')}</p>
                            </div>
                            <div className="meta-item">
                                <p className="label">{isTrain ? 'PLATFORM' : 'GATE'}</p>
                                <p className="val">{isTrain ? 'P-03' : 'G-14A'}</p>
                            </div>
                        </div>

                        {/* Official Stamp & Signature */}
                        <div className="ticket-auth-section" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed #ccc', paddingTop: '15px' }}>
                            <div className="stamp-box" style={{
                                border: '3px double #d63384',
                                color: '#d63384',
                                padding: '5px 10px',
                                transform: 'rotate(-10deg)',
                                fontFamily: 'monospace',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                opacity: 0.8
                            }}>
                                URBAN VIBE<br />AUTHORIZED<br />OFFICIAL STAMP
                            </div>
                            <div className="signature-box" style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '1.4rem', color: '#333' }}>Revanth Kumar</div>
                                <div style={{ borderTop: '1px solid #333', width: '120px', marginLeft: 'auto' }}></div>
                                <div style={{ fontSize: '0.7rem', color: '#666' }}>Authorized Signatory</div>
                            </div>
                        </div>
                    </div>
                    <div className="ticket-bottom-section">
                        <div className="barcode-area">
                            <div className="barcode-mock"></div>
                            <p>SCAN TO BOARD</p>
                        </div>
                        <div className="ticket-actions">
                            <button className="premium-btn" onClick={() => window.print()}>Save Ticket</button>
                            <button className="premium-btn secondary" onClick={() => window.location.href = '/travel'}>Back to Travel</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (bookingStep === 'seats') {
        const isTrain = bookingType === 'train';
        return (
            <div className="travel-page">
                <div className="seat-booking-layout">
                    <div className="cabin-overview">
                        <div className="cabin-header">
                            <button className="back-btn-minimal" onClick={() => setBookingStep('search')} style={{ marginBottom: '15px' }}>← BACK TO SEARCH</button>
                            <h2>{isTrain ? 'Coach Selection' : 'Cabin Selection'}</h2>
                            <p>{selectedTrip.carrier} - {selectedTrip.aircraft || selectedTrip.type}</p>
                        </div>
                        <div className={`cabin-silhouette ${bookingType}-frame`}>
                            <div className="glass-ceiling"></div>
                            <div className={`cabin-grid-pro ${bookingType}-grid`}>
                                {renderSeats()}
                            </div>
                        </div>
                    </div>
                    <div className="selection-sidebar">
                        <h3>Selection Summary</h3>
                        <div className="summary-card">
                            <div className="summary-item">
                                <span>Travel Mode</span>
                                <strong>{isTrain ? 'Railways' : 'Airways'}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Selected</span>
                                <strong>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Premium Fee</span>
                                <strong className="price-tag">₹{(selectedSeats.length * selectedTrip.price).toLocaleString()}</strong>
                            </div>
                        </div>
                        <button
                            className="premium-action-btn"
                            disabled={selectedSeats.length === 0}
                            onClick={() => setBookingStep('payment')}
                        >
                            Confirm & Pay
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (bookingStep === 'payment') {
        return (
            <div className="travel-page">
                <div className="booking-container payment-view-premium">
                    <div className="payment-card-glass">
                        <h2>Secure Hub Checkout</h2>
                        <div className="payment-summary-mini">
                            <p>Amount to Authorize: <span className="total-blue">₹{(selectedSeats.length * selectedTrip.price).toLocaleString()}</span></p>
                        </div>
                        <form className="payment-form-pro" onSubmit={handlePaymentSubmit}>
                            <div className="form-group-pro">
                                <label>Confirmation E-mail</label>
                                <input
                                    type="email"
                                    placeholder="traveler@urban.com"
                                    value={passengerEmail}
                                    onChange={(e) => setPassengerEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group-pro">
                                <label>Payment Method (Encrypted)</label>
                                <div className="card-input-wrapper">
                                    <input type="text" placeholder="5542 XXXX XXXX XXXX" required />
                                    <div className="card-sub-grid">
                                        <input type="text" placeholder="MM / YY" required />
                                        <input type="password" placeholder="***" required />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group-pro">
                                <label>Promo Code</label>
                                <div className="card-input-wrapper">
                                    <input type="text" placeholder="Have a coupon? (e.g. VIP25)" id="travel-coupon" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const codeInput = document.getElementById('travel-coupon');
                                            const code = codeInput.value.toUpperCase();
                                            const coupon = couponsAndOffers.find(c => c.code === code);
                                            if (coupon) {
                                                alert(`✅ Coupon Applied! ${coupon.desc}`);
                                            } else {
                                                alert('❌ Invalid Coupon');
                                            }
                                        }}
                                        style={{
                                            background: 'var(--accent-blue)',
                                            border: 'none',
                                            padding: '0 20px',
                                            borderRadius: '12px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            marginLeft: '10px'
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="pay-now-btn" disabled={isProcessing}>
                                {isProcessing ? '🔄 Authorizing Connection...' : `Pay & Get Ticket`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="travel-page">
            <div className="travel-hero-luxury" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${travelHeroImg})` }}>
                <div className="hero-content-inner">
                    <div className="glass-badge">{bookingType.toUpperCase()} CONCIERGE</div>
                    <h1>{bookingType === 'flight' ? 'Fly Above the Clouds' : 'Journey the Rail Luxury'}</h1>
                    <p>{bookingType === 'flight' ? 'Premium global aviation services at your fingertips' : 'Unmatched Indian Railways experience for the modern voyager'}</p>
                </div>
            </div>

            <div className="travel-progress-container" ref={flowSectionRef}>
                {(() => {
                    const steps = ['search', 'seats', 'payment', 'ticket'];
                    return steps.map((step) => {
                        const currentIndex = steps.indexOf(bookingStep);
                        const stepIndex = steps.indexOf(step);
                        let status = 'pending';
                        if (stepIndex < currentIndex) status = 'completed';
                        if (stepIndex === currentIndex) status = 'active';

                        return (
                            <div key={step} className={`progress-step ${status}`}>
                                <div className="step-dot"></div>
                                <span className="step-label">{step.toUpperCase()}</span>
                            </div>
                        );
                    });
                })()}
                <div className="progress-line-bg">
                    <div className="progress-line-fill" style={{ width: `${(['search', 'seats', 'payment', 'ticket'].indexOf(bookingStep) / 3) * 100}%` }}></div>
                </div>
            </div>

            <div className="booking-main-container">
                <div className="map-locating-dashboard">
                    <div className="dashboard-stats">
                        <div className="stat-pill">
                            <span className="pulse-dot"></span>
                            <span className="stat-label">SYSTEM: </span>
                            <span className="stat-val">ACTIVE</span>
                        </div>
                        <div className="stat-pill">
                            <span className="stat-label">MODE: </span>
                            <span className="stat-val">{bookingType === 'flight' ? 'AVIATION' : 'RAILWAYS'}</span>
                        </div>
                    </div>
                    <div className="live-tracking-map-pro">
                        <svg viewBox="0 0 800 400" className="svg-map-blue">
                            <path className="world-map-paths" d="M50,200 Q400,50 750,200" fill="none" stroke="rgba(226, 194, 117, 0.4)" strokeWidth="3" strokeDasharray="10,10" />
                            <circle cx="50" cy="200" r="8" fill="#e2c275" className="pulse-marker" />
                            <circle cx="750" cy="200" r="8" fill="#10b981" />
                            <g className="plane-icon-marker animated-plane-pro">
                                <text fontSize="36" filter="drop-shadow(0 0 8px #e2c275)">{bookingType === 'flight' ? '✈️' : '🚆'}</text>
                            </g>
                        </svg>
                        <div className="tracking-info-overlay">
                            <p>Global Positioning Active • {bookingType === 'flight' ? 'Skytrack v2.4' : 'Railtrack v1.1'} Online</p>
                        </div>
                    </div>
                </div>

                <div className="travel-type-tabs-premium">
                    <button
                        className={`tab-btn-pro ${bookingType === 'flight' ? 'active' : ''}`}
                        onClick={() => { setBookingType('flight'); setResults(null); }}
                    >
                        <span className="icon">✈️</span> Flights
                    </button>
                    <button
                        className={`tab-btn-pro ${bookingType === 'train' ? 'active' : ''}`}
                        onClick={() => { setBookingType('train'); setResults(null); }}
                    >
                        <span className="icon">🚆</span> Trains
                    </button>
                </div>

                <div className="booking-form-luxury">
                    <form className="form-flex-pro" onSubmit={handleSearch}>
                        <div className="input-group-luxury">
                            <label><MapPin size={14} style={{ marginRight: '6px' }} /> Origin</label>
                            <input type="text" placeholder="Departure City" required />
                        </div>
                        <div className="input-group-luxury">
                            <label><MapPin size={14} style={{ marginRight: '6px' }} /> Destination</label>
                            <input type="text" placeholder="Arrival City" required />
                        </div>
                        <div className="input-group-luxury">
                            <label><Calendar size={14} style={{ marginRight: '6px' }} /> Travel Date</label>
                            <input type="date" required />
                        </div>
                        <button type="submit" className="luxury-search-btn">
                            {searching ? 'FETCHING DATA...' : 'SEARCH JOURNEYS'}
                        </button>
                    </form>
                </div>

                {results && (
                    <div className="travel-results-rich">
                        {results.map(trip => (
                            <div key={trip.id} className="result-card-luxury">
                                <div className="carrier-branding">
                                    <div className="carrier-logo-img" style={{ backgroundImage: `url(${trip.img})` }}></div>
                                    <div className="carrier-info">
                                        <h4 className="airline-name">{trip.carrier}</h4>
                                        <span className="equipment-tag">{trip.aircraft || trip.type}</span>
                                    </div>
                                </div>
                                <div className="journey-details">
                                    <div className="time-city">
                                        <p className="time">{trip.dep}</p>
                                        <p className="city">{trip.from}</p>
                                    </div>
                                    <div className="transit-line">
                                        <span className="duration">{trip.duration}</span>
                                        <div className="line-visual">
                                            <div className="dot"></div>
                                            <div className="dot destination"></div>
                                        </div>
                                    </div>
                                    <div className="time-city">
                                        <p className="time">{trip.arr}</p>
                                        <p className="city">{trip.to}</p>
                                    </div>
                                </div>
                                <div className="purchase-side">
                                    <div className="price-box">
                                        <span className="currency">₹</span>
                                        <span className="amount">{trip.price.toLocaleString()}</span>
                                    </div>
                                    <button className="blue-book-btn" onClick={() => handleSelectTrip(trip)}>Reserve Seat</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <section className="trending-destinations-premium">
                    <div className="section-header-modern">
                        <div className="header-titles">
                            <h2>Trending Destinations</h2>
                            <p>Hand-picked escapes for the sophisticated traveler</p>
                        </div>
                    </div>
                    <div className="destinations-grid">
                        {[
                            { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=600' },
                            { name: 'Swiss Alps', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1533602115663-71a7dd724e5a?q=80&w=600' },
                            { name: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600' },
                            { name: 'Amalfi', country: 'Italy', img: 'https://images.unsplash.com/photo-1633321088390-8e1f5822650d?q=80&w=600' }
                        ].map((dest, i) => (
                            <div key={i} className="destination-card-rich">
                                <div className="dest-image" style={{ backgroundImage: `url(${dest.img})` }}>
                                    <div className="dest-overlay">
                                        <div className="dest-info">
                                            <h3>{dest.name}</h3>
                                            <span>{dest.country}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* RICH SALES BANNER (Requested) */}
                <section className="featured-travel-banner">
                    <div
                        className="travel-banner-card flash-sale-banner-card"
                        style={{ backgroundImage: `url(${travelBannerImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                        <div className="banner-glass-overlay sale-overlay">
                            <span className="highlight-tag sale">SPECIAL TRAVEL EVENT</span>
                            <h2>{bookingType === 'flight' ? 'Flight Extravaganza' : 'Luxury Rail Escape'}</h2>
                            <p>
                                {bookingType === 'flight'
                                    ? 'Up to 50% extra coins on every international flight booking. Experience luxury for less.'
                                    : 'Get premium station lounge access and 40% extra coins on Vande Bharat bookings.'}
                            </p>
                            <button onClick={() => navigate('/products')} className="banner-action-btn">View All Offers</button>
                        </div>
                    </div>
                </section>

                <section className="live-airport-dashboard-modern">
                    <div className="dashboard-header-rich">
                        <div className="header-titles">
                            <h2>{bookingType === 'flight' ? 'Flight Living Dashboard' : 'Railways Tracking Board'}</h2>
                            <p>Real-time updates on {bookingType === 'flight' ? 'Sky' : 'Track'} movements</p>
                        </div>
                        <div className="terminal-badge">{bookingType === 'flight' ? 'TERMINAL 2' : 'PLATFORM 1-8'}</div>
                    </div>
                    <div className="fids-table">
                        <div className="fids-row header">
                            <span>{bookingType === 'flight' ? 'FLIGHT' : 'TRAIN'}</span><span>DESTINATION</span><span>{bookingType === 'flight' ? 'GATE' : 'PLAT'}</span><span>STATUS</span><span>REMARK</span>
                        </div>
                        {(() => {
                            const now = new Date();
                            const getFidsTime = (offsetMin) => {
                                const t = new Date(now.getTime() + offsetMin * 60000);
                                return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            };

                            if (bookingType === 'flight') {
                                return (
                                    <>
                                        <div className="fids-row">
                                            <span className="code">UA-2026</span><span>UAE (DXB)</span><span>G12</span><span className="status boarding">BOARDING</span><span className="remark">ENDS {getFidsTime(15)}</span>
                                        </div>
                                        <div className="fids-row">
                                            <span className="code">SL-77</span><span>Singapore (SIN)</span><span>D04</span><span className="status final-call">FINAL CALL</span><span className="remark">DEP {getFidsTime(5)}</span>
                                        </div>
                                        <div className="fids-row">
                                            <span className="code">AI-302</span><span>Delhi (DEL)</span><span>A09</span><span className="status boarding">ON TIME</span><span className="remark">BOARDING {getFidsTime(45)}</span>
                                        </div>
                                    </>
                                );
                            } else {
                                return (
                                    <>
                                        <div className="fids-row">
                                            <span className="code">VB-2241</span><span>Goa (MAO)</span><span>P01</span><span className="status boarding">BOARDING</span><span className="remark">DEP {getFidsTime(10)}</span>
                                        </div>
                                        <div className="fids-row">
                                            <span className="code">RAJD-129</span><span>Delhi (NDLS)</span><span>P03</span><span className="status boarding">EXPECTED</span><span className="remark">ARR {getFidsTime(20)}</span>
                                        </div>
                                        <div className="fids-row">
                                            <span className="code">SHAT-502</span><span>Kolkata (HWH)</span><span>P05</span><span className="status delayed">DELAYED</span><span className="remark">EST {getFidsTime(65)}</span>
                                        </div>
                                    </>
                                );
                            }
                        })()}
                    </div>
                </section>
            </div>
        </div>
    );
}
