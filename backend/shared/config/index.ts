// backend/shared/config/index.ts
export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-development-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/soko'
    },
    postgres: {
      uri: process.env.DATABASE_URL || 'postgresql://soko_user:soko_password@localhost:5432/soko_db'
    },
    redis: {
      uri: process.env.REDIS_URL || 'redis://localhost:6379'
    }
  },
  services: {
    user: {
      url: process.env.USER_SERVICE_URL || 'http://localhost:3002'
    },
    product: {
      url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003'
    },
    cart: {
      url: process.env.CART_SERVICE_URL || 'http://localhost:3004'
    }
  }
};