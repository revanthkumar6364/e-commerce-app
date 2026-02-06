
/* --- URBAN VIBE REALITY CATALOG --- */
/* 
   Strictly mapped imagery to ensure "Jeans" look like Jeans.
   No random array indexing. Each type has a dedicated Image URL.
*/

// --- REAL IMAGE DATABASE (Verified Unsplash IDs) ---
const DEFINITIONS = {
  men: [
    { type: 'Denim Jeans', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80' },
    { type: 'Oxford Shirt', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80' },
    { type: 'Leather Jacket', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80' },
    { type: 'Chino Pants', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80' },
    { type: 'Urban Sneakers', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80' },
    { type: 'Tailored Suit', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80' },
    { type: 'Street Hoodie', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80' },
    { type: 'Polo Tee', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80' },
    { type: 'Bomber Jacket', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80' }
  ],
  women: [
    { type: 'Summer Dress', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80' },
    { type: 'Silk Blouse', image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acce?w=800&q=80' },
    { type: 'Designer Bag', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80' },
    { type: 'High Heels', image: 'https://images.unsplash.com/photo-1543163521-32164f325daf?w=800&q=80' },
    { type: 'Vintage Shades', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80' },
    { type: 'Floral Maxi', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80' },
    { type: 'Office Blazer', image: 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=800&q=80' },
    { type: 'Denim Skirt', image: 'https://images.unsplash.com/photo-1609357912423-e380af7634f1?w=800&q=80' },
    { type: 'Evening Gown', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80' }
  ],
  kids: [
    { type: 'Kids Hoodie', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80' },
    { type: 'Denim Overalls', image: 'https://images.unsplash.com/photo-1519238263496-6362d74c1123?w=800&q=80' },
    { type: 'School Bag', image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80' },
    { type: 'Party Dress', image: 'https://images.unsplash.com/photo-1621452773781-0f992fd0f5d9?w=800&q=80' },
    { type: 'Tiny Sneakers', image: 'https://images.unsplash.com/photo-1514989940723-e88727357d56?w=800&q=80' },
    { type: 'Winter Jacket', image: 'https://images.unsplash.com/photo-1526315573752-d5951d18f5da?w=800&q=80' }
  ],
  tech: [
    { type: 'Smartphone X200', image: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=800&q=80', desc: 'Manufactured by TechCorp. 6.7" OLED Display, Snapdragon 8 Gen 3.' },
    { type: 'Pro Laptop M3', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80', desc: 'Manufactured by Silicon Valley Inc. 16GB Unified Memory, 1TB SSD.' },
    { type: 'Noise-Cancelling Buds', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', desc: 'Manufactured by AudioLab. 40h Battery Life, Lossless Audio.' },
    { type: '4K Drone', image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80', desc: 'Manufactured by SkySystems. 3-Axis Gimbal, 10km Range.' },
    { type: 'Smart Home Hub', image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc0d5?w=800&q=80', desc: 'Manufactured by HomeOS. Control your entire home with voice.' }
  ],
  beauty: [
    { type: 'Vitamin C Serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80' },
    { type: 'Matte Lipstick', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80' },
    { type: 'Organic Hair Oil', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=800&q=80' },
    { type: 'Luxury Perfume', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80' }
  ],
  home: [
    { type: 'Velvet Armchair', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
    { type: 'Modern Lamp', image: 'https://images.unsplash.com/photo-1507473888900-52e1adad5474?w=800&q=80' },
    { type: 'Ceramic Vase', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80' },
    { type: 'Abstract Wall Art', image: 'https://images.unsplash.com/photo-1582562124811-c8ed263c9f14?w=800&q=80' }
  ],
  travel: [
    { type: 'Maldives Overwater Villa', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c05d?w=800&q=80' },
    { type: 'Swiss Alps Chalet', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80' },
    { type: 'Paris City View Suite', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80' },
    { type: 'Business Class Seat', image: 'https://images.unsplash.com/photo-1542296332-2e44a996aaad?w=800&q=80' }
  ]
};

const BRANDS = ["Lumina", "Apex", "Nova", "Vortex", "Zenith", "Aura", "Nebula", "Sol", "Luna", "Flux"];

// --- GENERATOR LOGIC ---

function generateSubCategory(category, subCategory, templates, count, startId) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    const brand = BRANDS[i % BRANDS.length];

    const inStock = Math.random() > 0.2; // 80% in stock

    items.push({
      id: startId + i,
      title: `${brand} ${template.type}`,
      brand: brand, // Explicit Brand Field
      inStock: inStock,
      stockCount: inStock ? Math.floor(Math.random() * 50) + 1 : 0,
      category: category,
      subCategory: subCategory, // e.g. 'Men', 'Women'
      price: 500 + Math.floor(Math.random() * 4500),
      rating: (3.8 + Math.random() * 1.2).toFixed(1),
      reviews: Math.floor(Math.random() * 500) + 10,
      image: template.image,
      images: [template.image, template.image],
      type: template.type, // Added for filtering
      desc: template.desc || `Official ${brand} product. This ${template.type} is crafted with the finest materials for premium quality and durability.`,
      tags: [category, subCategory, template.type.split(' ')[1] || 'style'].filter(Boolean)
    });
  }
  return items;
}

// --- CATALOG BUILD ---
// 1. Fashion (Men, Women, Kids)
const men = generateSubCategory('fashion', 'Men', DEFINITIONS.men, 50, 1000);
const women = generateSubCategory('fashion', 'Women', DEFINITIONS.women, 50, 1050);
const kids = generateSubCategory('fashion', 'Kids', DEFINITIONS.kids, 30, 1100);

// 2. Electronics (With Manufacturer details)
const electronics = generateSubCategory('electronics', 'Tech', DEFINITIONS.tech, 60, 2000);

// 3. Beauty
const beauty = generateSubCategory('beauty', 'Beauty', DEFINITIONS.beauty, 50, 3000);

// 4. Home
const home = generateSubCategory('home', 'Decor', DEFINITIONS.home, 80, 4000);

// 5. Travel
const travel = generateSubCategory('travel', 'Trips', DEFINITIONS.travel, 30, 5000);

// 6. Import Product Collections
import { TSHIRT_PRODUCTS } from './tshirts';
import { KURTA_PRODUCTS } from './kurtas';
import { SAREE_PRODUCTS } from './sarees';
import { PARTY_WEAR_PRODUCTS } from './partywear';

export const products = [...men, ...women, ...kids, ...electronics, ...beauty, ...home, ...travel, ...TSHIRT_PRODUCTS, ...KURTA_PRODUCTS, ...SAREE_PRODUCTS, ...PARTY_WEAR_PRODUCTS];

// --- EXPORTS & METADATA ---
export const categories = [
  { id: 'all', name: 'The Collection', icon: '✦' },
  { id: 'fashion', name: 'Couture', icon: '🧥' },
  { id: 'electronics', name: 'Technique', icon: '⚡' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'home', name: 'Sanctuary', icon: '🏡' },
  { id: 'travel', name: 'Voyage', icon: '✈️' },
];

export const getProductById = (id) => products.find(p => p.id === parseInt(id));

export const getProductsByCategory = (cat) => {
  if (cat === 'all') return products;
  return products.filter(p => p.category === cat);
};

// --- DATA ACCESSORIES RESTORED ---
export const collections = [
  { id: 'summer-essentials', name: 'Summer Collection ☀️', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=400&fit=crop', season: 'summer', offer: '20% OFF' },
  { id: 'winter-specials', name: 'Winter Special ❄️', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop', season: 'winter', offer: '30% OFF' },
  { id: 'tech-deals', name: 'Tech Deals ⚡', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80', offer: 'Flash Sale' } /* Real Tech Image */
];

export const shippingOptions = [
  { id: 'standard', name: 'Standard Delivery', price: 0, days: '5-7 days', icon: '📦', desc: 'Free standard delivery' },
  { id: 'rapido', name: 'Rapido Express', price: 99, days: '1-2 days', icon: '🚗', desc: 'Fast door-to-door delivery' },
  { id: 'doorstep', name: 'Doorstep Plus', price: 149, days: '24 hours', icon: '🚚', desc: 'Next-day doorstep delivery' }
];

export const couponsAndOffers = [
  { code: 'WELCOME15', discount: 15, type: 'percentage', minAmount: 0, desc: '15% OFF for new members' },
  { code: 'FIRST100', discount: 100, type: 'flat', minAmount: 500, desc: '₹100 OFF on your first purchase over ₹500' },
  { code: 'SUMMER20', discount: 20, type: 'percentage', minAmount: 2000, desc: '20% OFF on Summer Essentials over ₹2000' },
  { code: 'WINTER30', discount: 30, type: 'percentage', minAmount: 1500, desc: '30% OFF on Winter Specials over ₹1500' },
  { code: 'WELCOME200', discount: 200, type: 'flat', minAmount: 1000, desc: '₹200 OFF on your first order over ₹1000' },
  { code: 'FREESHIP', discount: 0, type: 'free-shipping', minAmount: 500, desc: 'FREE shipping on orders over ₹500' },
  { code: 'BUYMORE', discount: 25, type: 'percentage', minAmount: 3000, desc: '25% OFF on orders over ₹3000' }
];

export const dltFeatures = [
  { id: '1', name: 'Real-time Tracking', icon: '📍', desc: 'Track your package live on the map' }
];
