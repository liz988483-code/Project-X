import { Router } from 'express';

const router = Router();

router.get('/profile', (req, res) => {
  // Mock user profile
  res.json({
    success: true,
    data: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/images/avatar.jpg'
    }
  });
});

router.post('/register', (req, res) => {
  // Mock registration
  res.json({
    success: true,
    message: 'User registered successfully',
    data: {
      id: 2,
      name: req.body.name,
      email: req.body.email
    }
  });
});

router.post('/login', (req, res) => {
  // Mock login
  res.json({
    success: true,
    message: 'Login successful',
    token: 'mock-jwt-token',
    user: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    }
  });
});

export default router;