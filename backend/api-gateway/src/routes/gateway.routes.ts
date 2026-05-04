import { Router } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { authMiddleware, rateLimitMiddleware } from '../middleware'
import { authService } from '../services/auth.service'
import { config } from '../config'

const router = Router()

// ---------------------
// Health check
// ---------------------
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ---------------------
// Auth routes (handled locally)
// ---------------------
router.post('/auth/register', authService.register)
router.post('/auth/login', authService.login)
router.post('/auth/logout', authMiddleware, authService.logout)
router.post('/auth/refresh', authService.refreshToken)
router.post('/auth/forgot-password', authService.forgotPassword)
router.post('/auth/reset-password', authService.resetPassword)
router.get('/users/me', authMiddleware, authService.getCurrentUser)
router.put('/users/me', authMiddleware, authService.updateProfile)

// ---------------------
// Proxy routes (all other services)
// ---------------------
const proxy = (path: string, target: string, auth = false, rateLimit = false) => {
  const middlewares = []
  if (auth) middlewares.push(authMiddleware)
  if (rateLimit) middlewares.push(rateLimitMiddleware)
  middlewares.push(createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^${path}`]: '' },
    onError: (err, req, res) => {
      console.error(`${path} Error:`, err)
      res.status(500).json({ error: `${path} service unavailable` })
    }
  }))
  router.use(path, ...middlewares)
}

// Products & Categories
proxy('/api/products', config.services.productService)
proxy('/api/categories', config.services.productService)

// Orders & Cart
proxy('/api/orders', config.services.orderService, true, true)
proxy('/api/cart', config.services.orderService, true, true)

// Payments
proxy('/api/payments', config.services.paymentService, true, true)

// Users / Sellers
proxy('/api/sellers', config.services.userService)
proxy('/api/users', config.services.userService, true)

// Chat, Notifications
proxy('/api/chat', config.services.chatService, true)
proxy('/api/notifications', config.services.notificationService, true)

// Analytics
proxy('/api/analytics', config.services.analyticsService, true)

// Search
proxy('/api/search', config.services.searchService)

// Upload
proxy('/api/upload', config.services.productService, true, true)

// Webhooks
proxy('/webhooks/stripe', config.services.paymentService)

export default router
