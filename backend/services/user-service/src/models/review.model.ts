import mongoose, { Schema, Document } from 'mongoose'

export interface IReview extends Document {
  product: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  order?: mongoose.Types.ObjectId
  rating: number
  title?: string
  comment: string
  images?: string[]
  likes: number
  dislikes: number
  helpful: number
  verifiedPurchase: boolean
  isApproved: boolean
  isFeatured: boolean
  reportedCount: number
  reportedBy: mongoose.Types.ObjectId[]
  replies: {
    user: mongoose.Types.ObjectId
    comment: string
    isSeller: boolean
    createdAt: Date
    updatedAt: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true
  },
  title: {
    type: String,
    maxlength: 200
  },
  comment: {
    type: String,
    required: true,
    maxlength: 2000
  },
  images: [String],
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  dislikes: {
    type: Number,
    default: 0,
    min: 0
  },
  helpful: {
    type: Number,
    default: 0,
    min: 0
  },
  verifiedPurchase: {
    type: Boolean,
    default: false,
    index: true
  },
  isApproved: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  reportedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  reportedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000
    },
    isSeller: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
})

// Indexes
ReviewSchema.index({ product: 1, user: 1 }, { unique: true })
ReviewSchema.index({ product: 1, rating: 1 })
ReviewSchema.index({ product: 1, createdAt: -1 })
ReviewSchema.index({ user: 1, createdAt: -1 })
ReviewSchema.index({ rating: 1, createdAt: -1 })
ReviewSchema.index({ isApproved: 1, isFeatured: 1 })

// Virtual for total reactions
ReviewSchema.virtual('totalReactions').get(function() {
  return this.likes + this.dislikes
})

// Virtual for helpful percentage
ReviewSchema.virtual('helpfulPercentage').get(function() {
  if (this.totalReactions === 0) return 0
  return Math.round((this.helpful / this.totalReactions) * 100)
})

// Update product rating when review is saved
ReviewSchema.post('save', async function() {
  const Product = mongoose.model('Product')
  
  // Calculate average rating for this product
  const reviews = await mongoose.model('Review').find({ 
    product: this.product,
    isApproved: true 
  })
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length
    
    // Calculate distribution
    const distribution = {
      1: reviews.filter(r => r.rating === 1).length,
      2: reviews.filter(r => r.rating === 2).length,
      3: reviews.filter(r => r.rating === 3).length,
      4: reviews.filter(r => r.rating === 4).length,
      5: reviews.filter(r => r.rating === 5).length
    }
    
    await Product.findByIdAndUpdate(this.product, {
      $set: {
        'ratings.average': averageRating,
        'ratings.count': reviews.length,
        'ratings.distribution': distribution
      }
    })
  }
})

// Update product rating when review is removed
ReviewSchema.post('remove', async function() {
  const Product = mongoose.model('Product')
  
  const reviews = await mongoose.model('Review').find({ 
    product: this.product,
    isApproved: true 
  })
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length
    
    // Calculate distribution
    const distribution = {
      1: reviews.filter(r => r.rating === 1).length,
      2: reviews.filter(r => r.rating === 2).length,
      3: reviews.filter(r => r.rating === 3).length,
      4: reviews.filter(r => r.rating === 4).length,
      5: reviews.filter(r => r.rating === 5).length
    }
    
    await Product.findByIdAndUpdate(this.product, {
      $set: {
        'ratings.average': averageRating,
        'ratings.count': reviews.length,
        'ratings.distribution': distribution
      }
    })
  } else {
    // Reset ratings if no reviews left
    await Product.findByIdAndUpdate(this.product, {
      $set: {
        'ratings.average': 0,
        'ratings.count': 0,
        'ratings.distribution': {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        }
      }
    })
  }
})

export const ReviewModel = mongoose.model<IReview>('Review', ReviewSchema)