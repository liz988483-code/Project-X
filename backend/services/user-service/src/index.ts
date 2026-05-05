// @ts-nocheck
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config'
import { connectDB } from './database'
import { errorHandler } from './middleware/error-handler.middleware'
import addressRoutes from './routes/adress.routes'
import { userRouter } from './routes/user.routes'
import profileRoutes from './routes/profile.routes'

const app = express()
const PORT = config.port || 3002

// Connect to database
connectDB()

// Middleware
app.use(helmet())
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/addresses', addressRoutes)
app.use('/api/users', userRouter)
app.use('/api/profile', profileRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'user-service',
    database: 'connected'
  })
})

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`ðŸ‘¤ User Service running on port ${PORT}`)
})
