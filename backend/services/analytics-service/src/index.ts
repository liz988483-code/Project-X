import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config'
import { connectDB } from './database'
import { errorHandler, loggerMiddleware } from './middleware'
import { analyticsRoutes } from './routes'

const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(loggerMiddleware)

// Routes
app.use('/api/analytics', analyticsRoutes)

// Error handling
app.use(errorHandler)

// Database connection
connectDB()

app.listen(config.port, () => {
  console.log(`Analytics service running on port ${config.port}`)
})