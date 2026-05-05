// @ts-nocheck
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model'
import { SessionModel } from '../models/session.model'
import { config } from '../config/config'

// Custom error classes
class ApiError extends Error {
  statusCode: number
  
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400)
  }
}

class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401)
  }
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
      }
    }
  }
}

// Helper function to get JWT secret
const getJwtSecret = (): string => {
  const secret = config.jwt.secret
  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }
  return secret
}

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name, phone, role = 'customer' } = req.body

      // Check if user exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        throw new BadRequestError('User already exists')
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        name,
        phone: phone || undefined,
        role,
        emailVerified: false,
        phoneVerified: false,
      })

      await user.save()

      // Get JWT secret
      const jwtSecret = getJwtSecret()

      // Generate tokens - FIXED: Cast expiresIn to number or string
      const tokenPayload = { 
        id: user._id.toString(), 
        email: user.email, 
        role: user.role 
      }

      // Parse expiresIn string to seconds
      const expiresInStr = config.jwt.expiresIn
      let expiresInSeconds: number
      
      if (expiresInStr.includes('d')) {
        expiresInSeconds = parseInt(expiresInStr) * 24 * 60 * 60
      } else if (expiresInStr.includes('h')) {
        expiresInSeconds = parseInt(expiresInStr) * 60 * 60
      } else if (expiresInStr.includes('m')) {
        expiresInSeconds = parseInt(expiresInStr) * 60
      } else if (expiresInStr.includes('s')) {
        expiresInSeconds = parseInt(expiresInStr)
      } else {
        expiresInSeconds = 15 * 60 // Default 15 minutes
      }

      const token = jwt.sign(
        tokenPayload,
        jwtSecret,
        { 
          expiresIn: expiresInSeconds // Use number instead of string
        }
      )

      const refreshExpiresInStr = config.jwt.refreshExpiresIn
      let refreshExpiresInSeconds: number
      
      if (refreshExpiresInStr.includes('d')) {
        refreshExpiresInSeconds = parseInt(refreshExpiresInStr) * 24 * 60 * 60
      } else if (refreshExpiresInStr.includes('h')) {
        refreshExpiresInSeconds = parseInt(refreshExpiresInStr) * 60 * 60
      } else if (refreshExpiresInStr.includes('m')) {
        refreshExpiresInSeconds = parseInt(refreshExpiresInStr) * 60
      } else if (refreshExpiresInStr.includes('s')) {
        refreshExpiresInSeconds = parseInt(refreshExpiresInStr)
      } else {
        refreshExpiresInSeconds = 7 * 24 * 60 * 60 // Default 7 days
      }

      const refreshToken = jwt.sign(
        { id: user._id.toString() },
        jwtSecret,
        { 
          expiresIn: refreshExpiresInSeconds // Use number instead of string
        }
      )

      // Calculate expiration dates
      const expiresAt = new Date(Date.now() + expiresInSeconds * 1000)
      const refreshExpiresAt = new Date(Date.now() + refreshExpiresInSeconds * 1000)

      // Create session
      await SessionModel.create({
        user: user._id,
        sessionToken: token,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
        refreshExpiresAt: refreshExpiresAt,
        isValid: true
      })

      // Prepare user response
      const userResponse = user.toObject()
      delete (userResponse as any).password

      res.status(201).json({
        user: userResponse,
        token,
        refreshToken,
        expiresIn: expiresInSeconds // Return in seconds
      })
    } catch (error: any) {
      console.error('Registration error:', error)
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Registration failed' })
      }
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      // Find user with password
      const user = await User.findOne({ email }).select('+password')
      if (!user) {
        throw new UnauthorizedError('Invalid credentials')
      }

      // Check if account is locked
      if (user.lockUntil && user.lockUntil > new Date()) {
        throw new UnauthorizedError('Account is temporarily locked. Try again later.')
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        // Increment login attempts
        await user.incrementLoginAttempts()
        throw new UnauthorizedError('Invalid credentials')
      }

      // Reset login attempts on successful login
      await user.resetLoginAttempts()

      // Get JWT secret
      const jwtSecret = getJwtSecret()

      // Parse expiresIn string to seconds
      const expiresInStr = config.jwt.expiresIn
      let expiresInSeconds: number
      
      if (expiresInStr.includes('d')) {
        expiresInSeconds = parseInt(expiresInStr) * 24 * 60 * 60
      } else if (expiresInStr.includes('h')) {
        expiresInSeconds = parseInt(expiresInStr) * 60 * 60
      } else if (expiresInStr.includes('m')) {
        expiresInSeconds = parseInt(expiresInStr) * 60
      } else if (expiresInStr.includes('s')) {
        expiresInSeconds = parseInt(expiresInStr)
      } else {
        expiresInSeconds = 15 * 60 // Default 15 minutes
      }

      const refreshExpiresInStr = config.jwt.refreshExpiresIn
      let refreshExpiresInSeconds: number
      
      if (refreshExpiresInStr.includes('d')) {
        refreshExpiresInSeconds = parseInt(refreshExpiresInStr) * 24 * 60 * 60
      } else if (refreshExpiresInStr.includes('h')) {
        refreshExpiresInSeconds = parseInt(refreshExpiresInStr) * 60 * 60
      } else if (refreshExpiresInStr.includes('m')) {
        refreshExpiresInSeconds = parseInt(refreshExpiresInStr) * 60
      } else if (refreshExpiresInStr.includes('s')) {
        refreshExpiresInSeconds = parseInt(refreshExpiresInStr)
      } else {
        refreshExpiresInSeconds = 7 * 24 * 60 * 60 // Default 7 days
      }

      // Generate tokens
      const tokenPayload = { 
        id: user._id.toString(), 
        email: user.email, 
        role: user.role 
      }

      const token = jwt.sign(
        tokenPayload,
        jwtSecret,
        { expiresIn: expiresInSeconds }
      )

      const refreshToken = jwt.sign(
        { id: user._id.toString() },
        jwtSecret,
        { expiresIn: refreshExpiresInSeconds }
      )

      // Calculate expiration dates
      const expiresAt = new Date(Date.now() + expiresInSeconds * 1000)
      const refreshExpiresAt = new Date(Date.now() + refreshExpiresInSeconds * 1000)

      // Create session
      await SessionModel.create({
        user: user._id,
        sessionToken: token,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
        refreshExpiresAt: refreshExpiresAt,
        isValid: true
      })

      // Prepare user response
      const userResponse = user.toObject()
      delete (userResponse as any).password

      res.json({
        user: userResponse,
        token,
        refreshToken,
        expiresIn: expiresInSeconds
      })
    } catch (error: any) {
      console.error('Login error:', error)
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Login failed' })
      }
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.body.refreshToken
      
      if (refreshToken) {
        await SessionModel.deleteOne({ refreshToken })
      }

      res.json({ message: 'Logged out successfully' })
    } catch (error: any) {
      console.error('Logout error:', error)
      res.status(500).json({ error: 'Logout failed' })
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        throw new BadRequestError('Refresh token is required')
      }

      // Get JWT secret
      const jwtSecret = getJwtSecret()

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, jwtSecret) as any

      // Check session
      const session = await SessionModel.findOne({ 
        refreshToken,
        isValid: true
      })

      if (!session || session.refreshExpiresAt < new Date()) {
        throw new UnauthorizedError('Invalid or expired refresh token')
      }

      // Get user
      const user = await User.findById(decoded.id)
      if (!user) {
        throw new UnauthorizedError('User not found')
      }

      // Check if user is active
      if (user.status !== 'active') {
        throw new UnauthorizedError('Account is not active')
      }

      // Parse expiresIn string to seconds
      const expiresInStr = config.jwt.expiresIn
      let expiresInSeconds: number
      
      if (expiresInStr.includes('d')) {
        expiresInSeconds = parseInt(expiresInStr) * 24 * 60 * 60
      } else if (expiresInStr.includes('h')) {
        expiresInSeconds = parseInt(expiresInStr) * 60 * 60
      } else if (expiresInStr.includes('m')) {
        expiresInSeconds = parseInt(expiresInStr) * 60
      } else if (expiresInStr.includes('s')) {
        expiresInSeconds = parseInt(expiresInStr)
      } else {
        expiresInSeconds = 15 * 60 // Default 15 minutes
      }

      // Generate new access token
      const newToken = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: expiresInSeconds }
      )

      // Calculate new expiration date
      const expiresAt = new Date(Date.now() + expiresInSeconds * 1000)

      // Update session with new token
      session.sessionToken = newToken
      session.expiresAt = expiresAt
      await session.save()

      res.json({
        token: newToken,
        refreshToken, // Return same refresh token
        expiresIn: expiresInSeconds
      })
    } catch (error: any) {
      console.error('Refresh token error:', error)
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Token refresh failed' })
      }
    }
  }

  static async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      
      if (!userId) {
        throw new UnauthorizedError('Not authenticated')
      }

      const user = await User.findById(userId)
        .select('-password -twoFactorSecret -verificationToken -resetPasswordToken')

      if (!user) {
        throw new UnauthorizedError('User not found')
      }

      res.json({ user })
    } catch (error: any) {
      console.error('Get current user error:', error)
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Failed to get user' })
      }
    }
  }
}
