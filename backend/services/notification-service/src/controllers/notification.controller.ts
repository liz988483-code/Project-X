import { Request, Response } from 'express'
import { NotificationService } from '../services/notification.service'
import { ApiError, BadRequestError, NotFoundError } from '../../../shared/utils/api-error'
import { logger } from '../../../shared/utils/logger'

export class NotificationController {
  static async getUserNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { 
        page = 1, 
        limit = 20, 
        read,
        type 
      } = req.query

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      const notifications = await NotificationService.getUserNotifications({
        userId,
        page: Math.max(1, parseInt(page as string)),
        limit: Math.min(100, Math.max(1, parseInt(limit as string))),
        read: read ? read === 'true' : undefined,
        type: type as string
      })

      res.status(200).json({
        success: true,
        data: notifications
      })
    } catch (error) {
      logger.error('Failed to fetch notifications:', error)
      throw new ApiError('Failed to fetch notifications', 500)
    }
  }

  static async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { notificationId } = req.params
      const { markAll } = req.query

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      if (markAll === 'true') {
        await NotificationService.markAllAsRead(userId)
      } else {
        await NotificationService.markAsRead(notificationId, userId)
      }

      res.status(200).json({
        success: true,
        message: markAll === 'true' ? 'All notifications marked as read' : 'Notification marked as read'
      })
    } catch (error) {
      logger.error('Failed to mark notification as read:', error)
      throw new ApiError('Failed to update notification', 500)
    }
  }

  static async deleteNotification(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { notificationId } = req.params
      const { deleteAll } = req.query

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      if (deleteAll === 'true') {
        await NotificationService.deleteAll(userId)
      } else {
        await NotificationService.deleteNotification(notificationId, userId)
      }

      res.status(200).json({
        success: true,
        message: deleteAll === 'true' ? 'All notifications deleted' : 'Notification deleted'
      })
    } catch (error) {
      logger.error('Failed to delete notification:', error)
      throw new ApiError('Failed to delete notification', 500)
    }
  }

  static async getNotificationPreferences(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      const preferences = await NotificationService.getUserPreferences(userId)

      res.status(200).json({
        success: true,
        data: preferences
      })
    } catch (error) {
      logger.error('Failed to fetch notification preferences:', error)
      throw new ApiError('Failed to fetch preferences', 500)
    }
  }

  static async updateNotificationPreferences(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const preferences = req.body

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      const updated = await NotificationService.updateUserPreferences(userId, preferences)

      res.status(200).json({
        success: true,
        data: updated,
        message: 'Notification preferences updated'
      })
    } catch (error) {
      logger.error('Failed to update notification preferences:', error)
      throw new ApiError('Failed to update preferences', 500)
    }
  }

  static async sendTestNotification(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { type, channel } = req.body

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      await NotificationService.sendTestNotification(userId, type, channel)

      res.status(200).json({
        success: true,
        message: 'Test notification sent'
      })
    } catch (error) {
      logger.error('Failed to send test notification:', error)
      throw new ApiError('Failed to send test notification', 500)
    }
  }
}