// @ts-nocheck
import mongoose, { Schema, Document } from 'mongoose'

export interface ISession extends Document {
  user: mongoose.Types.ObjectId
  sessionToken: string
  refreshToken: string
  userAgent?: string
  ipAddress?: string
  deviceInfo?: {
    type: 'mobile' | 'tablet' | 'desktop' | 'bot'
    os?: string
    browser?: string
    isMobile?: boolean
  }
  locationInfo?: {
    country?: string
    city?: string
    region?: string
    timezone?: string
  }
  isValid: boolean
  expiresAt: Date
  refreshExpiresAt: Date
  lastActivityAt: Date
  createdAt: Date
  updatedAt: Date
}

const SessionSchema = new Schema<ISession>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
    sessionToken: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    refreshToken: { 
      type: String, 
      required: true, 
      unique: true 
    },
    userAgent: String,
    ipAddress: String,
    deviceInfo: {
      type: {
        type: String,
        enum: ['mobile', 'tablet', 'desktop', 'bot']
      },
      os: String,
      browser: String,
      isMobile: Boolean
    },
    locationInfo: {
      country: String,
      city: String,
      region: String,
      timezone: String
    },
    isValid: {
      type: Boolean,
      default: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    refreshExpiresAt: {
      type: Date,
      required: true
    },
    lastActivityAt: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true 
  }
)

// ---------------------------------------------
// Indexes
// ---------------------------------------------
SessionSchema.index({ user: 1, isValid: 1 })
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
SessionSchema.index({ createdAt: -1 })
SessionSchema.index({ refreshToken: 1 })

// ---------------------------------------------
// Virtuals
// ---------------------------------------------
SessionSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date()
})

SessionSchema.virtual('ageHours').get(function() {
  const now = new Date()
  const diffMs = now.getTime() - this.createdAt.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60))
})

// ---------------------------------------------
// Model
// ---------------------------------------------
export const SessionModel = mongoose.model<ISession>('Session', SessionSchema)

