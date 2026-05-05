// @ts-nocheck
import mongoose, { Schema, Document, Types, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUserAddress {
  type: 'shipping' | 'billing'
  isDefault: boolean
  label?: string
  contactName: string
  contactPhone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  country: string
  postalCode: string
  deliveryInstructions?: string
}

export interface IUserPreferences {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  language: string
  currency: string
  theme: 'light' | 'dark' | 'system'
  marketingEmails: boolean
}

export interface ISellerProfile {
  storeName: string
  storeSlug: string
  storeDescription?: string
  storeLogo?: string
  storeBanner?: string
  storeRating: number
  totalReviews: number
  totalProducts: number
  totalSales: number
  totalRevenue: number
  verified: boolean
  verificationStatus: 'pending' | 'verified' | 'rejected'
  storeAddress?: any
  contactInfo?: any
  socialLinks?: any
  storePolicies?: any
}

export interface IUser extends Document {
  email: string
  password: string
  name: string
  avatar?: string
  phone?: string
  role: 'customer' | 'seller' | 'admin'
  status: 'active' | 'inactive' | 'suspended' | 'banned'
  
  // Authentication
  emailVerified: boolean
  verificationToken?: string
  verificationTokenExpires?: Date
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  
  // Security
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  lastLoginAt?: Date
  lastPasswordChange: Date
  loginAttempts: number
  lockUntil?: Date
  
  // Profile
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  bio?: string
  addresses: IUserAddress[]
  preferences: IUserPreferences
  
  // Seller specific
  sellerProfile?: ISellerProfile
  
  // Stats
  totalOrders: number
  totalSpent: number
  wishlistItems: Types.ObjectId[]
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  verifiedAt?: Date
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>
  isAccountLocked(): boolean
  incrementLoginAttempts(): Promise<void>
  resetLoginAttempts(): Promise<void>
}

// Interface for User Model static methods
export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>
  findByResetToken(token: string): Promise<IUser | null>
  findByVerificationToken(token: string): Promise<IUser | null>
}

const UserAddressSchema = new Schema({
  type: {
    type: String,
    enum: ['shipping', 'billing'],
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  label: String,
  contactName: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: String,
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  deliveryInstructions: String
})

const UserPreferencesSchema = new Schema({
  emailNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    default: 'en'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'light'
  },
  marketingEmails: {
    type: Boolean,
    default: false
  }
})

const SellerProfileSchema = new Schema({
  storeName: {
    type: String,
    required: true,
    unique: true
  },
  storeSlug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  storeDescription: String,
  storeLogo: String,
  storeBanner: String,
  storeRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  totalProducts: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSales: {
    type: Number,
    default: 0,
    min: 0
  },
  totalRevenue: {
    type: Number,
    default: 0,
    min: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  storeAddress: Schema.Types.Mixed,
  contactInfo: Schema.Types.Mixed,
  socialLinks: Schema.Types.Mixed,
  storePolicies: Schema.Types.Mixed
})

const UserSchema = new Schema<IUser, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: String,
  phone: String,
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'banned'],
    default: 'active'
  },
  
  // Authentication
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Security
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  lastLoginAt: Date,
  lastPasswordChange: {
    type: Date,
    default: Date.now
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Profile
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  bio: {
    type: String,
    maxlength: 500
  },
  addresses: [UserAddressSchema],
  preferences: {
    type: UserPreferencesSchema,
    default: () => ({})
  },
  
  // Seller specific
  sellerProfile: SellerProfileSchema,
  
  // Stats
  totalOrders: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  wishlistItems: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  // Timestamps
  verifiedAt: Date
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      // Create a new object without the sensitive fields
      const { password, twoFactorSecret, verificationToken, verificationTokenExpires, resetPasswordToken, resetPasswordExpires, __v, ...safeRet } = ret
      return safeRet
    }
  }
})

// Virtual for full name
UserSchema.virtual('fullName').get(function(this: IUser) {
  return this.name
})

// Virtual for isSeller
UserSchema.virtual('isSeller').get(function(this: IUser) {
  return this.role === 'seller' || this.role === 'admin'
})

// Virtual for isAdmin
UserSchema.virtual('isAdmin').get(function(this: IUser) {
  return this.role === 'admin'
})

// Virtual for age
UserSchema.virtual('age').get(function(this: IUser) {
  if (!this.dateOfBirth) return null
  const today = new Date()
  const birthDate = new Date(this.dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
})

// Hash password before saving
UserSchema.pre('save', async function(next) {
  const user = this
  
  if (!user.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    user.password = await bcrypt.hash(user.password, salt)
    user.lastPasswordChange = new Date()
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    const user = this as IUser
    
    // If password is not selected, we need to fetch it
    if (!user.password) {
      const User = mongoose.model<IUser, IUserModel>('User')
      const userWithPassword = await User.findById(user._id).select('+password').exec()
      
      if (!userWithPassword) return false
      
      return await bcrypt.compare(candidatePassword, userWithPassword.password)
    }
    
    return await bcrypt.compare(candidatePassword, user.password)
  } catch (error) {
    return false
  }
}

// Check if account is locked
UserSchema.methods.isAccountLocked = function(): boolean {
  const user = this as IUser
  return !!(user.lockUntil && user.lockUntil > new Date())
}

// Increment login attempts
UserSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  const user = this as IUser
  
  // If we have a previous lock that has expired, restart at 1
  if (user.lockUntil && user.lockUntil < new Date()) {
    user.loginAttempts = 1
    user.lockUntil = undefined
  } else {
    user.loginAttempts += 1
  }
  
  // Lock the account if we've reached max attempts
  if (user.loginAttempts >= 5) {
    user.lockUntil = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  }
  
  await user.save()
}

// Reset login attempts on successful login
UserSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  const user = this as IUser
  user.loginAttempts = 0
  user.lockUntil = undefined
  await user.save()
}

// Static methods
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email }).select('+password')
}

UserSchema.statics.findByResetToken = function(token: string) {
  return this.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  })
}

UserSchema.statics.findByVerificationToken = function(token: string) {
  return this.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() }
  })
}

// Create and export the model
const User: IUserModel = mongoose.model<IUser, IUserModel>('User', UserSchema)
export { User, IUser }
