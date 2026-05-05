import { Router } from 'express'
import { AnalyticsController } from '../controllers/analytics.controller'

const router = Router()

router.get('/dashboard', AnalyticsController.getDashboardMetrics)
router.get('/sales', AnalyticsController.getSalesReport)
router.get('/customers', AnalyticsController.getCustomerAnalytics)
router.get('/products', AnalyticsController.getProductAnalytics)
router.post('/events', AnalyticsController.trackEvent)
router.get('/realtime', AnalyticsController.getRealTimeMetrics)

export const analyticsRoutes = router
