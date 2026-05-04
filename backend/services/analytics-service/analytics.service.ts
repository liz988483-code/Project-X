import { EventModel, IEvent } from '../models/event.model'
import { AnalyticsModel } from '../models/analytics.model'
import { connectRedis } from '../database/redis'
import { logger } from '../../../shared/utils/logger'
import { MessageBroker } from '../../../message-broker'

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  conversionRate: number
  topProducts: Array<{
    productId: string
    name: string
    revenue: number
    unitsSold: number
    growth: number
  }>
  salesTrend: Array<{
    date: string
    revenue: number
    orders: number
    customers: number
  }>
  revenueByCategory: Array<{
    category: string
    revenue: number
    percentage: number
  }>
}

export class AnalyticsService {
  static async getDashboardMetrics(options: {
    userId?: string
    startDate?: Date
    endDate?: Date
    timezone?: string
  }): Promise<DashboardMetrics> {
    const cacheKey = `dashboard:${options.userId || 'global'}:${options.startDate?.toISOString() || 'all'}`
    const redis = await connectRedis()
    
    // Try cache first
    const cached = await redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }

    const { startDate, endDate, userId } = options
    const query: any = {}
    
    if (startDate || endDate) {
      query.timestamp = {}
      if (startDate) query.timestamp.$gte = startDate
      if (endDate) query.timestamp.$lte = endDate
    }

    if (userId) {
      query.sellerId = userId
    }

    // Get metrics from database
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      recentEvents
    ] = await Promise.all([
      EventModel.aggregate([
        { $match: { ...query, eventType: 'order_completed' } },
        { $group: { _id: null, total: { $sum: '$eventData.total' } } }
      ]),
      EventModel.countDocuments({ ...query, eventType: 'order_completed' }),
      EventModel.distinct('userId', { ...query, eventType: 'user_activity' }),
      EventModel.find(query)
        .sort({ timestamp: -1 })
        .limit(100)
    ])

    // Calculate conversion rate
    const pageViews = await EventModel.countDocuments({ 
      ...query, 
      eventType: 'page_view' 
    })
    const conversions = await EventModel.countDocuments({ 
      ...query, 
      eventType: 'order_completed' 
    })
    const conversionRate = pageViews > 0 ? (conversions / pageViews) * 100 : 0

    // Get top products
    const topProducts = await EventModel.aggregate([
      { $match: { ...query, eventType: 'product_purchased' } },
      { $group: {
        _id: '$eventData.productId',
        name: { $first: '$eventData.productName' },
        revenue: { $sum: '$eventData.total' },
        unitsSold: { $sum: '$eventData.quantity' }
      }},
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ])

    // Get sales trend
    const salesTrend = await EventModel.aggregate([
      { $match: { ...query, eventType: 'order_completed' } },
      { $group: {
        _id: { 
          $dateToString: { 
            format: '%Y-%m-%d', 
            date: '$timestamp',
            timezone: options.timezone 
          } 
        },
        revenue: { $sum: '$eventData.total' },
        orders: { $sum: 1 },
        customers: { $addToSet: '$userId' }
      }},
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ])

    const metrics: DashboardMetrics = {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalCustomers: totalCustomers.length,
      averageOrderValue: totalOrders > 0 ? (totalRevenue[0]?.total || 0) / totalOrders : 0,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      topProducts: topProducts.map(p => ({
        productId: p._id,
        name: p.name,
        revenue: p.revenue,
        unitsSold: p.unitsSold,
        growth: 0 // Calculate based on previous period
      })),
      salesTrend: salesTrend.map(s => ({
        date: s._id,
        revenue: s.revenue,
        orders: s.orders,
        customers: s.customers.length
      })),
      revenueByCategory: [] // Would come from separate aggregation
    }

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(metrics))

    return metrics
  }

  static async generateSalesReport(options: {
    startDate: Date
    endDate: Date
    interval: 'hour' | 'day' | 'week' | 'month'
    groupBy: 'product' | 'category' | 'seller'
    sellerId?: string
    userId?: string
  }) {
    const formatMap = {
      hour: '%Y-%m-%d %H:00',
      day: '%Y-%m-%d',
      week: '%Y-%W',
      month: '%Y-%m'
    }

    const groupByMap = {
      product: '$eventData.productId',
      category: '$eventData.category',
      seller: '$eventData.sellerId'
    }

    const pipeline: any[] = [
      { $match: { 
        eventType: 'order_completed',
        timestamp: { $gte: options.startDate, $lte: options.endDate }
      }},
      { $group: {
        _id: {
          interval: { $dateToString: { 
            format: formatMap[options.interval], 
            date: '$timestamp' 
          }},
          group: groupByMap[options.groupBy]
        },
        revenue: { $sum: '$eventData.total' },
        orders: { $sum: 1 },
        units: { $sum: '$eventData.quantity' },
        customers: { $addToSet: '$userId' }
      }},
      { $sort: { '_id.interval': 1 } }
    ]

    if (options.sellerId) {
      pipeline[0].$match['eventData.sellerId'] = options.sellerId
    }

    const results = await EventModel.aggregate(pipeline)

    return results.map(r => ({
      interval: r._id.interval,
      group: r._id.group,
      revenue: r.revenue,
      orders: r.orders,
      units: r.units,
      uniqueCustomers: r.customers.length,
      averageOrderValue: r.revenue / r.orders
    }))
  }

  static async trackEvent(event: Partial<IEvent>) {
    try {
      // Save to database
      const eventDoc = await EventModel.create(event)

      // Publish to message broker for real-time processing
      await MessageBroker.publish('analytics_events', {
        type: 'event_tracked',
        data: eventDoc,
        timestamp: new Date()
      })

      // Update real-time counters
      if (event.eventType === 'page_view' || event.eventType === 'user_activity') {
        const redis = await connectRedis()
        await redis.incr(`analytics:realtime:${event.eventType}`)
        await redis.expire(`analytics:realtime:${event.eventType}`, 60)
      }

      logger.info('Event tracked:', { eventType: event.eventType, userId: event.userId })
    } catch (error) {
      logger.error('Failed to track event:', error)
      throw error
    }
  }

  static async getRealTimeMetrics(metrics: string[]) {
    const redis = await connectRedis()
    const results: Record<string, number> = {}

    for (const metric of metrics) {
      switch (metric) {
        case 'concurrentUsers':
          const userCount = await redis.get('analytics:realtime:active_users')
          results[metric] = parseInt(userCount || '0')
          break
        
        case 'ordersPerMinute':
          const orders = await redis.get('analytics:realtime:orders_per_minute')
          results[metric] = parseInt(orders || '0')
          break
        
        case 'revenue':
          const revenue = await redis.get('analytics:realtime:revenue_today')
          results[metric] = parseFloat(revenue || '0')
          break
      }
    }

    return results
  }
}