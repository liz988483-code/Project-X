// @ts-nocheck
import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  parent?: mongoose.Types.ObjectId
  ancestors: mongoose.Types.ObjectId[]
  image?: string
  icon?: string
  banner?: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  productCount: number
  createdAt: Date
  updatedAt: Date
  
  // Virtuals
  children: ICategory[]
  fullPath: string
}

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  description: String,
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  ancestors: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  }],
  image: String,
  icon: String,
  banner: String,
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  sortOrder: {
    type: Number,
    default: 0,
    index: true
  },
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  productCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes
CategorySchema.index({ parent: 1, sortOrder: 1 })
CategorySchema.index({ slug: 1, isActive: 1 })
CategorySchema.index({ ancestors: 1, isActive: 1 })

// Virtual for children
CategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
  justOne: false
})

// Virtual for full path
CategorySchema.virtual('fullPath').get(function() {
  return this.ancestors.map((ancestor: any) => ancestor.slug).concat(this.slug).join('/')
})

// Virtual for depth level
CategorySchema.virtual('depth').get(function() {
  return this.ancestors.length
})

// Pre-save middleware to update ancestors
CategorySchema.pre('save', async function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
  }
  
  // Update ancestors if parent changed
  if (this.isModified('parent')) {
    if (this.parent) {
      const parent = await mongoose.model('Category').findById(this.parent)
      if (parent) {
        this.ancestors = [...parent.ancestors, this.parent]
      } else {
        this.ancestors = []
      }
    } else {
      this.ancestors = []
    }
  }
  
  next()
})

// Update ancestors for all children when parent changes
CategorySchema.post('save', async function() {
  if (this.isModified('ancestors') || this.isModified('parent')) {
    const children = await mongoose.model('Category').find({ parent: this._id })
    
    for (const child of children) {
      child.ancestors = [...this.ancestors, this._id]
      await child.save()
    }
  }
})

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema)
