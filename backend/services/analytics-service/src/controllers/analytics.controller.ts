import { Request, Response } from 'express'
import { AnalyticsService } from '../services/analytics.service'
import { ApiError } from '../../../shared/utils/api-error'
import { logger } from '../../../shared/utils/logger'

export class AnalyticsController {
  static async getDashboardMetrics(req: Request, res: Response) {
    try {
      const { startDate, endDate, sellerId } = req.query
      const userId = req.user?.id
      const isSeller = req.user?.isSeller

      const metrics = await AnalyticsService.getDashboardMetrics({
        userId: isSeller ? sellerId || userId : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        timezone: req.query.timezone as string || 'UTC'
      })

      res.status(200).json({
        success: true,
        data: metrics
      })
    } catch (error) {
      logger.error('Failed to fetch dashboard metrics:', error)
      throw new ApiError('Failed to fetch analytics', 500)
    }
  }

  static async getSalesReport(req: Request, res: Response) {
    try {
      const { 
        startDate, 
        endDate, 
        interval = 'day',
        groupBy = 'product',
        sellerId 
      } = req.query

      const report = await AnalyticsService.generateSalesReport({
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
        interval: interval as 'hour' | 'day' | 'week' | 'month',
        groupBy: groupBy as 'product' | 'category' | 'seller',
        sellerId: sellerId as string,
        userId: req.user?.id
      })

      res.status(200).json({
        success: true,
        data: report
      })
    } catch (error) {
      logger.error('Failed to generate sales report:', error)
      throw new ApiError('Failed to generate sales report', 500)
    }
  }

  static async getCustomerAnalytics(req: Request, res: Response) {
    try {
      const { 
        segment = 'all',
        startDate,
        endDate,
        limit = 100 
      } = req.query

      const analytics = await AnalyticsService.getCustomerAnalytics({
        segment: segment as 'new' | 'returning' | 'active' | 'inactive' | 'all',
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        limit: Number(limit)
      })

      res.status(200).json({
        success: true,
        data: analytics
      })
    } catch (error) {
      logger.error('Failed to fetch customer analytics:', error)
      throw new ApiError('Failed to fetch customer analytics', 500)
    }
  }

  static async getProductAnalytics(req: Request, res: Response) {
    try {
      const { 
        productId,
        startDate,
        endDate,
        includeCompetitors = false 
      } = req.query

      const analytics = await AnalyticsService.getProductAnalytics({
        productId: productId as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        includeCompetitors: includeCompetitors === 'true',
        sellerId: req.user?.isSeller ? req.user.id : undefined
      })

      res.status(200).json({
        success: true,
        data: analytics
      })
    } catch (error) {
      logger.error('Failed to fetch product analytics:', error)
      throw new ApiError('Failed to fetch product analytics', 500)
    }
  }

  static async trackEvent(req: Request, res: Response) {
    try {
      const { eventType, eventData, userId, sessionId } = req.body

      await AnalyticsService.trackEvent({
        eventType,
        eventData,
        userId: userId || req.user?.id,
        sessionId,
        timestamp: new Date(),
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        pageUrl: req.get('Referer')
      })

      res.status(200).json({
        success: true,
        message: 'Event tracked successfully'
      })
    } catch (error) {
      logger.error('Failed to track event:', error)
      // Don't throw error for tracking failures
      res.status(200).json({
        success: false,
        message: 'Event tracking failed'
      })
    }
  }

  static async getRealTimeMetrics(req: Request, res: Response) {
    try {
      const { metrics = ['concurrentUsers', 'ordersPerMinute', 'revenue'] } = req.query
      
      const realTimeMetrics = await AnalyticsService.getRealTimeMetrics(
        Array.isArray(metrics) ? metrics : [metrics as string]
      )

      res.status(200).json({
        success: true,
        data: realTimeMetrics
      })
    } catch (error) {
      logger.error('Failed to fetch real-time metrics:', error)
      throw new ApiError('Failed to fetch real-time metrics', 500)
    }
  }
}