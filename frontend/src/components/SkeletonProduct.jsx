import '../pages/products-myntra.css';

export default function SkeletonProduct() {
    return (
        <div className="product-card-myntra skeleton-card">
            <div className="product-card-image-myntra skeleton-box"></div>
            <div className="product-card-details-myntra">
                <div className="skeleton-text skeleton-brand"></div>
                <div className="skeleton-text skeleton-title"></div>
                <div className="skeleton-text skeleton-price"></div>
            </div>
        </div>
    );
}
