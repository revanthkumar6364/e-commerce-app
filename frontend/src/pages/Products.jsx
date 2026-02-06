import { useState, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { CartContext } from '../context/CartContext';
import FilterSidebar from '../components/FilterSidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import { Heart, Star } from 'lucide-react';
import './products-myntra.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useContext(CartContext);
  const navigate = useNavigate();

  // Derived filters from searchParams
  const brands = searchParams.get('brands') ? searchParams.get('brands').split(',') : [];
  const colors = searchParams.get('colors') ? searchParams.get('colors').split(',') : [];
  const discountThreshold = searchParams.get('discount') ? parseInt(searchParams.get('discount')) : null;

  const [sortBy, setSortBy] = useState('recommended');
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const cur = JSON.parse(localStorage.getItem('wishlist') || '[]');
      return cur.map(i => i.id);
    } catch {
      return [];
    }
  });

  const handleFilterChange = (filterType, value) => {
    const params = new URLSearchParams(searchParams);

    if (filterType === 'brands' || filterType === 'colors') {
      const currentArr = params.get(filterType) ? params.get(filterType).split(',') : [];
      let newValues;
      if (currentArr.includes(value)) {
        newValues = currentArr.filter(v => v !== value);
      } else {
        newValues = [...currentArr, value];
      }

      if (newValues.length > 0) {
        params.set(filterType, newValues.join(','));
      } else {
        params.delete(filterType);
      }
    } else if (filterType === 'discount') {
      params.set('discount', value);
    }

    setSearchParams(params);
  };

  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('brands');
    params.delete('colors');
    params.delete('discount');
    setSearchParams(params);
  };

  const checkLogin = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    if (!checkLogin()) return;
    addItem(product);
    alert(`✅ Added ${product.title} to cart`);
  };

  const handleWishlist = (product, e) => {
    e.preventDefault();
    if (!checkLogin()) return;

    try {
      const cur = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const exists = cur.some(i => i.id === product.id);

      if (exists) {
        const updated = cur.filter(i => i.id !== product.id);
        localStorage.setItem('wishlist', JSON.stringify(updated));
        setWishlistIds(updated.map(i => i.id));
      } else {
        const updated = [...cur, product];
        localStorage.setItem('wishlist', JSON.stringify(updated));
        setWishlistIds(updated.map(i => i.id));
      }
    } catch {
      console.error('Wishlist error');
    }
  };

  // Category/Department filter from URL
  const category = searchParams.get('category');
  const subCategory = searchParams.get('sub');
  const typeParam = searchParams.get('type');
  const types = typeParam ? typeParam.split(',') : [];
  const customTitle = searchParams.get('title');

  // Apply Filters
  let filtered = [...products];

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  if (subCategory) {
    filtered = filtered.filter(p => p.subCategory === subCategory);
  }
  if (types.length > 0) {
    filtered = filtered.filter(p => types.includes(p.type));
  }

  // Brand filter
  if (brands.length > 0) {
    filtered = filtered.filter(p => brands.includes(p.brand));
  }

  // Color filter
  if (colors.length > 0) {
    filtered = filtered.filter(p => p.color && colors.includes(p.color));
  }

  // Discount filter
  if (discountThreshold) {
    filtered = filtered.filter(p => {
      const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
      return discount >= discountThreshold;
    });
  }

  // Sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'new') return b.id - a.id;
    if (sortBy === 'discount') {
      const discA = ((a.mrp - a.price) / a.mrp) * 100;
      const discB = ((b.mrp - b.price) / b.mrp) * 100;
      return discB - discA;
    }
    return 0; // recommended
  });

  const [ratingCounts] = useState(() => {
    const counts = {};
    products.forEach(p => {
      counts[p.id] = Math.floor(Math.random() * 5000);
    });
    return counts;
  });

  // Build breadcrumbs
  const breadcrumbs = [];
  if (subCategory) {
    breadcrumbs.push({ label: subCategory });
  }
  if (typeParam) {
    breadcrumbs.push({ label: typeParam });
  }

  return (
    <div className="products-page-myntra">
      <div className="products-container-myntra">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={{ brands, colors, discount: discountThreshold, categories: [], sizes: [] }}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          department={subCategory || 'Men'}
        />

        {/* Main Content */}
        <div className="products-main-myntra">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

          {/* Header with count & sort */}
          <div className="products-header-myntra">
            <div className="products-title-myntra">
              <h1>{customTitle || typeParam || subCategory || (brands.length > 0 ? `${brands.join(', ')} Collection` : 'Products')}</h1>
              <span className="products-count">({filtered.length} items)</span>
            </div>
            <div className="products-sort-myntra">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="new">What's New</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Better Discount</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-grid-myntra">
            {filtered.map(product => {
              const isWishlisted = wishlistIds.includes(product.id);
              return (
                <div key={product.id} className="product-card-myntra">
                  <Link to={`/products/${product.id}`} className="product-card-link-myntra">
                    <div className="product-card-image-myntra">
                      <img src={product.image} alt={product.title} />
                      {ratingCounts[product.id] > 3000 && (
                        <div className="top-sales-badge">TOP SALES</div>
                      )}
                      <button
                        className={`wishlist-btn-myntra ${isWishlisted ? 'active' : ''}`}
                        onClick={(e) => handleWishlist(product, e)}
                      >
                        <Heart size={18} fill={isWishlisted ? '#ff3f6c' : 'none'} />
                      </button>
                      <button
                        className="quick-add-myntra"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        ADD TO BAG
                      </button>
                    </div>
                    <div className="product-card-details-myntra">
                      <h3 className="product-brand-myntra">{product.brand}</h3>
                      <p className="product-title-myntra">{product.title}</p>
                      <div className="product-price-myntra">
                        <span className="price-final">₹{product.price}</span>
                        <span className="price-mrp">₹{product.mrp}</span>
                        <span className="price-discount">
                          ({Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF)
                        </span>
                      </div>
                      <div className="product-rating-myntra">
                        <span className="rating-num">4.2</span>
                        <Star size={12} fill="#ff3f6c" stroke="#ff3f6c" />
                        <span className="rating-separator">|</span>
                        <span className="rating-count">{ratingCounts[product.id]}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
