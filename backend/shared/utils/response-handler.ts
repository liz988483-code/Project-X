import { Response } from 'express'
import { ApiError } from './api-error'
import { logger } from './logger'

export const successResponse = (
  res: Response,
  data: any,
  message: string = 'Success',
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  })
}

export const errorResponse = (
  res: Response,
  error: any,
  statusCode?: number
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
    name: error.name
  })

  const status = statusCode || 500
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error'
    : error.message

  return res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  })
}

export const paginatedResponse = (
  res: Response,
  data: any[],
  total: number,
  page: number,
  limit: number,
  message: string = 'Success'
) => {
  const pages = Math.ceil(total / limit)
  const hasNext = page < pages
  const hasPrev = page > 1

  return successResponse(res, {
    items: data,
    pagination: {
      total,
      page,
      limit,
      pages,
      hasNext,
      hasPrev,
      nextPage: hasNext ? page + 1 : null,
      prevPage: hasPrev ? page - 1 : null
    }
  }, message)
}