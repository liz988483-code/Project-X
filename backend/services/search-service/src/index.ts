import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config'
import { connectElasticsearch } from './elasticsearch'
import { errorHandler, loggerMiddleware } from './middleware'
import { searchRoutes } from './routes'

const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(express.json({ limit: '10mb' }))
app.use(loggerMiddleware)

// Routes
app.use('/api/search', searchRoutes)

// Error handling
app.use(errorHandler)

// Elasticsearch connection
connectElasticsearch()

app.listen(config.port, () => {
  console.log(`Search service running on port ${config.port}`)
})