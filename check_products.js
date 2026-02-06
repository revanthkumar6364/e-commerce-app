
const { products } = require('./frontend/src/data/products.js');

const hnm = products.filter(p => p.brand === 'H&M');
console.log(JSON.stringify(hnm, null, 2));
