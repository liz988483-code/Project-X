import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export class AuthService {
  private static users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: '$2a$10$hashedpassword' // Mock hashed password
    }
  ];

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(user: Omit<User, 'password'>): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  static async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const newUser: User = {
      id: this.users.length + 1,
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }
}

export const authService = {
  register: async (req: Request, res: Response) => {
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

  login: async (req: Request, res: Response) => {
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

  logout: (_req: Request, res: Response) => res.json({ success: true }),

  refreshToken: (_req: Request, res: Response) => {
    res.status(501).json({ success: false, error: 'Refresh token flow is not configured' });
  },

  forgotPassword: (_req: Request, res: Response) => {
    res.status(501).json({ success: false, error: 'Password reset flow is not configured' });
  },

  resetPassword: (_req: Request, res: Response) => {
    res.status(501).json({ success: false, error: 'Password reset flow is not configured' });
  },

  getCurrentUser: (req: Request, res: Response) => {
    res.json({ success: true, user: req.user });
  },

  updateProfile: (req: Request, res: Response) => {
    res.json({ success: true, user: { ...req.user, ...req.body } });
  }
};
