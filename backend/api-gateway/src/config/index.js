"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
        accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d'
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10)
    },
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
        credentials: true
    },
    services: {
        userService: process.env.USER_SERVICE_URL || 'http://localhost:3002',
        productService: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003',
        orderService: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
        paymentService: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
        notificationService: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
        chatService: process.env.CHAT_SERVICE_URL || 'http://localhost:3007',
        searchService: process.env.SEARCH_SERVICE_URL || 'http://localhost:3008',
        analyticsService: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3009'
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    app: {
        name: process.env.APP_NAME || 'Soko E-commerce',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    }
};
//# sourceMappingURL=index.js.map