// @ts-nocheck
import mongoose, { Schema, Document } from 'mongoose'

export interface IProductVariant {
  name: string
  sku: string
  price: number
  compareAtPrice?: number
  cost?: number
  quantity: number
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
    unit: 'cm' | 'in'
  }
  options: Record<string, string>
  images?: string[]
  barcode?: string
  isActive: boolean
}

export interface IProductAttribute {
  name: string
  value: string
  group?: string
}

export interface IProductSpecification {
  key: string
  value: string
  unit?: string
}

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  shortDescription?: string
  sku: string
  barcode?: string
  brand?: string
  category: mongoose.Types.ObjectId
  subcategory?: mongoose.Types.ObjectId
  seller: mongoose.Types.ObjectId
  price: number
  compareAtPrice?: number
  cost?: number
  quantity: number
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
    unit: 'cm' | 'in'
  }
  images: string[]
  videos?: string[]
  tags: string[]
  attributes: IProductAttribute[]
  specifications: IProductSpecification[]
  variants: IProductVariant[]
  
  // Ratings and Reviews
  ratings: {
    average: number
    count: number
    distribution: {
      1: number
      2: number
      3: number
      4: number
      5: number
    }
  }
  
  // Stats
  salesCount: number
  viewCount: number
  wishlistCount: number
  purchaseCount: number
  
  // Status and Flags
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock' | 'discontinued'
  isFeatured: boolean
  isNew: boolean
  isOnSale: boolean
  hasVariants: boolean
  requiresShipping: boolean
  isDigital: boolean
  isDownloadable: boolean
  
  // SEO
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  
  // Shipping
  shipping: {
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
      unit: 'cm' | 'in'
    }
    freeShipping: boolean
    shippingClass?: string
  }
  
  // Tax
  tax: {
    taxClass: string
    taxStatus: 'taxable' | 'shipping' | 'none'
  }
  
  // Inventory
  inventory: {
    trackInventory: boolean
    stockThreshold: number
    allowBackorders: boolean
    lowStockNotification: boolean
    lowStockLevel: number
  }
  
  // Downloadable products
  downloads?: {
    name: string
    file: string
    downloadLimit: number
    expiryDays: number
  }[]
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  
  // Methods
  isInStock(): boolean
  getStockStatus(): 'in_stock' | 'low_stock' | 'out_of_stock'
  updateStock(quantity: number, type: 'add' | 'subtract'): Promise<void>
}

const ProductVariantSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  cost: {
    type: Number,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'in']
    }
  },
  options: {
    type: Map,
    of: String,
    default: new Map()
  },
  images: [String],
  barcode: String,
  isActive: {
    type: Boolean,
    default: true
  }
})

const ProductAttributeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  group: String
})

const ProductSpecificationSchema = new Schema({
  key: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  unit: String
})

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: String,
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true
  },
  barcode: String,
  brand: {
    type: String,
    index: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  cost: {
    type: Number,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'in']
    }
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length > 0
      },
      message: 'At least one image is required'
    }
  },
  videos: [String],
  tags: {
    type: [String],
    index: true
  },
  attributes: [ProductAttributeSchema],
  specifications: [ProductSpecificationSchema],
  variants: [ProductVariantSchema],
  
  // Ratings and Reviews
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    distribution: {
      1: { type: Number, default: 0, min: 0 },
      2: { type: Number, default: 0, min: 0 },
      3: { type: Number, default: 0, min: 0 },
      4: { type: Number, default: 0, min: 0 },
      5: { type: Number, default: 0, min: 0 }
    }
  },
  
  // Stats
  salesCount: {
    type: Number,
    default: 0,
    min: 0
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  wishlistCount: {
    type: Number,
    default: 0,
    min: 0
  },
  purchaseCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Status and Flags
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'out_of_stock', 'discontinued'],
    default: 'draft',
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isNew: {
    type: Boolean,
    default: false,
    index: true
  },
  isOnSale: {
    type: Boolean,
    default: false,
    index: true
  },
  hasVariants: {
    type: Boolean,
    default: false
  },
  requiresShipping: {
    type: Boolean,
    default: true
  },
  isDigital: {
    type: Boolean,
    default: false
  },
  isDownloadable: {
    type: Boolean,
    default: false
  },
  
  // SEO
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  
  // Shipping
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['cm', 'in']
      }
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingClass: String
  },
  
  // Tax
  tax: {
    taxClass: String,
    taxStatus: {
      type: String,
      enum: ['taxable', 'shipping', 'none'],
      default: 'taxable'
    }
  },
  
  // Inventory
  inventory: {
    trackInventory: {
      type: Boolean,
      default: true
    },
    stockThreshold: {
      type: Number,
      default: 5
    },
    allowBackorders: {
      type: Boolean,
      default: false
    },
    lowStockNotification: {
      type: Boolean,
      default: true
    },
    lowStockLevel: {
      type: Number,
      default: 10
    }
  },
  
  // Downloadable products
  downloads: [{
    name: String,
    file: String,
    downloadLimit: Number,
    expiryDays: Number
  }],
  
  // Timestamps
  publishedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
ProductSchema.index({ seller: 1, status: 1 })
ProductSchema.index({ category: 1, status: 1 })
ProductSchema.index({ price: 1, status: 1 })
ProductSchema.index({ ratings: -1, salesCount: -1 })
ProductSchema.index({ tags: 1, status: 1 })
ProductSchema.index({ createdAt: -1 })
ProductSchema.index({ 'variants.sku': 1 }, { sparse: true })

// Text search index
ProductSchema.index(
  { 
    name: 'text',
    description: 'text',
    tags: 'text',
    brand: 'text',
    'attributes.value': 'text'
  },
  {
    weights: {
      name: 10,
      tags: 5,
      brand: 3,
      description: 2,
      'attributes.value': 1
    },
    name: 'ProductTextIndex'
  }
)

// Virtuals
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100)
  }
  return 0
})

ProductSchema.virtual('inStock').get(function() {
  return this.isInStock()
})

ProductSchema.virtual('stockStatus').get(function() {
  return this.getStockStatus()
})

ProductSchema.virtual('totalQuantity').get(function() {
  if (this.hasVariants && this.variants.length > 0) {
    return this.variants.reduce((sum, variant) => sum + variant.quantity, 0)
  }
  return this.quantity
})

// Methods
ProductSchema.methods.isInStock = function(): boolean {
  if (this.hasVariants) {
    return this.variants.some((variant: IProductVariant) => variant.quantity > 0)
  }
  return this.quantity > 0 || this.inventory.allowBackorders
}

ProductSchema.methods.getStockStatus = function(): 'in_stock' | 'low_stock' | 'out_of_stock' {
  const totalQty = this.totalQuantity
  
  if (totalQty <= 0) return 'out_of_stock'
  if (totalQty <= this.inventory.lowStockLevel) return 'low_stock'
  return 'in_stock'
}

ProductSchema.methods.updateStock = async function(quantity: number, type: 'add' | 'subtract' = 'subtract'): Promise<void> {
  if (this.hasVariants) {
    throw new Error('Cannot update stock directly for products with variants')
  }
  
  if (type === 'subtract') {
    if (this.quantity < quantity && !this.inventory.allowBackorders) {
      throw new Error('Insufficient stock')
    }
    this.quantity -= quantity
  } else {
    this.quantity += quantity
  }
  
  // Update status if needed
  if (this.quantity <= 0 && this.status !== 'out_of_stock') {
    this.status = 'out_of_stock'
  } else if (this.quantity > 0 && this.status === 'out_of_stock') {
    this.status = 'active'
  }
  
  await this.save()
}

// Middleware
ProductSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
  }
  
  // Update hasVariants flag
  this.hasVariants = this.variants && this.variants.length > 0
  
  // Update stock status
  if (this.quantity <= 0 && this.status !== 'out_of_stock' && !this.inventory.allowBackorders) {
    this.status = 'out_of_stock'
  }
  
  next()
})

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema)
