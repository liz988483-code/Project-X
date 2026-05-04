import mongoose, { Schema, Document } from 'mongoose'

export type NotificationType = 
  | 'order_created'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'payment_success'
  | 'payment_failed'
  | 'new_message'
  | 'product_back_in_stock'
  | 'price_drop'
  | 'review_request'
  | 'welcome'
  | 'security_alert'
  | 'promotional'
  | 'system'

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app'

export interface INotification extends Document {
  user: mongoose.Types.ObjectId
  type: NotificationType
  title: string
  message: string
  data?: any
  channels: NotificationChannel[]
  priority: 'low' | 'normal' | 'high'
  read: boolean
  readAt?: Date
  sent: boolean
  sentAt?: Date
  scheduledFor?: Date
  expiresAt?: Date
  metadata: {
    source?: string
    actionUrl?: string
    actionLabel?: string
    imageUrl?: string
    badge?: number
    sound?: string
    tags?: string[]
  }
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'order_created',
      'order_shipped',
      'order_delivered',
      'order_cancelled',
      'payment_success',
      'payment_failed',
      'new_message',
      'product_back_in_stock',
      'price_drop',
      'review_request',
      'welcome',
      'security_alert',
      'promotional',
      'system'
    ],
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  data: Schema.Types.Mixed,
  channels: [{
    type: String,
    enum: ['email', 'sms', 'push', 'in_app'],
    required: true
  }],
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal',
    index: true
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: Date,
  sent: {
    type: Boolean,
    default: false,
    index: true
  },
  sentAt: Date,
  scheduledFor: {
    type: Date,
    index: true
  },
  expiresAt: {
    type: Date,
    index: true
  },
  metadata: {
    source: String,
    actionUrl: String,
    actionLabel: String,
    imageUrl: String,
    badge: Number,
    sound: String,
    tags: [String]
  }
}, {
  timestamps: true
})

// Indexes
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 })
NotificationSchema.index({ user: 1, type: 1, createdAt: -1 })
NotificationSchema.index({ scheduledFor: 1, sent: 1 })
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL index

// Virtual for isExpired
NotificationSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false
  return this.expiresAt < new Date()
})

// Virtual for isScheduled
NotificationSchema.virtual('isScheduled').get(function() {
  return !!this.scheduledFor && this.scheduledFor > new Date()
})

// Virtual for shouldSend
NotificationSchema.virtual('shouldSend').get(function() {
  if (this.sent) return false
  if (this.isExpired) return false
  if (this.isScheduled) return false
  return true
})

// Virtual for age in minutes
NotificationSchema.virtual('ageMinutes').get(function() {
  const now = new Date()
  const created = new Date(this.createdAt)
  const diffMs = now.getTime() - created.getTime()
  return Math.floor(diffMs / (1000 * 60))
})

// Method to mark as read
NotificationSchema.methods.markAsRead = function() {
  if (!this.read) {
    this.read = true
    this.readAt = new Date()
  }
}

// Method to mark as sent
NotificationSchema.methods.markAsSent = function(channel: NotificationChannel) {
  if (!this.sent) {
    this.sent = true
    this.sentAt = new Date()
  }
}

// Pre-save middleware
NotificationSchema.pre('save', function(next) {
  // Set default expiration (7 days for normal, 30 days for system)
  if (!this.expiresAt) {
    const expiryDays = this.type === 'system' ? 30 : 7
    this.expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000)
  }
  
  // Update sentAt if sent is true
  if (this.isModified('sent') && this.sent && !this.sentAt) {
    this.sentAt = new Date()
  }
  
  // Update readAt if read is true
  if (this.isModified('read') && this.read && !this.readAt) {
    this.readAt = new Date()
  }
  
  next()
})

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema)