import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './breadcrumbs.css';

export default function Breadcrumbs({ items }) {
    return (
        <nav className="breadcrumbs">
            <Link to="/" className="breadcrumb-item">Home</Link>
            {items.map((item, index) => (
                <span key={index} className="breadcrumb-segment">
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    {item.link ? (
                        <Link to={item.link} className="breadcrumb-item">{item.label}</Link>
                    ) : (
                        <span className="breadcrumb-item active">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
