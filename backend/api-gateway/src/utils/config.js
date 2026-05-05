"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.config = {
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your-default-jwt-secret-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    },
    // API Gateway Configuration
    gateway: {
        port: parseInt(process.env.API_GATEWAY_PORT || '3000'),
        host: process.env.API_GATEWAY_HOST || 'localhost',
        rateLimit: {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
            max: parseInt(process.env.RATE_LIMIT_MAX || '100')
        }
    },
    // Microservices URLs
    services: {
        userService: process.env.USER_SERVICE_URL || 'http://localhost:3001',
        productService: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
        orderService: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
        cartService: process.env.CART_SERVICE_URL || 'http://localhost:3004',
        paymentService: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
        notificationService: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006'
    },
    // App Configuration
    app: {
        env: process.env.NODE_ENV || 'development',
        name: process.env.APP_NAME || 'Soko API Gateway',
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
    },
    // Redis Configuration (for rate limiting and caching)
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        ttl: parseInt(process.env.REDIS_TTL || '3600') // 1 hour in seconds
    },
    // Logging Configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        dir: process.env.LOG_DIR || './logs'
    }
};
// Validate required environment variables
const validateConfig = () => {
    const required = ['JWT_SECRET', 'USER_SERVICE_URL'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};
exports.validateConfig = validateConfig;
//# sourceMappingURL=config.js.map