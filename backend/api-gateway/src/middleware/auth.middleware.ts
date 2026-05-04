import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../utils/config'
import { logger } from './logger.middleware'

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
        permissions?: string[]
        iat?: number
        exp?: number
      }
      token?: string
    }
  }
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  // Auth routes
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/refresh-token',
  '/api/auth/verify-email',
  '/api/auth/reset-password',
  '/api/auth/forgot-password',
  
  // Public API routes
  '/api/products',
  '/api/categories',
  '/api/sellers/public',
  '/api/reviews/public',
  
  // Health checks
  '/api/health',
  '/health',
  
  // Documentation
  '/api/docs',
  '/docs',
  
  // Static assets
  '/uploads',
  '/images'
]

// Routes that require specific roles
const ROLE_BASED_ROUTES: Record<string, string[]> = {
  '/api/admin': ['admin', 'super_admin'],
  '/api/seller/dashboard': ['seller', 'admin'],
  '/api/seller/orders': ['seller', 'admin'],
  '/api/seller/products': ['seller', 'admin'],
  '/api/user/orders': ['customer', 'seller', 'admin'],
  '/api/user/profile': ['customer', 'seller', 'admin']
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route => {
      if (route.endsWith('/*')) {
        const baseRoute = route.replace('/*', '')
        return req.path.startsWith(baseRoute)
      }
      return req.path.startsWith(route)
    })

    if (isPublicRoute) {
      return next()
    }

    // Get token from headers
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required. Please provide a valid token.' 
      })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as any
    
    // Check if token has required fields
    if (!decoded.id || !decoded.email || !decoded.role) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token format' 
      })
    }

    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
      })
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions || [],
      iat: decoded.iat,
      exp: decoded.exp
    }
    req.token = token

    // Check role-based access for specific routes
    const userRole = req.user.role
    const path = req.path

    for (const [route, allowedRoles] of Object.entries(ROLE_BASED_ROUTES)) {
      if (path.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          return res.status(403).json({ 
            success: false,
            error: 'Insufficient permissions to access this resource' 
          })
        }
        break
      }
    }

    // Log authentication success (in production, you might want to log less)
    if (config.app.env === 'development') {
      logger.info(`Authenticated user: ${req.user.email} (${req.user.role}) accessing ${req.method} ${req.path}`)
    }

    next()
  } catch (error: any) {
    logger.error('Authentication error:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
      })
    }
    
    return res.status(500).json({ 
      success: false,
      error: 'Authentication failed' 
    })
  }
}

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as any
        
        if (decoded.id && decoded.email && decoded.role) {
          req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            permissions: decoded.permissions || [],
            iat: decoded.iat,
            exp: decoded.exp
          }
          req.token = token
        }
      } catch (error) {
        // Token is invalid or expired, but we still proceed
        if (config.app.env === 'development') {
          logger.warn('Optional auth: Invalid token, proceeding without authentication')
        }
      }
    }
    
    next()
  } catch (error: any) {
    // For optional auth, we don't block on errors
    logger.error('Optional auth error:', error)
    next()
  }
}

export const requireRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: `Required roles: ${roles.join(', ')}. Your role: ${req.user.role}` 
      })
    }

    next()
  }
}

export const requirePermissions = (...permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      })
    }

    const userPermissions = req.user.permissions || []
    const hasAllPermissions = permissions.every(permission => 
      userPermissions.includes(permission)
    )

    if (!hasAllPermissions) {
      return res.status(403).json({ 
        success: false,
        error: 'Insufficient permissions' 
      })
    }

    next()
  }
}

// Admin-only middleware
export const adminOnly = requireRoles('admin', 'super_admin')

// Seller-only middleware
export const sellerOnly = requireRoles('seller', 'admin', 'super_admin')

// Customer-only middleware
export const customerOnly = requireRoles('customer')

// Rate limiting middleware (simplified version)
export const rateLimitMiddleware = (limit: number = 100, windowMs: number = 60000) => {
  const requests = new Map<string, { count: number; resetTime: number }>()
  
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.connection.remoteAddress || 'unknown'
    const now = Date.now()
    
    if (!requests.has(key)) {
      requests.set(key, { count: 1, resetTime: now + windowMs })
    } else {
      const record = requests.get(key)!
      
      if (now > record.resetTime) {
        // Reset counter
        record.count = 1
        record.resetTime = now + windowMs
      } else {
        record.count++
        
        if (record.count > limit) {
          return res.status(429).json({ 
            success: false,
            error: 'Too many requests. Please try again later.' 
          })
        }
      }
    }
    
    // Clean up old records periodically (in production, use Redis or similar)
    if (Math.random() < 0.01) { // 1% chance to clean up
      for (const [ip, record] of requests.entries()) {
        if (now > record.resetTime + 60000) { // 1 minute after reset
          requests.delete(ip)
        }
      }
    }
    
    next()
  }
}

// CORS middleware
export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = config.app.allowedOrigins || ['http://localhost:3000', 'http://localhost:3001']
  const origin = req.headers.origin
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  next()
}

// Error handling middleware
export const errorHandlerMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('API Error:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    user: req.user?.email || 'unauthenticated'
  })
  
  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal Server Error'
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(config.app.env === 'development' && { stack: error.stack })
  })
}

// Request logging middleware
export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const user = req.user?.email || 'unauthenticated'
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info'
    
    logger[logLevel](`${req.method} ${req.path} ${res.statusCode} ${duration}ms - ${user}`)
  })
  
  next()
}
