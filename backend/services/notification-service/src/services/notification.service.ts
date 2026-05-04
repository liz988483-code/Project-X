import { Request, Response } from 'express'
import { ChatService } from '../services/chat.service'
import { ApiError, BadRequestError, NotFoundError } from '../../../shared/utils/api-error'
import { logger } from '../../../shared/utils/logger'

export class ChatController {
  static async getChats(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { page = 1, limit = 20, unreadOnly = false } = req.query

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      const chats = await ChatService.getUserChats({
        userId,
        page: Math.max(1, parseInt(page as string)),
        limit: Math.min(50, Math.max(1, parseInt(limit as string))),
        unreadOnly: unreadOnly === 'true'
      })

      res.status(200).json({
        success: true,
        data: chats
      })
    } catch (error) {
      logger.error('Failed to fetch chats:', error)
      throw new ApiError('Failed to fetch chats', 500)
    }
  }

  static async getChatMessages(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { chatId } = req.params
      const { 
        page = 1, 
        limit = 50,
        before 
      } = req.query

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      const messages = await ChatService.getChatMessages({
        chatId,
        userId,
        page: Math.max(1, parseInt(page as string)),
        limit: Math.min(100, Math.max(1, parseInt(limit as string))),
        before: before ? new Date(before as string) : undefined
      })

      res.status(200).json({
        success: true,
        data: messages
      })
    } catch (error) {
      logger.error('Failed to fetch chat messages:', error)
      throw new ApiError('Failed to fetch messages', 500)
    }
  }

  static async startChat(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { participantId, orderId, productId, initialMessage } = req.body

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      if (userId === participantId) {
        throw new BadRequestError('Cannot start chat with yourself')
      }

      const chat = await ChatService.startChat({
        userId,
        participantId,
        orderId,
        productId,
        initialMessage
      })

      res.status(201).json({
        success: true,
        data: chat,
        message: 'Chat started successfully'
      })
    } catch (error) {
      logger.error('Failed to start chat:', error)
      throw new ApiError('Failed to start chat', 500)
    }
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { chatId } = req.params
      const { content, type = 'text', metadata } = req.body

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      if (!content?.trim()) {
        throw new BadRequestError('Message content is required')
      }

      const message = await ChatService.sendMessage({
        chatId,
        senderId: userId,
        content: content.trim(),
        type,
        metadata
      })

      res.status(201).json({
        success: true,
        data: message,
        message: 'Message sent successfully'
      })
    } catch (error) {
      logger.error('Failed to send message:', error)
      throw new ApiError('Failed to send message', 500)
    }
  }

  static async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { chatId } = req.params

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      await ChatService.markChatAsRead(chatId, userId)

      res.status(200).json({
        success: true,
        message: 'Chat marked as read'
      })
    } catch (error) {
      logger.error('Failed to mark chat as read:', error)
      throw new ApiError('Failed to update chat', 500)
    }
  }

  static async deleteChat(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { chatId } = req.params

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      await ChatService.deleteChat(chatId, userId)

      res.status(200).json({
        success: true,
        message: 'Chat deleted successfully'
      })
    } catch (error) {
      logger.error('Failed to delete chat:', error)
      throw new ApiError('Failed to delete chat', 500)
    }
  }

  static async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      const count = await ChatService.getUnreadCount(userId)

      res.status(200).json({
        success: true,
        data: { count }
      })
    } catch (error) {
      logger.error('Failed to get unread count:', error)
      throw new ApiError('Failed to get unread count', 500)
    }
  }

  static async uploadAttachment(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const { chatId } = req.params
      
      if (!req.file) {
        throw new BadRequestError('File is required')
      }

      if (!userId) {
        throw new BadRequestError('User authentication required')
      }

      const attachment = await ChatService.uploadAttachment({
        chatId,
        userId,
        file: req.file,
        type: req.body.type || 'file'
      })

      res.status(201).json({
        success: true,
        data: attachment,
        message: 'Attachment uploaded successfully'
      })
    } catch (error) {
      logger.error('Failed to upload attachment:', error)
      throw new ApiError('Failed to upload attachment', 500)
    }
  }
}