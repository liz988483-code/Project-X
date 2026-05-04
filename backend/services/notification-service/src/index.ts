import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config'
import { errorHandler, loggerMiddleware } from './middleware'
import { notificationRoutes } from './routes'
import { NotificationConsumer } from './consumers/notification.consumer'

const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(loggerMiddleware)

// Routes
app.use('/api/notifications', notificationRoutes)

// Error handling
app.use(errorHandler)

// Start consumers
const consumer = new NotificationConsumer()
consumer.start()

app.listen(config.port, () => {
  console.log(`Notification service running on port ${config.port}`)
})