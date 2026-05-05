"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLoggerMiddleware = exports.errorHandlerMiddleware = exports.corsMiddleware = exports.rateLimitMiddleware = exports.customerOnly = exports.sellerOnly = exports.adminOnly = exports.requirePermissions = exports.requireRoles = exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../utils/config");
const logger_middleware_1 = require("./logger.middleware");
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
];
// Routes that require specific roles
const ROLE_BASED_ROUTES = {
    '/api/admin': ['admin', 'super_admin'],
    '/api/seller/dashboard': ['seller', 'admin'],
    '/api/seller/orders': ['seller', 'admin'],
    '/api/seller/products': ['seller', 'admin'],
    '/api/user/orders': ['customer', 'seller', 'admin'],
    '/api/user/profile': ['customer', 'seller', 'admin']
};
const authMiddleware = async (req, res, next) => {
    try {
        // Check if route is public
        const isPublicRoute = PUBLIC_ROUTES.some(route => {
            if (route.endsWith('/*')) {
                const baseRoute = route.replace('/*', '');
                return req.path.startsWith(baseRoute);
            }
            return req.path.startsWith(route);
        });
        if (isPublicRoute) {
            return next();
        }
        // Get token from headers
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required. Please provide a valid token.'
            });
        }
        const token = authHeader.replace('Bearer ', '');
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        // Check if token has required fields
        if (!decoded.id || !decoded.email || !decoded.role) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token format'
            });
        }
        // Check if token is expired
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            return res.status(401).json({
                success: false,
                error: 'Token expired'
            });
        }
        // Attach user to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            permissions: decoded.permissions || [],
            iat: decoded.iat,
            exp: decoded.exp
        };
        req.token = token;
        // Check role-based access for specific routes
        const userRole = req.user.role;
        const path = req.path;
        for (const [route, allowedRoles] of Object.entries(ROLE_BASED_ROUTES)) {
            if (path.startsWith(route)) {
                if (!allowedRoles.includes(userRole)) {
                    return res.status(403).json({
                        success: false,
                        error: 'Insufficient permissions to access this resource'
                    });
                }
                break;
            }
        }
        // Log authentication success (in production, you might want to log less)
        if (config_1.config.app.env === 'development') {
            logger_middleware_1.logger.info(`Authenticated user: ${req.user.email} (${req.user.role}) accessing ${req.method} ${req.path}`);
        }
        next();
    }
    catch (error) {
        logger_middleware_1.logger.error('Authentication error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired'
            });
        }
        return res.status(500).json({
            success: false,
            error: 'Authentication failed'
        });
    }
};
exports.authMiddleware = authMiddleware;
const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            try {
                const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
                if (decoded.id && decoded.email && decoded.role) {
                    req.user = {
                        id: decoded.id,
                        email: decoded.email,
                        role: decoded.role,
                        permissions: decoded.permissions || [],
                        iat: decoded.iat,
                        exp: decoded.exp
                    };
                    req.token = token;
                }
            }
            catch (error) {
                // Token is invalid or expired, but we still proceed
                if (config_1.config.app.env === 'development') {
                    logger_middleware_1.logger.warn('Optional auth: Invalid token, proceeding without authentication');
                }
            }
        }
        next();
    }
    catch (error) {
        // For optional auth, we don't block on errors
        logger_middleware_1.logger.error('Optional auth error:', error);
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
const requireRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Required roles: ${roles.join(', ')}. Your role: ${req.user.role}`
            });
        }
        next();
    };
};
exports.requireRoles = requireRoles;
const requirePermissions = (...permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        const userPermissions = req.user.permissions || [];
        const hasAllPermissions = permissions.every(permission => userPermissions.includes(permission));
        if (!hasAllPermissions) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions'
            });
        }
        next();
    };
};
exports.requirePermissions = requirePermissions;
// Admin-only middleware
exports.adminOnly = (0, exports.requireRoles)('admin', 'super_admin');
// Seller-only middleware
exports.sellerOnly = (0, exports.requireRoles)('seller', 'admin', 'super_admin');
// Customer-only middleware
exports.customerOnly = (0, exports.requireRoles)('customer');
// Rate limiting middleware (simplified version)
const rateLimitMiddleware = (limit = 100, windowMs = 60000) => {
    const requests = new Map();
    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress || 'unknown';
        const now = Date.now();
        if (!requests.has(key)) {
            requests.set(key, { count: 1, resetTime: now + windowMs });
        }
        else {
            const record = requests.get(key);
            if (now > record.resetTime) {
                // Reset counter
                record.count = 1;
                record.resetTime = now + windowMs;
            }
            else {
                record.count++;
                if (record.count > limit) {
                    return res.status(429).json({
                        success: false,
                        error: 'Too many requests. Please try again later.'
                    });
                }
            }
        }
        // Clean up old records periodically (in production, use Redis or similar)
        if (Math.random() < 0.01) { // 1% chance to clean up
            for (const [ip, record] of requests.entries()) {
                if (now > record.resetTime + 60000) { // 1 minute after reset
                    requests.delete(ip);
                }
            }
        }
        next();
    };
};
exports.rateLimitMiddleware = rateLimitMiddleware;
// CORS middleware
const corsMiddleware = (req, res, next) => {
    const allowedOrigins = config_1.config.app.allowedOrigins || ['http://localhost:3000', 'http://localhost:3001'];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
};
exports.corsMiddleware = corsMiddleware;
// Error handling middleware
const errorHandlerMiddleware = (error, req, res, next) => {
    logger_middleware_1.logger.error('API Error:', {
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        user: req.user?.email || 'unauthenticated'
    });
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(config_1.config.app.env === 'development' && { stack: error.stack })
    });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
// Request logging middleware
const requestLoggerMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const user = req.user?.email || 'unauthenticated';
        const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
        logger_middleware_1.logger[logLevel](`${req.method} ${req.path} ${res.statusCode} ${duration}ms - ${user}`);
    });
    next();
};
exports.requestLoggerMiddleware = requestLoggerMiddleware;
//# sourceMappingURL=auth.middleware.js.map