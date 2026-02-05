import { useState, useContext, useEffect } from 'react';
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

  // Filter State
  const [filters, setFilters] = useState({
    brands: [],
    categories: [],
    priceRange: null,
    colors: [],
    discount: null,
    sizes: []
  });

  const [sortBy, setSortBy] = useState('recommended');
  const [wishlistIds, setWishlistIds] = useState([]);

  // Initialize filters from URL
  useEffect(() => {
    const brandsParam = searchParams.get('brands');
    const colorsParam = searchParams.get('colors');
    const discountParam = searchParams.get('discount');

    setFilters(prev => ({
      ...prev,
      brands: brandsParam ? brandsParam.split(',') : [],
      colors: colorsParam ? colorsParam.split(',') : [],
      discount: discountParam ? parseInt(discountParam) : null
    }));

    // Load wishlist
    try {
      const cur = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistIds(cur.map(i => i.id));
    } catch (e) {
      setWishlistIds([]);
    }
  }, [searchParams]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };

      if (filterType === 'brands' || filterType === 'colors' || filterType === 'sizes' || filterType === 'categories') {
        const arr = newFilters[filterType] || [];
        if (arr.includes(value)) {
          newFilters[filterType] = arr.filter(v => v !== value);
        } else {
          newFilters[filterType] = [...arr, value];
        }
      } else if (filterType === 'priceRange' || filterType === 'discount') {
        newFilters[filterType] = value;
      }

      // Update URL
      updateURL(newFilters);
      return newFilters;
    });
  };

  const updateURL = (newFilters) => {
    const params = new URLSearchParams(searchParams);

    if (newFilters.brands.length > 0) {
      params.set('brands', newFilters.brands.join(','));
    } else {
      params.delete('brands');
    }

    if (newFilters.categories.length > 0) {
      params.set('types', newFilters.categories.join(','));
    } else {
      params.delete('types');
    }

    if (newFilters.colors.length > 0) {
      params.set('colors', newFilters.colors.join(','));
    } else {
      params.delete('colors');
    }

    if (newFilters.discount) {
      params.set('discount', newFilters.discount);
    } else {
      params.delete('discount');
    }

    setSearchParams(params);
  };

  const handleClearAll = () => {
    setFilters({
      brands: [],
      priceRange: null,
      colors: [],
      discount: null,
      sizes: []
    });
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
    } catch (e) {
      console.error(e);
    }
  };

  // Apply Filters
  let filtered = [...products];

  // Category/Department filter from URL
  const category = searchParams.get('category');
  const subCategory = searchParams.get('sub');
  const type = searchParams.get('type');

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  if (subCategory) {
    filtered = filtered.filter(p => p.subCategory === subCategory);
  }
  if (type) {
    filtered = filtered.filter(p => p.type === type);
  }

  // Brand filter
  if (filters.brands.length > 0) {
    filtered = filtered.filter(p => filters.brands.includes(p.brand));
  }

  // Category/Type filter
  if (filters.categories.length > 0) {
    filtered = filtered.filter(p => filters.categories.includes(p.type));
  }

  // Color filter
  if (filters.colors.length > 0) {
    filtered = filtered.filter(p => p.color && filters.colors.includes(p.color));
  }

  // Price range filter
  if (filters.priceRange) {
    filtered = filtered.filter(p =>
      p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
    );
  }

  // Discount filter
  if (filters.discount) {
    filtered = filtered.filter(p => {
      const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
      return discount >= filters.discount;
    });
  }

  // Size filter
  if (filters.sizes.length > 0) {
    filtered = filtered.filter(p =>
      p.sizes && p.sizes.some(s => filters.sizes.includes(s))
    );
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

  // Build breadcrumbs
  const breadcrumbs = [];
  if (subCategory) {
    breadcrumbs.push({ label: subCategory });
  }
  if (type) {
    breadcrumbs.push({ label: type });
  }

  return (
    <div className="products-page-myntra">
      <div className="products-container-myntra">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
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
              <h1>{type || subCategory || 'Products'}</h1>
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
              const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
              const isWishlisted = wishlistIds.includes(product.id);

              return (
                <Link
                  to={`/products/${product.id}`}
                  key={product.id}
                  className="product-card-myntra"
                >
                  <div className="product-card-image-myntra">
                    <img src={product.image} alt={product.title} />
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
                      <span className="price-discount">({discount}% OFF)</span>
                    </div>
                    {product.rating && (
                      <div className="product-rating-myntra">
                        <span className="rating-value">{product.rating} <Star size={12} fill="#ffa500" stroke="none" /></span>
                        <span className="rating-count">| {Math.floor(Math.random() * 5000)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="no-products-myntra">
              <h2>No products found</h2>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
