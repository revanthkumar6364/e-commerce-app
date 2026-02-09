import { useState } from 'react';
import { X } from 'lucide-react';
import './filter-sidebar.css';

export default function FilterSidebar({ filters, onFilterChange, onClearAll, department = 'Men' }) {
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        brand: true,
        price: true,
        color: true,
        discount: true,
        size: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleFilterToggle = (filterType, value) => {
        onFilterChange(filterType, value);
    };

    // Department-specific categories
    const getCategoriesForDepartment = () => {
        switch (department) {
            case 'Women':
                return [
                    { name: 'Kurtas', value: 'Kurtas', count: 50 },
                    { name: 'Sarees', value: 'Sarees', count: 50 },
                    { name: 'Party Wear', value: 'Party Wear', count: 50 },
                    { name: 'Dresses', value: 'Dresses', count: 20 },
                    { name: 'Tops', value: 'Tops', count: 30 }
                ];
            case 'Men':
                return [
                    { name: 'T-Shirts', value: 'T-Shirts', count: 50 },
                    { name: 'Shirts', value: 'Shirts', count: 25 },
                    { name: 'Jeans', value: 'Jeans', count: 20 },
                    { name: 'Trousers', value: 'Trousers', count: 15 }
                ];
            case 'Kids':
                return [
                    { name: 'Boys Clothing', value: 'Boys', count: 30 },
                    { name: 'Girls Clothing', value: 'Girls', count: 30 },
                    { name: 'Toys', value: 'Toys', count: 20 }
                ];
            case 'Home':
                return [
                    { name: 'Decor', value: 'Decor', count: 40 },
                    { name: 'Bedding', value: 'Bedding', count: 30 },
                    { name: 'Furniture', value: 'Furniture', count: 20 },
                    { name: 'Lighting', value: 'Lighting', count: 25 },
                    { name: 'Storage', value: 'Storage', count: 15 }
                ];
            case 'Beauty':
                return [
                    { name: 'Makeup', value: 'Makeup', count: 60 },
                    { name: 'Skincare', value: 'Skincare', count: 55 },
                    { name: 'Haircare', value: 'Haircare', count: 40 },
                    { name: 'Fragrance', value: 'Fragrance', count: 30 },
                    { name: 'Bath & Body', value: 'Bath & Body', count: 35 }
                ];
            case 'Skincare':
                return [
                    { name: 'Moisturizers', value: 'Moisturizers', count: 20 },
                    { name: 'Serums', value: 'Serums', count: 15 },
                    { name: 'Face Wash', value: 'Face Wash', count: 25 },
                    { name: 'Sunscreen', value: 'Sunscreen', count: 10 },
                    { name: 'Masks', value: 'Masks', count: 12 }
                ];
            case 'Makeup':
                return [
                    { name: 'Lipstick', value: 'Lipstick', count: 30 },
                    { name: 'Foundation', value: 'Foundation', count: 20 },
                    { name: 'Eyeliner', value: 'Eyeliner', count: 15 },
                    { name: 'Mascara', value: 'Mascara', count: 10 },
                    { name: 'Nail Polish', value: 'Nail Polish', count: 25 }
                ];
            case 'Haircare':
                return [
                    { name: 'Shampoo', value: 'Shampoo', count: 25 },
                    { name: 'Conditioner', value: 'Conditioner', count: 20 },
                    { name: 'Hair Oil', value: 'Hair Oil', count: 15 },
                    { name: 'Serums', value: 'Serums', count: 10 },
                    { name: 'Hair Color', value: 'Hair Color', count: 12 }
                ];
            case 'Fragrance':
                return [
                    { name: 'Men', value: 'Men', count: 40 },
                    { name: 'Women', value: 'Women', count: 45 },
                    { name: 'Kids', value: 'Kids', count: 10 },
                    { name: 'Unisex', value: 'Unisex', count: 30 }
                ];
            case 'BathBody':
                return [
                    { name: 'Body Wash', value: 'Body Wash', count: 20 },
                    { name: 'Body Scrub', value: 'Body Scrub', count: 15 },
                    { name: 'Body Lotion', value: 'Body Lotion', count: 25 },
                    { name: 'Soaps', value: 'Soaps', count: 30 }
                ];
            case 'Natural':
                return [
                    { name: 'Ayurvedic', value: 'Ayurvedic', count: 35 },
                    { name: 'Organic', value: 'Organic', count: 30 },
                    { name: 'Essential Oils', value: 'Essential Oils', count: 20 },
                    { name: 'Herbal', value: 'Herbal', count: 25 }
                ];
            default:
                return [];
        }
    };

    const categories = getCategoriesForDepartment();

    const priceRanges = [
        { label: 'Rs. 199 to Rs. 699', min: 199, max: 699 },
        { label: 'Rs. 699 to Rs. 1199', min: 699, max: 1199 },
        { label: 'Rs. 1199 to Rs. 1999', min: 1199, max: 1999 },
        { label: 'Rs. 1999 to Rs. 3999', min: 1999, max: 3999 },
        { label: 'Rs. 3999+', min: 3999, max: 999999 }
    ];

    const discountOptions = [
        { label: '10% and above', value: 10 },
        { label: '20% and above', value: 20 },
        { label: '30% and above', value: 30 },
        { label: '40% and above', value: 40 },
        { label: '50% and above', value: 50 }
    ];

    const colorOptions = [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Red', hex: '#FF0000' },
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Green', hex: '#008000' },
        { name: 'Pink', hex: '#FFC0CB' },
        { name: 'Grey', hex: '#808080' },
        { name: 'Orange', hex: '#FFA500' },
        { name: 'Yellow', hex: '#FFFF00' },
        { name: 'Navy', hex: '#000080' }
    ];

    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

    const hasActiveFilters = Object.values(filters).some(arr => arr && arr.length > 0);

    return (
        <aside className="filter-sidebar">
            <div className="filter-header">
                <h3>FILTERS</h3>
                {hasActiveFilters && (
                    <button className="clear-all-btn" onClick={onClearAll}>
                        CLEAR ALL
                    </button>
                )}
            </div>

            {/* Categories Filter */}
            <div className="filter-section">
                <div
                    className="filter-section-header"
                    onClick={() => toggleSection('categories')}
                >
                    <h4>CATEGORIES</h4>
                    <span className={`arrow ${expandedSections.categories ? 'up' : 'down'}`}>›</span>
                </div>
                {expandedSections.categories && (
                    <div className="filter-options">
                        {categories.map(cat => (
                            <label key={cat.value} className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.categories?.includes(cat.value)}
                                    onChange={() => handleFilterToggle('categories', cat.value)}
                                />
                                <span>{cat.name} <span className="count">({cat.count})</span></span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Brand Filter */}
            <div className="filter-section">
                <div
                    className="filter-section-header"
                    onClick={() => toggleSection('brand')}
                >
                    <h4>BRAND</h4>
                    <span className={`arrow ${expandedSections.brand ? 'up' : 'down'}`}>›</span>
                </div>
                {expandedSections.brand && (
                    <div className="filter-options">
                        <div className="filter-search">
                            <input type="text" placeholder="Search for brands" />
                        </div>
                        {(department === 'Home'
                            ? ['IKEA', 'Home Centre', 'H&M Home', 'Bombay Dyeing', 'Milton', 'Prestige', 'D\'Decor', 'Spaces']
                            : department === 'Fragrance'
                                ? ['Chanel', 'Dior', 'Versace', 'Gucci', 'Calvin Klein', 'Tom Ford', 'Jo Malone', 'Davidoff']
                                : ['Beauty', 'Skincare', 'Makeup', 'Haircare', 'BathBody', 'Natural'].includes(department)
                                    ? ['MAC', 'Lakme', 'Maybelline', 'L\'Oreal', 'Clinique', 'The Body Shop', 'Nykaa', 'Forest Essentials']
                                    : ['Roadster', 'HRX', 'Puma', 'Nike', 'Adidas', 'Zara', 'H&M', 'Levi\'s']
                        ).map(brand => (
                            <label key={brand} className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.brands?.includes(brand)}
                                    onChange={() => handleFilterToggle('brands', brand)}
                                />
                                <span>{brand}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Filter */}
            <div className="filter-section">
                <div
                    className="filter-section-header"
                    onClick={() => toggleSection('price')}
                >
                    <h4>PRICE</h4>
                    <span className={`arrow ${expandedSections.price ? 'up' : 'down'}`}>›</span>
                </div>
                {expandedSections.price && (
                    <div className="filter-options">
                        {priceRanges.map((range, idx) => (
                            <label key={idx} className="filter-checkbox">
                                <input
                                    type="radio"
                                    name="price"
                                    checked={filters.priceRange?.min === range.min}
                                    onChange={() => handleFilterToggle('priceRange', range)}
                                />
                                <span>{range.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Color Filter */}
            <div className="filter-section">
                <div
                    className="filter-section-header"
                    onClick={() => toggleSection('color')}
                >
                    <h4>COLOR</h4>
                    <span className={`arrow ${expandedSections.color ? 'up' : 'down'}`}>›</span>
                </div>
                {expandedSections.color && (
                    <div className="filter-options color-options">
                        {colorOptions.map(color => (
                            <label key={color.name} className="color-option">
                                <input
                                    type="checkbox"
                                    checked={filters.colors?.includes(color.name)}
                                    onChange={() => handleFilterToggle('colors', color.name)}
                                />
                                <span
                                    className="color-swatch"
                                    style={{
                                        backgroundColor: color.hex,
                                        border: color.hex === '#FFFFFF' ? '1px solid #ddd' : 'none'
                                    }}
                                ></span>
                                <span className="color-name">{color.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Discount Filter */}
            <div className="filter-section">
                <div
                    className="filter-section-header"
                    onClick={() => toggleSection('discount')}
                >
                    <h4>DISCOUNT RANGE</h4>
                    <span className={`arrow ${expandedSections.discount ? 'up' : 'down'}`}>›</span>
                </div>
                {expandedSections.discount && (
                    <div className="filter-options">
                        {discountOptions.map(option => (
                            <label key={option.value} className="filter-checkbox">
                                <input
                                    type="radio"
                                    name="discount"
                                    checked={filters.discount === option.value}
                                    onChange={() => handleFilterToggle('discount', option.value)}
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Size/Dimensions Filter */}
            <div className="filter-section">
                <div
                    className="filter-section-header"
                    onClick={() => toggleSection('size')}
                >
                    <h4>{department === 'Home' ? 'DIMENSIONS' : ['Beauty', 'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'BathBody', 'Natural'].includes(department) ? 'PACK SIZE' : 'SIZE'}</h4>
                    <span className={`arrow ${expandedSections.size ? 'up' : 'down'}`}>›</span>
                </div>
                {expandedSections.size && (
                    <div className="filter-options size-options">
                        {(department === 'Home'
                            ? ['King', 'Queen', 'Double', 'Single', 'Standard', '4x6 ft', '6x9 ft']
                            : ['Beauty', 'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'BathBody', 'Natural'].includes(department)
                                ? ['50ml', '100ml', '200ml', '10g', '20g', 'Single', 'Kit']
                                : sizeOptions
                        ).map(size => (
                            <label key={size} className={['Home', 'Beauty', 'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'BathBody', 'Natural'].includes(department) ? 'filter-checkbox' : 'size-option'}>
                                <input
                                    type="checkbox"
                                    checked={filters.sizes?.includes(size)}
                                    onChange={() => handleFilterToggle('sizes', size)}
                                />
                                {['Home', 'Beauty', 'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'BathBody', 'Natural'].includes(department) ? (
                                    <span>{size}</span>
                                ) : (
                                    <span className="size-box">{size}</span>
                                )}
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}
