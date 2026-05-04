import { Request, Response, NextFunction } from 'express'
import { logger } from './logger.middleware'

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
    public errors?: unknown[]
  ) {
    super(message)
  }
}
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }

  // Log unexpected errors
  logger.error('Unexpected error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  })

  const statusCode = 500
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error'
    : error.message

  return res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  })
}
