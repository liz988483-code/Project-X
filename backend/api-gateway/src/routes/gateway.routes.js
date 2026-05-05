"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const middleware_1 = require("../middleware");
const auth_service_1 = require("../services/auth.service");
const config_1 = require("../config");
const router = (0, express_1.Router)();
// ---------------------
// Health check
// ---------------------
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ---------------------
// Auth routes (handled locally)
// ---------------------
router.post('/auth/register', auth_service_1.authService.register);
router.post('/auth/login', auth_service_1.authService.login);
router.post('/auth/logout', middleware_1.authMiddleware, auth_service_1.authService.logout);
router.post('/auth/refresh', auth_service_1.authService.refreshToken);
router.post('/auth/forgot-password', auth_service_1.authService.forgotPassword);
router.post('/auth/reset-password', auth_service_1.authService.resetPassword);
router.get('/users/me', middleware_1.authMiddleware, auth_service_1.authService.getCurrentUser);
router.put('/users/me', middleware_1.authMiddleware, auth_service_1.authService.updateProfile);
// ---------------------
// Proxy routes (all other services)
// ---------------------
const proxy = (path, target, auth = false, rateLimit = false) => {
    const middlewares = [];
    if (auth)
        middlewares.push(middleware_1.authMiddleware);
    if (rateLimit)
        middlewares.push(middleware_1.rateLimitMiddleware);
    middlewares.push((0, http_proxy_middleware_1.createProxyMiddleware)({
        target,
        changeOrigin: true,
        pathRewrite: { [`^${path}`]: '' },
        onError: (err, req, res) => {
            console.error(`${path} Error:`, err);
            res.status(500).json({ error: `${path} service unavailable` });
        }
    }));
    router.use(path, ...middlewares);
};
// Products & Categories
proxy('/api/products', config_1.config.services.productService);
proxy('/api/categories', config_1.config.services.productService);
// Orders & Cart
proxy('/api/orders', config_1.config.services.orderService, true, true);
proxy('/api/cart', config_1.config.services.orderService, true, true);
// Payments
proxy('/api/payments', config_1.config.services.paymentService, true, true);
// Users / Sellers
proxy('/api/sellers', config_1.config.services.userService);
proxy('/api/users', config_1.config.services.userService, true);
// Chat, Notifications
proxy('/api/chat', config_1.config.services.chatService, true);
proxy('/api/notifications', config_1.config.services.notificationService, true);
// Analytics
proxy('/api/analytics', config_1.config.services.analyticsService, true);
// Search
proxy('/api/search', config_1.config.services.searchService);
// Upload
proxy('/api/upload', config_1.config.services.productService, true, true);
// Webhooks
proxy('/webhooks/stripe', config_1.config.services.paymentService);
exports.default = router;
//# sourceMappingURL=gateway.routes.js.map