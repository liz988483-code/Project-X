import { Router } from 'express';

const router = Router();

// Mock cart data
let cart = [
  {
    id: 1,
    productId: 1,
    name: 'Premium Wireless Headphones',
    price: 129.99,
    quantity: 1
  }
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  });
});

router.post('/add', (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // Mock product lookup
  const products = [
    { id: 1, name: 'Premium Wireless Headphones', price: 129.99 },
    { id: 2, name: 'Smart Watch Series 5', price: 299.99 }
  ];

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: cart.length + 1,
      productId,
      name: product.name,
      price: product.price,
      quantity
    });
  }

  res.json({
    success: true,
    data: cart
  });
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  cart = cart.filter(item => item.id !== id);

  res.json({
    success: true,
    data: cart
  });
});

export default router;