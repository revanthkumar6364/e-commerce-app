import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
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

export default function AddressModal({ onClose, onSelectAddress, selectedId }) {
    const [addresses] = useState(MOCK_ADDRESSES);
    const [tempSelected, setTempSelected] = useState(selectedId || 1);

    const handleSelect = (addr) => {
        setTempSelected(addr.id);
        onSelectAddress(addr);
        // In a real app we might wait for "Done" button, but Myntra style usually updates on selection or has a confirm.
        // The screenshot has "DELIVERING HERE" button for the selected card.
    };

    return (
        <div className="modal-overlay">
            <div className="address-modal">

                {/* HEADER */}
                <div className="am-header">
                    <h3>Select Delivery Address</h3>
                    <button onClick={onClose} className="btn-close-modal"><X size={20} /></button>
                </div>

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
                    <button className="btn-add-new">+ Add New Address</button>
                </div>

                {/* ADDRESS LIST */}
                <div className="am-list">
                    {addresses.map(addr => {
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

                                {isSelected && (
                                    <button className="btn-delete-address">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
