import { Request, Response } from 'express'
import { Product } from '../models/product.model'
import { Category } from '../models/category.model'
import { ApiError, NotFoundError, BadRequestError } from '../../../shared/utils/api-error'
import { logger } from '../../../shared/utils/logger'

export class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        category, 
        minPrice, 
        maxPrice,
        sortBy = 'createdAt:desc',
        search
      } = req.query

      const skip = (Number(page) - 1) * Number(limit)
      
      // Build query
      const query: any = { status: 'active' }
      
      if (category) {
        query.category = category
      }
      
      if (minPrice || maxPrice) {
        query.price = {}
        if (minPrice) query.price.$gte = Number(minPrice)
        if (maxPrice) query.price.$lte = Number(maxPrice)
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } }
        ]
      }

      // Sort
      let sort: any = { createdAt: -1 }
      if (sortBy) {
        const [field, order] = String(sortBy).split(':')
        sort = { [field]: order === 'asc' ? 1 : -1 }
      }

      // Execute query
      const [products, total] = await Promise.all([
        Product.find(query)
          .sort(sort)
          .skip(skip)
          .limit(Number(limit))
          .populate('category', 'name slug')
          .populate('seller', 'storeName rating'),
        Product.countDocuments(query)
      ])

      res.json({
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } catch (error) {
      logger.error('Get products error:', error)
      throw error
    }
  }

  static async getProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      
      const product = await Product.findById(id)
        .populate('category', 'name slug')
        .populate('seller', 'storeName rating totalSales')
      
      if (!product) {
        throw new NotFoundError('Product not found')
      }

      res.json({ product })
    } catch (error) {
      logger.error('Get product error:', error)
      throw error
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const sellerId = req.user?.id
      
      if (!sellerId) {
        throw new BadRequestError('Seller ID required')
      }

      const productData = {
        ...req.body,
        seller: sellerId,
        status: 'active'
      }

      const product = await Product.create(productData)

      // Update category product count
      await Category.findByIdAndUpdate(product.category, {
        $inc: { productCount: 1 }
      })

      res.status(201).json({ product })
    } catch (error) {
      logger.error('Create product error:', error)
      throw error
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      const sellerId = req.user?.id

      // Check if product exists and belongs to seller
      const product = await Product.findOne({ 
        _id: id, 
        seller: sellerId 
      })

      if (!product) {
        throw new NotFoundError('Product not found or unauthorized')
      }

      // Update product
      Object.assign(product, req.body)
      await product.save()

      res.json({ product })
    } catch (error) {
      logger.error('Update product error:', error)
      throw error
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      const sellerId = req.user?.id

      const product = await Product.findOne({ 
        _id: id, 
        seller: sellerId 
      })

      if (!product) {
        throw new NotFoundError('Product not found or unauthorized')
      }

      // Soft delete
      product.status = 'deleted'
      await product.save()

      // Update category product count
      await Category.findByIdAndUpdate(product.category, {
        $inc: { productCount: -1 }
      })

      res.json({ message: 'Product deleted successfully' })
    } catch (error) {
      logger.error('Delete product error:', error)
      throw error
    }
  }

  static async getSellerProducts(req: Request, res: Response) {
    try {
      const { sellerId } = req.params
      const { page = 1, limit = 20 } = req.query
      
      const skip = (Number(page) - 1) * Number(limit)

      const [products, total] = await Promise.all([
        Product.find({ seller: sellerId, status: 'active' })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit))
          .populate('category', 'name'),
        Product.countDocuments({ seller: sellerId, status: 'active' })
      ])

      res.json({
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      })
    } catch (error) {
      logger.error('Get seller products error:', error)
      throw error
    }
  }
}