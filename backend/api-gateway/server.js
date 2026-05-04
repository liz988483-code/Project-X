const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'SOKO API Gateway',
    version: '1.0.0'
  });
});

// Products endpoint
app.get('/api/products', (req, res) => {
  const products = [
    { 
      id: 1, 
      name: 'Premium Wireless Headphones', 
      price: 129.99,
      description: 'Noise-cancelling wireless headphones',
      category: 'Electronics'
    },
    { 
      id: 2, 
      name: 'Smart Watch Series 5', 
      price: 299.99,
      description: 'Latest smart watch with health monitoring',
      category: 'Electronics'
    },
    { 
      id: 3, 
      name: 'Organic Cotton T-Shirt', 
      price: 29.99,
      description: 'Comfortable organic cotton t-shirt',
      category: 'Fashion'
    },
    { 
      id: 4, 
      name: 'Coffee Maker Deluxe', 
      price: 89.99,
      description: 'Programmable coffee maker with grinder',
      category: 'Home & Kitchen'
    },
    { 
      id: 5, 
      name: 'Fitness Tracker Band', 
      price: 49.99,
      description: 'Waterproof fitness tracker with heart rate monitor',
      category: 'Fitness'
    }
  ];
  res.json(products);
});

// Cart endpoints
let cart = [];

app.get('/api/cart', (req, res) => {
  res.json(cart);
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  
  const cartItem = cart.find(item => item.productId === productId);
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      name: `Product ${productId}`,
      price: 99.99,
      quantity
    });
  }
  
  res.json(cart);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ SOKO API Gateway running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🛒 Products API: http://localhost:${PORT}/api/products`);
});
