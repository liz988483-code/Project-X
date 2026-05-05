import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
export declare const logger: winston.Logger;
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const loggerMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=logger.middleware.d.ts.map