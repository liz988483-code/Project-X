import mongoose, { Schema, Document } from 'mongoose'

export interface IEvent extends Document {
  eventType: string
  userId?: string
  sessionId?: string
  eventData: any
  timestamp: Date
  userAgent?: string
  ipAddress?: string
  pageUrl?: string
  referrer?: string
  device?: {
    type: string
    os: string
    browser: string
  }
  location?: {
    country: string
    city: string
    region: string
  }
  metadata?: Record<string, any>
}

const EventSchema = new Schema({
  eventType: {
    type: String,
    required: true,
    index: true,
    enum: [
      'page_view',
      'product_view',
      'add_to_cart',
      'remove_from_cart',
      'checkout_started',
      'order_completed',
      'payment_success',
      'payment_failed',
      'user_signup',
      'user_login',
      'search_query',
      'product_purchased',
      'review_submitted',
      'wishlist_added',
      'coupon_applied'
    ]
  },
  userId: {
    type: String,
    index: true
  },
  sessionId: {
    type: String,
    index: true
  },
  eventData: {
    type: Schema.Types.Mixed,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  userAgent: String,
  ipAddress: String,
  pageUrl: String,
  referrer: String,
  device: {
    type: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'bot']
    },
    os: String,
    browser: String
  },
  location: {
    country: String,
    city: String,
    region: String
  },
  metadata: Schema.Types.Mixed
}, {
  timestamps: true
})

// Indexes for performance
EventSchema.index({ eventType: 1, timestamp: -1 })
EventSchema.index({ userId: 1, eventType: 1, timestamp: -1 })
EventSchema.index({ sessionId: 1, timestamp: -1 })
EventSchema.index({ 'eventData.productId': 1, timestamp: -1 })

// TTL index for automatic cleanup (keep events for 2 years)
EventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 })

export const EventModel = mongoose.model<IEvent>('Event', EventSchema)