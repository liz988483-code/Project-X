// @ts-nocheck
import mongoose from 'mongoose'
import { config } from './config/config'

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUrl = config.databaseUrl || 'mongodb://localhost:27017/soko'
    await mongoose.connect(mongoUrl)
    console.log('âœ… Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

