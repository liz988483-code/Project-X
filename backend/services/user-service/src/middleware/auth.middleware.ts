import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { logger } from '../utils/logger'

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

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      })
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '')
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Check if token has required fields
    if (!decoded.id || !decoded.email || !decoded.role) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token format' 
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

export const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any
        
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
        logger.warn('Optional auth: Invalid token, proceeding without authentication')
      }
    }
    
    next()
  } catch (error: any) {
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
        error: `Required roles: ${roles.join(', ')}` 
      })
    }

    next()
  }
}
