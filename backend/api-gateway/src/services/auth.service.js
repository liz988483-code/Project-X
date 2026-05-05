"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthService {
    static async hashPassword(password) {
        return bcryptjs_1.default.hash(password, 12);
    }
    static async verifyPassword(password, hashedPassword) {
        return bcryptjs_1.default.compare(password, hashedPassword);
    }
    static generateToken(user) {
        return jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'default-secret', { expiresIn: '24h' });
    }
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default-secret');
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
    static async findUserByEmail(email) {
        return this.users.find(user => user.email === email) || null;
    }
    static async createUser(userData) {
        const newUser = {
            id: this.users.length + 1,
            ...userData
        };
        this.users.push(newUser);
        return newUser;
    }
}
exports.AuthService = AuthService;
AuthService.users = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2a$10$hashedpassword' // Mock hashed password
    }
];
exports.authService = {
    register: async (req, res) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Name, email and password are required' });
        }
        const existingUser = await AuthService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ success: false, error: 'User already exists' });
        }
        const hashedPassword = await AuthService.hashPassword(password);
        const user = await AuthService.createUser({ name, email, password: hashedPassword });
        const token = AuthService.generateToken({ id: user.id, name: user.name, email: user.email });
        return res.status(201).json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email },
            token
        });
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        const user = email ? await AuthService.findUserByEmail(email) : null;
        if (!user || !password) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const validPassword = await AuthService.verifyPassword(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const token = AuthService.generateToken({ id: user.id, name: user.name, email: user.email });
        return res.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email },
            token
        });
    },
    logout: (_req, res) => res.json({ success: true }),
    refreshToken: (_req, res) => {
        res.status(501).json({ success: false, error: 'Refresh token flow is not configured' });
    },
    forgotPassword: (_req, res) => {
        res.status(501).json({ success: false, error: 'Password reset flow is not configured' });
    },
    resetPassword: (_req, res) => {
        res.status(501).json({ success: false, error: 'Password reset flow is not configured' });
    },
    getCurrentUser: (req, res) => {
        res.json({ success: true, user: req.user });
    },
    updateProfile: (req, res) => {
        res.json({ success: true, user: { ...req.user, ...req.body } });
    }
};
//# sourceMappingURL=auth.service.js.map