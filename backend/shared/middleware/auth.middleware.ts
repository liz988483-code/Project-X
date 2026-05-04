// backend/shared/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError, UnauthorizedError } from '../utils/api-error';

// Define JwtPayload interface
interface JwtPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

// Define User interface
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isSeller: boolean;
  isAdmin: boolean;
  permissions?: string[];
}


export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);
    
    try {
      const secret = process.env.JWT_SECRET || 'your-development-secret-key';
      const decoded = jwt.verify(token, secret) as JwtPayload;
      
      // For now, we'll trust the JWT. In production, you should verify with user service
      // const user = await UserServiceClient.getUserById(decoded.userId);
      
      // Mock user data - replace this with actual user service call
      const user = {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        status: 'active', // Assume active for now
        permissions: [] // Add permissions if your JWT includes them
      };
      
      if (!user || user.status !== 'active') {
        throw new UnauthorizedError('User not found or inactive');
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isSeller: user.role === 'seller' || user.role === 'admin',
        isAdmin: user.role === 'admin',
        permissions: user.permissions || []
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid token');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required');
  }
  next();
};

export const requireSeller = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isSeller) {
    throw new UnauthorizedError('Seller access required');
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    throw new UnauthorizedError('Admin access required');
  }
  next();
};

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.permissions?.includes(permission)) {
      throw new UnauthorizedError(`Permission denied: ${permission}`);
    }
    next();
  };
};

export const socketAuth = (socket: any, next: any) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const secret = process.env.JWT_SECRET || 'your-development-secret-key';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    socket.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};

// Simple auth middleware without user service verification (for development)
export const simpleAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }
    
    const secret = process.env.JWT_SECRET || 'your-development-secret-key';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      isSeller: decoded.role === 'seller' || decoded.role === 'admin',
      isAdmin: decoded.role === 'admin',
      permissions: []
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else {
      next(error);
    }
  }
};