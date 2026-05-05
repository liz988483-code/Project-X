"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_middleware_1 = require("./logger.middleware");
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, errors) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;
    }
}
const errorHandler = (error, req, res, next) => {
    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errors: error.errors,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
    // Log unexpected errors
    logger_middleware_1.logger.error('Unexpected error:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });
    const statusCode = 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message;
    return res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.middleware.js.map