import { UserRole } from './user.types';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        isSeller: boolean;
        isAdmin: boolean;
        permissions?: string[];
      };
      userId?: string;
    }
  }
}

export {};
