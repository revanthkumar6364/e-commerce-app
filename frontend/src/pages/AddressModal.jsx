import { useState, useEffect } from 'react';
import { X, Trash2, ArrowLeft, MapPin, Navigation } from 'lucide-react';
import './cart.css'; // Using shared cart styles

const MOCK_ADDRESSES = [
    {
        id: 1,
        name: 'Revanth Kumar',
        type: 'HOME',
        isDefault: true,
        address: '#75/15, 7th Cross, Maruthi Extension, Gayatri Nagar, Bangalore 560021, Gayathri Nagar',
        city: 'Bengaluru',
        state: 'Karnataka - 560021',
        mobile: '6364299518'
    },
    {
        id: 2,
        name: 'Aanad',
        type: 'HOME',
        isDefault: false,
        address: '53rd BN ITBP camp VILL - PALAM ...',
        city: 'Delhi',
        state: 'Delhi - 110010',
        mobile: '9876543210'
    }
];

// Mock data for pincode suggestions
const PINCODE_DATA = {
    '560021': { city: 'Bengaluru', state: 'Karnataka', area: 'Gayatri Nagar' },
    '110010': { city: 'Delhi', state: 'Delhi', area: 'Palam' },
    '400001': { city: 'Mumbai', state: 'Maharashtra', area: 'Fort' },
    '600001': { city: 'Chennai', state: 'Tamil Nadu', area: 'Parrys' }
};

export default function AddressModal({ onClose, onSelectAddress, selectedId }) {
    const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
    const [tempSelected, setTempSelected] = useState(selectedId || 1);
    const [view, setView] = useState('list'); // 'list', 'form', or 'map'
    const [pincodeSuggestions, setPincodeSuggestions] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        pincode: '',
        address: '',
        city: '',
        state: '',
        type: 'HOME'
    });

    // Pincode lookup logic
    useEffect(() => {
        if (formData.pincode.length >= 3) {
            const matches = Object.keys(PINCODE_DATA).filter(p => p.startsWith(formData.pincode));
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPincodeSuggestions(matches);

            // Auto-fill if exact match
            if (PINCODE_DATA[formData.pincode]) {
                const data = PINCODE_DATA[formData.pincode];
                setFormData(prev => ({ ...prev, city: data.city, state: data.state }));
                setPincodeSuggestions([]);
            }
        } else {
            setPincodeSuggestions([]);
        }
    }, [formData.pincode]);

    const handleSelectPincode = (p) => {
        const data = PINCODE_DATA[p];
        setFormData(prev => ({ ...prev, pincode: p, city: data.city, state: data.state }));
        setPincodeSuggestions([]);
    };

    const handleUseLiveLocation = () => {
        setView('map'); // Switch to map-like view

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Mock reverse geocoding
                    setTimeout(() => {
                        setFormData(prev => ({
                            ...prev,
                            address: '📍 Current Location: ' + position.coords.latitude.toFixed(4) + ', ' + position.coords.longitude.toFixed(4),
                            city: 'Current City',
                            state: 'Current State',
                            pincode: '560001' // Mock default
                        }));
                        setView('form'); // Auto-switch back to form
                        alert('Location captured successfully!');
                    }, 1500);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setView('form');
                    alert('Could not access current location. Please enter manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
            setView('form');
        }
    };

    const handleSelect = (addr) => {
        setTempSelected(addr.id);
        onSelectAddress(addr);
    };

    const handleAddNew = () => {
        setFormData({
            name: '',
            mobile: '',
            pincode: '',
            address: '',
            city: '',
            state: '',
            type: 'HOME'
        });
        setView('form');
    };

    const handleSaveAddress = (e) => {
        e.preventDefault();
        const newAddr = {
            ...formData,
            id: Date.now(),
            isDefault: addresses.length === 0
        };
        setAddresses([newAddr, ...addresses]);
        setView('list');
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        setAddresses(addresses.filter(a => a.id !== id));
        if (tempSelected === id && addresses.length > 1) {
            setTempSelected(addresses.find(a => a.id !== id).id);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="address-modal">

                {/* HEADER */}
                <div className="am-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {(view === 'form' || view === 'map') && <ArrowLeft size={20} cursor="pointer" onClick={() => setView('list')} />}
                        <h3>
                            {view === 'list' && 'Select Delivery Address'}
                            {view === 'form' && 'Add New Address'}
                            {view === 'map' && 'Fetching Live Location...'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="btn-close-modal"><X size={20} /></button>
                </div>

                {view === 'list' && (
                    <>
                        {/* PIN CODE CHECK */}
                        <div className="am-pincode-section">
                            <div className="pincode-input-wrapper">
                                <input type="text" placeholder="Enter Pincode" />
                                <button className="btn-check-pincode">CHECK</button>
                            </div>
                        </div>

                        {/* SAVED ADDRESSES TITLE */}
                        <div className="am-saved-title">
                            <span>SAVED ADDRESS</span>
                            <button className="btn-add-new" onClick={handleAddNew}>+ Add New Address</button>
                        </div>

                        {/* ADDRESS LIST */}
                        <div className="am-list">
                            {addresses.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#94969f' }}>
                                    No addresses saved. Add one to continue.
                                </div>
                            ) : (
                                addresses.map(addr => {
                                    const isSelected = tempSelected === addr.id;
                                    return (
                                        <div key={addr.id} className={`am-card ${isSelected ? 'selected' : ''}`} onClick={() => handleSelect(addr)}>
                                            <div className="am-card-header">
                                                <div className="am-radio-wrapper">
                                                    <div className={`custom-radio ${isSelected ? 'checked' : ''}`}></div>
                                                    <span className="am-name">{addr.name} {addr.isDefault && <span className="default-tag">(Default)</span>}</span>
                                                </div>
                                                <span className="am-type-tag">{addr.type}</span>
                                            </div>

                                            <div className="am-details">
                                                <p>{addr.address}</p>
                                                <p>{addr.city}</p>
                                                <p>{addr.state}</p>
                                                <p className="am-mobile">Mobile: <strong>{addr.mobile}</strong></p>
                                            </div>

                                            {isSelected && (
                                                <div className="am-actions">
                                                    <button className="btn-delivering-here" onClick={onClose}>DELIVERING HERE</button>
                                                    <button className="btn-edit-address">EDIT</button>
                                                </div>
                                            )}

                                            <button className="btn-delete-address" onClick={(e) => handleDelete(e, addr.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                )}

                {view === 'form' && (
                    <form className="am-form" onSubmit={handleSaveAddress}>
                        <div className="form-scroll-area">
                            <button type="button" className="btn-live-location" onClick={handleUseLiveLocation}>
                                <Navigation size={16} /> Use Live Location
                            </button>

                            <div className="input-group">
                                <label>CONTACT DETAILS</label>
                                <input
                                    type="text"
                                    placeholder="Name*"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Mobile No*"
                                    required
                                    value={formData.mobile}
                                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>ADDRESS</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        placeholder="Pincode*"
                                        required
                                        value={formData.pincode}
                                        onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                                    />
                                    {pincodeSuggestions.length > 0 && (
                                        <div className="pincode-suggestions">
                                            {pincodeSuggestions.map(p => (
                                                <div key={p} className="suggestion-item" onClick={() => handleSelectPincode(p)}>
                                                    <strong>{p}</strong> - {PINCODE_DATA[p].area}, {PINCODE_DATA[p].city}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Address (House No, Building, Street, Area)*"
                                    required
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="City/District*"
                                        required
                                        style={{ flex: 1 }}
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="State*"
                                        required
                                        style={{ flex: 1 }}
                                        value={formData.state}
                                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>SAVE ADDRESS AS</label>
                                <div className="type-toggle">
                                    <button
                                        type="button"
                                        className={formData.type === 'HOME' ? 'active' : ''}
                                        onClick={() => setFormData({ ...formData, type: 'HOME' })}
                                    >Home</button>
                                    <button
                                        type="button"
                                        className={formData.type === 'WORK' ? 'active' : ''}
                                        onClick={() => setFormData({ ...formData, type: 'WORK' })}
                                    >Work</button>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-add-address-submit">ADD ADDRESS</button>
                    </form>
                )}

                {view === 'map' && (
                    <div className="map-view">
                        <div className="map-placeholder">
                            <div className="map-pulse">
                                <MapPin size={48} color="#ff3f6c" />
                            </div>
                            <p>Detecting your live location...</p>
                            <span style={{ fontSize: '12px', color: '#94969f' }}>Please allow browser location access</span>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
