import { Link } from 'react-router-dom';
import './navbar.css'; // Utilizing shared styles or specific if needed

// We generally rely on Navbar to position this absolute container
export default function MegaMenu({ data, onClose }) {
    if (!data) return null;

    return (
        <div className="mega-menu-container" onMouseLeave={onClose}>
            <div className="mega-menu-content">
                {data.map((column, idx) => (
                    <div key={idx} className="mega-menu-column">
                        {column.link ? (
                            <Link to={column.link} className="mega-menu-heading-link" onClick={onClose}>
                                <h4 className="mega-menu-heading">{column.heading}</h4>
                            </Link>
                        ) : (
                            <h4 className="mega-menu-heading">{column.heading}</h4>
                        )}
                        <ul className="mega-menu-list">
                            {column.items.map((item, i) => (
                                <li key={i}>
                                    <Link to={item.link} className="mega-menu-link" onClick={onClose}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
