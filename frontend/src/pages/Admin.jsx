import { useState, useEffect } from 'react';
import './admin.css';

export default function Admin() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:5000/admin/stats');
                const data = await res.json();
                if (data.success) setStats(data.stats);
            } catch (err) {
                console.error('Stats error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="admin-loading">Loading Command Center...</div>;

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>RK ADMINISTRATIVE COMMAND</h1>
                <p>System Overview & Intelligence</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">TOTAL REVENUE</span>
                    <span className="stat-value">₹{stats?.revenue.toLocaleString()}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">TOTAL ORDERS</span>
                    <span className="stat-value">{stats?.totalOrders}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">TOTAL USERS</span>
                    <span className="stat-value">{stats?.totalUsers}</span>
                </div>
                <div className="stat-card warning">
                    <span className="stat-label">PENDING RETURNS</span>
                    <span className="stat-value">{stats?.pendingReturns}</span>
                </div>
            </div>

            <section className="admin-section">
                <h2>RECENT COMMUNICATIONS</h2>
                <div className="contacts-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>CLIENT</th>
                                <th>SUBJECT</th>
                                <th>DATE</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recentContacts.map(c => (
                                <tr key={c._id}>
                                    <td>{c.name}</td>
                                    <td>{c.subject}</td>
                                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td><span className={`status-pill ${c.status}`}>{c.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
