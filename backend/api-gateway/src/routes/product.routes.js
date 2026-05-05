"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Mock products data
const products = [
    {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 129.99,
        description: 'Noise-cancelling wireless headphones',
        category: 'Electronics',
        image: '/images/headphones.jpg',
        inStock: true
    },
    {
        id: 2,
        name: 'Smart Watch Series 5',
        price: 299.99,
        description: 'Latest smart watch with health monitoring',
        category: 'Electronics',
        image: '/images/smartwatch.jpg',
        inStock: true
    },
    {
        id: 3,
        name: 'Organic Cotton T-Shirt',
        price: 29.99,
        description: 'Comfortable organic cotton t-shirt',
        category: 'Fashion',
        image: '/images/tshirt.jpg',
        inStock: true
    },
    {
        id: 4,
        name: 'Coffee Maker Deluxe',
        price: 89.99,
        description: 'Programmable coffee maker with grinder',
        category: 'Home & Kitchen',
        image: '/images/coffeemaker.jpg',
        inStock: false
    },
];
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: products,
        count: products.length
    });
});
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({
            success: false,
            error: 'Product not found'
        });
    }
    res.json({
        success: true,
        data: product
    });
});
exports.default = router;
//# sourceMappingURL=product.routes.js.map