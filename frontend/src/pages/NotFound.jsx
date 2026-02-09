import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
        }}>
            <h1 style={{
                fontSize: '120px',
                fontWeight: '900',
                margin: '0',
                color: '#1a1a1a',
                lineHeight: '1',
                letterSpacing: '-5px'
            }}>404</h1>

            <h2 style={{
                fontSize: '2rem',
                margin: '10px 0 20px',
                color: '#333',
                fontWeight: '300'
            }}>Page Not Found</h2>

            <p style={{
                maxWidth: '500px',
                color: '#666',
                marginBottom: '40px',
                fontSize: '1.1rem'
            }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#000',
                    color: '#fff',
                    padding: '12px 30px',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'transform 0.2s'
                }}>
                    <Home size={18} />
                    Go Home
                </Link>

                <button onClick={() => window.history.back()} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'transparent',
                    border: '2px solid #000',
                    color: '#000',
                    padding: '12px 30px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                }}>
                    <ArrowLeft size={18} />
                    Go Back
                </button>
            </div>
        </div>
    );
}
