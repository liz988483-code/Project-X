import { ChatModel, MessageModel } from '../models'
import { SocketService } from '../sockets/chat.socket'
import { FileService } from './file.service'
import { MessageBroker } from '../../../message-broker'
import { logger } from '../../../shared/utils/logger'
import { connectRedis } from '../database/redis'
import mongoose from 'mongoose'

export class ChatService {
  static async getUserChats(options: {
    userId: string
    page: number
    limit: number
    unreadOnly: boolean
  }) {
    const query: any = {
      participants: options.userId,
      archivedFor: { $ne: options.userId }
    }

    if (options.unreadOnly) {
      query[`unreadBy.${options.userId}`] = { $gt: 0 }
    }

    const skip = (options.page - 1) * options.limit

    const [chats, total] = await Promise.all([
      ChatModel.find(query)
        .populate('participants', 'name email avatar role')
        .populate('lastMessage')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(options.limit),
      ChatModel.countDocuments(query)
    ])

    // Get unread counts for each chat
    const chatsWithUnread = chats.map(chat => {
      const chatObj = chat.toObject()
      chatObj.unreadCount = chat.unreadBy.get(options.userId) || 0
      return chatObj
    })

    return {
      chats: chatsWithUnread,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    }
  }

  static async getChatMessages(options: {
    chatId: string
    userId: string
    page: number
    limit: number
    before?: Date
  }) {
    // Verify user has access to chat
    const chat = await ChatModel.findOne({
      _id: options.chatId,
      participants: options.userId
    })

    if (!chat) {
      throw new NotFoundError('Chat not found or access denied')
    }

    const query: any = { chatId: options.chatId }
    
    if (options.before) {
      query.createdAt = { $lt: options.before }
    }

    const skip = (options.page - 1) * options.limit

    const [messages, total] = await Promise.all([
      MessageModel.find(query)
        .populate('sender', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(options.limit),
      MessageModel.countDocuments(query)
    ])

    // Mark messages as read
    await this.markMessagesAsRead(options.chatId, options.userId)

    return {
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    }
  }

  static async startChat(options: {
    userId: string
    participantId: string
    orderId?: string
    productId?: string
    initialMessage?: string
  }) {
    const session = await mongoose.startSession()
    
    try {
      session.startTransaction()

      // Check if chat already exists
      let chat = await ChatModel.findOne({
        participants: { $all: [options.userId, options.participantId] },
        orderId: options.orderId || null,
        productId: options.productId || null
      }).session(session)

      if (!chat) {
        // Create new chat
        chat = await ChatModel.create([{
          participants: [options.userId, options.participantId],
          orderId: options.orderId,
          productId: options.productId,
          createdBy: options.userId,
          unreadBy: new Map([
            [options.userId, 0],
            [options.participantId, 0]
          ])
        }], { session })[0]
      }

      // Send initial message if provided
      if (options.initialMessage) {
        const message = await MessageModel.create([{
          chatId: chat._id,
          sender: options.userId,
          content: options.initialMessage,
          type: 'text'
        }], { session })

        // Update chat last message
        chat.lastMessage = message[0]._id
        chat.updatedAt = new Date()
        chat.unreadBy.set(options.participantId, (chat.unreadBy.get(options.participantId) || 0) + 1)
        await chat.save({ session })

        // Send via socket
        SocketService.sendMessage({
          chatId: chat._id.toString(),
          message: message[0],
          recipientId: options.participantId
        })

        // Send notification
        await MessageBroker.publish('chat_events', {
          type: 'message_sent',
          data: {
            chatId: chat._id,
            message: message[0],
            senderId: options.userId,
            recipientId: options.participantId
          }
        })
      }

      await session.commitTransaction()

      return chat
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  static async sendMessage(options: {
    chatId: string
    senderId: string
    content: string
    type?: string
    metadata?: Record<string, any>
  }) {
    const session = await mongoose.startSession()
    
    try {
      session.startTransaction()

      // Verify chat exists and sender is participant
      const chat = await ChatModel.findOne({
        _id: options.chatId,
        participants: options.senderId
      }).session(session)

      if (!chat) {
        throw new NotFoundError('Chat not found or access denied')
      }

      // Create message
      const message = await MessageModel.create([{
        chatId: options.chatId,
        sender: options.senderId,
        content: options.content,
        type: options.type || 'text',
        metadata: options.metadata
      }], { session })[0]

      // Update chat
      chat.lastMessage = message._id
      chat.updatedAt = new Date()
      
      // Increment unread count for all participants except sender
      chat.participants.forEach(participantId => {
        if (participantId.toString() !== options.senderId) {
          const current = chat.unreadBy.get(participantId.toString()) || 0
          chat.unreadBy.set(participantId.toString(), current + 1)
        }
      })

      await chat.save({ session })

      // Send via socket to all participants
      const populatedMessage = await MessageModel.findById(message._id)
        .populate('sender', 'name avatar')
        .session(session)

      chat.participants.forEach(participantId => {
        if (participantId.toString() !== options.senderId) {
          SocketService.sendMessage({
            chatId: options.chatId,
            message: populatedMessage,
            recipientId: participantId.toString()
          })
        }
      })

      await session.commitTransaction()

      // Send notifications
      await this.sendMessageNotifications(chat, populatedMessage)

      return populatedMessage
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  static async markChatAsRead(chatId: string, userId: string) {
    const chat = await ChatModel.findOne({
      _id: chatId,
      participants: userId
    })

    if (!chat) {
      throw new NotFoundError('Chat not found')
    }

    chat.unreadBy.set(userId, 0)
    await chat.save()

    // Clear notification badge
    SocketService.updateUnreadCount(userId)
  }

  static async markMessagesAsRead(chatId: string, userId: string) {
    await MessageModel.updateMany(
      { 
        chatId, 
        sender: { $ne: userId },
        readBy: { $ne: userId }
      },
      { $addToSet: { readBy: userId } }
    )
  }

  static async getUnreadCount(userId: string) {
    const chats = await ChatModel.find({
      participants: userId,
      [`unreadBy.${userId}`]: { $gt: 0 }
    })

    return chats.reduce((total, chat) => {
      return total + (chat.unreadBy.get(userId) || 0)
    }, 0)
  }

  static async deleteChat(chatId: string, userId: string) {
    const chat = await ChatModel.findOne({
      _id: chatId,
      participants: userId
    })

    if (!chat) {
      throw new NotFoundError('Chat not found')
    }

    // Archive chat for this user
    if (!chat.archivedFor) {
      chat.archivedFor = []
    }
    
    if (!chat.archivedFor.includes(userId)) {
      chat.archivedFor.push(userId)
      await chat.save()
    }

    // If all participants have archived, delete chat
    if (chat.archivedFor.length === chat.participants.length) {
      await MessageModel.deleteMany({ chatId })
      await chat.deleteOne()
    }
  }

  static async uploadAttachment(options: {
    chatId: string
    userId: string
    file: Express.Multer.File
    type: string
  }) {
    // Verify chat exists and user is participant
    const chat = await ChatModel.findOne({
      _id: options.chatId,
      participants: options.userId
    })

    if (!chat) {
      throw new NotFoundError('Chat not found or access denied')
    }

    // Upload file
    const uploadResult = await FileService.uploadFile(options.file, {
      folder: `chat/${options.chatId}`,
      userId: options.userId
    })

    // Send as message
    const message = await this.sendMessage({
      chatId: options.chatId,
      senderId: options.userId,
      content: uploadResult.url,
      type: options.type,
      metadata: {
        fileName: options.file.originalname,
        fileSize: options.file.size,
        mimeType: options.file.mimetype,
        uploadId: uploadResult.id
      }
    })

    return message
  }

  private static async sendMessageNotifications(chat: any, message: any) {
    try {
      const recipients = chat.participants.filter(
        (p: string) => p.toString() !== message.sender._id.toString()
      )

      for (const recipientId of recipients) {
        await MessageBroker.publish('notification_events', {
          type: 'new_message',
          data: {
            userId: recipientId,
            chatId: chat._id,
            senderName: message.sender.name,
            message: message.content.substring(0, 100),
            timestamp: new Date()
          }
        })
      }
    } catch (error) {
      logger.error('Failed to send message notifications:', error)
    }
  }

  static async getActiveChats(userId: string, limit: number = 10) {
    const redis = await connectRedis()
    const key = `chat:active:${userId}`
    
    const cached = await redis.get(key)
    if (cached) {
      return JSON.parse(cached)
    }

    const chats = await ChatModel.find({
      participants: userId,
      archivedFor: { $ne: userId },
      updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    })
    .populate('participants', 'name avatar')
    .populate('lastMessage')
    .sort({ updatedAt: -1 })
    .limit(limit)

    await redis.setex(key, 60, JSON.stringify(chats)) // Cache for 1 minute

    return chats
  }
}