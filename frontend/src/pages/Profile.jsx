import { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Package, Clock, ShieldCheck, CheckCircle, ChevronRight, X, Smartphone, Mail, Copy, Check, ShoppingBag, RotateCcw } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import AddressModal from './AddressModal';
import './profile.css';

export default function Profile({ user, logout }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Rewards & Identity State
  const { addItem } = useContext(CartContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isExchanging, setIsExchanging] = useState(false);

  const [copiedId, setCopiedId] = useState(null);

  const [wallet, setWallet] = useState({
    walletCoins: 0,
    tier: 'SILVER',
    coupons: 0
  });

  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&h=200&auto=format&fit=crop'
  });

  const [currentAddress, setCurrentAddress] = useState({
    title: 'Primary Residence',
    street: '12 Luxury Lane, Beverly Hills',
    city: 'Los Angeles, CA 90210'
  });

  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/user/wallet', {
        headers: { 'user-id': '65c1a2b3e4b0c1a2b3e4b0c1' }
      });
      const data = await response.json();
      if (data.success) {
        setWallet({
          walletCoins: data.walletCoins,
          tier: data.tier,
          coupons: (data.coupons || []).filter(c => !c.isUsed).length
        });
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };



  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/user/orders', {
        headers: { 'user-id': '65c1a2b3e4b0c1a2b3e4b0c1' }
      });
      const data = await response.json();
      if (data.success) {
        setPurchaseHistory(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      profileImage: user?.profileImage || editedUser.profileImage
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': '65c1a2b3e4b0c1a2b3e4b0c1'
        },
        body: JSON.stringify(editedUser)
      });
      const data = await response.json();
      if (data.success) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditedUser({ ...editedUser, profileImage: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const exchangeCoins = async (type) => {
    if (isExchanging) return;
    setIsExchanging(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/user/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': '65c1a2b3e4b0c1a2b3e4b0c1'
        },
        body: JSON.stringify({ rewardType: type })
      });
      const data = await response.json();
      if (data.success) {
        alert(`✨ SUCCESS! ${data.message}`);
        fetchUserData();
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Exchange error:', error);
    } finally {
      setIsExchanging(false);
    }
  };

  const handleReorder = (order) => {
    order.items.forEach(item => {
      addItem(item);
    });
    alert('🛒 Items from this order added to your bag!');
    navigate('/cart');
  };

  const copyOrderId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="profile-page-container">
      <div className="luxury-profile-card">
        <header className="profile-header">
          <div className="profile-header-left">
            <div className="avatar-container">
              <div className="profile-avatar">
                <img src={editedUser.profileImage} alt="User Avatar" className="profile-avatar-img" />
              </div>
              <div className="avatar-edit-overlay" onClick={() => fileInputRef.current.click()}>📷</div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*" />
            </div>
            <div className="profile-identity">
              <h2>{editedUser.name || 'Welcome'}</h2>
              <span className="premium-status-tag">{wallet.tier} MEMBER</span>
            </div>
          </div>
          <div>
            {!isEditing && <button className="edit-profile-btn" onClick={handleEdit}>✏️ Edit Profile</button>}
            <button className="luxury-logout-btn" onClick={logout}>Sign Out</button>
          </div>
        </header>

        <section className="wallet-dashboard">
          <div className="wallet-info">
            <h4>Aura Wallet</h4>
            <div className="coin-balance">
              <span className="coin-icon">🌕</span>
              {wallet.walletCoins.toLocaleString()} Coins
            </div>
          </div>
          <div className="tier-badge-large">
            <span>Current Status</span>
            <strong>{wallet.tier}</strong>
          </div>
        </section>

        <section className="quick-actions-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <div className="action-tile" onClick={() => navigate('/orders')}>
              <div className="action-icon">📦</div>
              <span>Track Order</span>
            </div>
            <div className="action-tile">
              <div className="action-icon">🔄</div>
              <span>Returns</span>
            </div>
            <div className="action-tile">
              <div className="action-icon">🎧</div>
              <span>Help Center</span>
            </div>
            <div className="action-tile">
              <div className="action-icon">🛡️</div>
              <span>Privacy</span>
            </div>
          </div>
        </section>

        <section className="profile-details-grid">
          <div className="detail-box">
            <label>Full Name</label>
            {isEditing ? <input type="text" value={editedUser.name} onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })} /> : <p>{editedUser.name || 'Not provided'}</p>}
          </div>
          <div className="detail-box">
            <label>Email ID</label>
            {isEditing ? <input type="email" value={editedUser.email} onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })} /> : <p>{editedUser.email || 'Not provided'}</p>}
          </div>
          <div className="detail-box">
            <label>Mobile Number</label>
            {isEditing ? <input type="tel" value={editedUser.phone} onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })} /> : <p>{editedUser.phone || 'Not provided'}</p>}
          </div>
          <div className="detail-box">
            <label>Tier Status</label>
            <p style={{ color: '#ff3f6c', fontWeight: 'bold' }}>{wallet.tier}</p>
          </div>
        </section>

        {isEditing && (
          <div className="edit-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button className="btn-save" onClick={handleSave}>💾 Save Changes</button>
            <button className="btn-cancel" onClick={handleCancel}>✕ Cancel</button>
          </div>
        )}

        <div className="advanced-grid">
          <section className="advanced-section">
            <h3>Default Address</h3>
            <div className="address-preview">
              <div className="address-text">
                <p><strong>{currentAddress.title}</strong></p>
                <p>{currentAddress.street}</p>
                <p>{currentAddress.city}</p>
              </div>
              <button className="btn-link" onClick={() => setShowAddressModal(true)}>Edit</button>
            </div>
          </section>
          <section className="advanced-section">
            <h3>Account Security</h3>
            <div className="security-list">
              <div className="security-item">
                <span className="security-label">Two-Factor Auth</span>
                <span className="security-status verified">Active</span>
              </div>
            </div>
          </section>
        </div>

        <section className="profile-perks">
          <h3>EXCLUSIVE REWARDS</h3>
          <div className="perks-grid">
            <div className="perk-item exchangeable">
              <span className="perk-icon">🎟️</span>
              <div className="perk-text">
                <h4>₹500 OFF COUPON</h4>
                <p>Redeem 1000 Aura Coins</p>
              </div>
              <button
                className={`perk-copy ${wallet.walletCoins < 1000 ? 'disabled' : ''}`}
                onClick={() => exchangeCoins('COUPON_25')}
                disabled={wallet.walletCoins < 1000 || isExchanging}
              >
                {isExchanging ? '...' : 'REDEEM'}
              </button>
            </div>
            <div className="perk-item">
              <span className="perk-icon">🚚</span>
              <div className="perk-text">
                <h4>Priority Logistics</h4>
                <p>Free express delivery on all luxury items.</p>
              </div>
              <span className="perk-active">ACTIVE</span>
            </div>
          </div>
        </section>

        <section className="purchase-history">
          <h3>📦 PURCHASE HISTORY</h3>
          <div className="orders-grid">
            {purchaseHistory.length === 0 ? (
              <div className="no-orders" style={{ textAlign: 'center', padding: '40px', color: '#94969f' }}>No orders yet. Start shopping!</div>
            ) : (
              purchaseHistory.map((order) => (
                <div key={order._id || order.id} className="order-card" onClick={() => setSelectedOrder(order)}>
                  <div className="order-header">
                    <div className="order-meta">
                      <div className="order-id-row">
                        <span className="order-id-text">Order ID: #{order.orderId || order.id}</span>
                        <button className="copy-btn-mini" onClick={(e) => copyOrderId(order.orderId || order.id, e)}>
                          {copiedId === (order.orderId || order.id) ? <Check size={12} color="#20bd99" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="order-date">{new Date(order.date || order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className={`order-status status-${(order.status || 'pending').toLowerCase()}`}>
                      {order.status === 'Confirmed' ? '✅ Confirmed' : order.status}
                    </span>
                  </div>
                  <div className="order-body">
                    <div className="order-items-preview">
                      <div className="item-count">{order.items.length} Items</div>
                      <div className="item-titles">{order.items.slice(0, 2).map(i => i.title).join(', ')}{order.items.length > 2 && '...'}</div>
                    </div>
                    <div className="order-actions-right">
                      <div className="order-total-mini">₹{order.total.toLocaleString()}</div>
                      <div className="btn-group-mini">
                        <button className="btn-track-mini">TRACK ORDER <ChevronRight size={14} /></button>
                        <button className="btn-reorder-mini" onClick={(e) => { e.stopPropagation(); handleReorder(order); }}>
                          <RotateCcw size={12} /> BUY AGAIN
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {selectedOrder && (
          <div className="modal-overlay" style={{ zIndex: 4000 }}>
            <div className="address-modal tracking-modal-content" style={{ width: '500px', padding: '0' }}>
              <div className="modal-header" style={{ padding: '20px', borderBottom: '1px solid #f5f5f6' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
                  <Truck size={24} color="#ff3f6c" /> Track Order #{selectedOrder.orderId}
                </h2>
                <button onClick={() => setSelectedOrder(null)} className="btn-close-modal" style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <div className="tracking-body" style={{ padding: '20px' }}>
                <div className="tracking-stepper">
                  <div className="t-step completed">
                    <CheckCircle size={20} className="step-point" />
                    <div className="step-text"><strong>Order Confirmed</strong><p>{new Date(selectedOrder.date || selectedOrder.createdAt).toLocaleString()}</p></div>
                  </div>
                  <div className="t-step active"><Package size={20} className="step-point" /><div className="step-text"><strong>Processing</strong><p>Hand-picked for you</p></div></div>
                  <div className="t-step"><Truck size={20} className="step-point" /><div className="step-text"><strong>Shipped</strong><p>In transit</p></div></div>
                  <div className="t-step"><Clock size={20} className="step-point" /><div className="step-text"><strong>Delivered</strong><p>Success</p></div></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="profile-footer"><p>Joined Urban Vibe Collective in Jan 2024</p></footer>
      </div>

      {showAddressModal && (
        <AddressModal
          onClose={() => setShowAddressModal(false)}
          onSelectAddress={(addr) => {
            setCurrentAddress({
              title: addr.type + ' Address',
              street: addr.address,
              city: addr.city + ', ' + addr.state.split('-')[1]?.trim()
            });
            setShowAddressModal(false);
          }}
        />
      )}
    </div>
  );
}
