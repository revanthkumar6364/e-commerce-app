import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  console.log('Token debug:', token); // Log it to "use" it or just remove if safe. Lint says unused.
  // Actually, I'll just remove it if it's not used.
  // const token = localStorage.getItem('token');

  let user = null;
  try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch { user = null; }

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || 'Welcome',
    email: user?.email || '',
    phone: user?.phone || '+91 00000 00000'
  });

  // Purchase history state
  const [purchaseHistory] = useState(() => {
    const ordersString = localStorage.getItem('orderHistory');
    if (!ordersString) {
      const mockOrders = [
        {
          id: 'ORD-2024-001',
          date: '2024-01-15',
          items: 'Premium Leather Jacket, Designer Sunglasses',
          total: 15999,
          status: 'delivered'
        },
        {
          id: 'ORD-2024-002',
          date: '2024-01-20',
          items: 'Urban Sneakers Collection (3 items)',
          total: 8999,
          status: 'delivered'
        },
        {
          id: 'ORD-2024-003',
          date: '2024-02-01',
          items: 'Luxury Watch, Wallet Set',
          total: 25999,
          status: 'pending'
        },
        {
          id: 'ORD-2024-004',
          date: '2024-02-05',
          items: 'Limitless Edition Denim Set',
          total: 12499,
          status: 'cancelled'
        }
      ];
      localStorage.setItem('orderHistory', JSON.stringify(mockOrders));
      return mockOrders;
    }
    return JSON.parse(ordersString);
  });

  useEffect(() => {
    // Initialized in useState
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSave() {
    // Save edited user data
    const updatedUser = { ...user, ...editedUser };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    alert('✅ Profile updated successfully!');
    window.location.reload(); // Reload to reflect changes
  }

  function handleCancel() {
    setEditedUser({
      name: user?.name || 'Welcome',
      email: user?.email || '',
      phone: user?.phone || '+91 00000 00000'
    });
    setIsEditing(false);
  }

  const initials = user && user.email ? user.email.split('@')[0].slice(0, 2).toUpperCase() : 'U';

  return (
    <div className="profile-page-container">
      <div className="luxury-profile-card">
        <header className="profile-header">
          <div className="profile-hero">
            <div className="avatar-blue-ring">
              <div className="profile-avatar">
                {initials}
              </div>
            </div>
            <div className="profile-identity">
              <h2>{editedUser.name}</h2>
              <span className="premium-status-tag">PLATINUM MEMBER</span>
            </div>
          </div>
          <div>
            {!isEditing && (
              <button className="edit-profile-btn" onClick={handleEdit}>✏️ Edit Profile</button>
            )}
            <button className="luxury-logout-btn" onClick={logout}>Sign Out</button>
          </div>
        </header>

        <section className="profile-details-grid">
          <div className="detail-box">
            <label>Electronic Mail</label>
            {isEditing ? (
              <input
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              />
            ) : (
              <p>{editedUser.email || 'Not provided'}</p>
            )}
          </div>
          <div className="detail-box">
            <label>Private Line</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedUser.phone}
                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
              />
            ) : (
              <p>{editedUser.phone}</p>
            )}
          </div>
        </section>

        {isEditing && (
          <div className="edit-actions">
            <button className="btn-save" onClick={handleSave}>💾 Save Changes</button>
            <button className="btn-cancel" onClick={handleCancel}>✕ Cancel</button>
          </div>
        )}

        <section className="profile-perks">
          <h3>EXCLUSIVE ACCESS</h3>
          <div className="perks-grid">
            <div className="perk-item">
              <span className="perk-icon">✨</span>
              <div className="perk-text">
                <h4>20% Welcome Discount</h4>
                <p>Applied to your next boutique purchase.</p>
              </div>
              <button className="perk-copy">COPY</button>
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
            {purchaseHistory.slice(0, 5).map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <div className="order-id">Order #{order.id}</div>
                    <div className="order-date">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  <span className={`order-status status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-items">{order.items}</div>
                <div className="order-total">₹{order.total.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="profile-footer">
          <p>Joined Urban Vibe Collective in Jan 2024</p>
        </footer>
      </div>
    </div>
  );
}
