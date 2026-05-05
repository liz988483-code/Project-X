import { Request, Response, NextFunction } from 'express'

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`[Analytics] ${req.method} ${req.url}`)
  next()
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err?.statusCode || 500
  const message = err?.message || 'Internal Server Error'
  res.status(status).json({
    success: false,
    message,
    errors: err?.errors || []
  })
}
