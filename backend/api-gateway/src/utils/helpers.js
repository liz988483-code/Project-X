"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = exports.sanitizeInput = exports.validateEmail = exports.slugify = exports.formatCurrency = exports.generateId = void 0;
const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};
exports.generateId = generateId;
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
};
exports.slugify = slugify;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const sanitizeInput = (input) => {
    return input.replace(/[<>]/g, '');
};
exports.sanitizeInput = sanitizeInput;
const paginate = (items, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = items.slice(startIndex, endIndex);
    return {
        results,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(items.length / limit),
            totalItems: items.length,
            itemsPerPage: limit,
            hasNext: endIndex < items.length,
            hasPrev: startIndex > 0
        }
    };
};
exports.paginate = paginate;
//# sourceMappingURL=helpers.js.map