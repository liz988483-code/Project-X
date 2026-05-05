"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Mock orders data
const orders = [
    {
        id: 1,
        userId: 1,
        items: [
            { productId: 1, name: 'Premium Wireless Headphones', price: 129.99, quantity: 1 }
        ],
        total: 129.99,
        status: 'completed',
        createdAt: '2024-01-15T10:00:00Z'
    }
];
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: orders
    });
});
router.get('/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
        return res.status(404).json({
            success: false,
            error: 'Order not found'
        });
    }
    res.json({
        success: true,
        data: order
    });
});
router.post('/', (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;
    // Mock order creation
    const newOrder = {
        id: orders.length + 1,
        userId: 1, // Mock user
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'pending',
        shippingAddress,
        paymentMethod,
        createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    res.status(201).json({
        success: true,
        data: newOrder
    });
});
exports.default = router;
//# sourceMappingURL=order.routes.js.map