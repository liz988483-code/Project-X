import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config'
import { connectDB } from './database'
import { errorHandler } from './middleware/error-handler.middleware'
import productRoutes from './routes/product.routes'
import categoryRoutes from './routes/category.routes'
import reviewRoutes from './routes/review.routes'

const app = express()
const PORT = config.port || 3003

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
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/reviews', reviewRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'product-service',
    database: 'connected'
  })
})

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`📦 Product Service running on port ${PORT}`)
})