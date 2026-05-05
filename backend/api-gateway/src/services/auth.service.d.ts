import { Request, Response } from 'express';
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}
export declare class AuthService {
    private static users;
    static hashPassword(password: string): Promise<string>;
    static verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
    static generateToken(user: Omit<User, 'password'>): string;
    static verifyToken(token: string): any;
    static findUserByEmail(email: string): Promise<User | null>;
    static createUser(userData: Omit<User, 'id'>): Promise<User>;
}
export declare const authService: {
    register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    logout: (_req: Request, res: Response) => Response<any, Record<string, any>>;
    refreshToken: (_req: Request, res: Response) => void;
    forgotPassword: (_req: Request, res: Response) => void;
    resetPassword: (_req: Request, res: Response) => void;
    getCurrentUser: (req: Request, res: Response) => void;
    updateProfile: (req: Request, res: Response) => void;
};
//# sourceMappingURL=auth.service.d.ts.map