import { Request, Response } from 'express'
import { SearchService } from '../services/elasticsearch.service'
import { IndexerService } from '../services/indexer.service'
import { ApiError, BadRequestError } from '../../../shared/utils/api-error'
import { logger } from '../../../shared/utils/logger'

export class SearchController {
  static async searchProducts(req: Request, res: Response) {
    try {
      const { 
        q = '',
        category,
        seller,
        minPrice,
        maxPrice,
        rating,
        inStock,
        sortBy = 'relevance',
        page = 1,
        limit = 20,
        filters,
        location,
        attributes
      } = req.query

      const searchOptions = {
        query: q as string,
        category: category as string,
        seller: seller as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        rating: rating ? parseFloat(rating as string) : undefined,
        inStock: inStock === 'true',
        sortBy: sortBy as string,
        page: Math.max(1, parseInt(page as string)),
        limit: Math.min(100, Math.max(1, parseInt(limit as string))),
        filters: filters ? JSON.parse(filters as string) : {},
        location: location as string,
        attributes: attributes ? JSON.parse(attributes as string) : {}
      }

      const results = await SearchService.searchProducts(searchOptions)

      res.status(200).json({
        success: true,
        data: results
      })
    } catch (error) {
      logger.error('Search failed:', error)
      throw new ApiError('Search failed', 500)
    }
  }

  static async searchAutocomplete(req: Request, res: Response) {
    try {
      const { q = '', limit = 10 } = req.query

      if (!q || q.toString().trim().length < 2) {
        throw new BadRequestError('Query must be at least 2 characters')
      }

      const suggestions = await SearchService.autocomplete(
        q.toString().trim(),
        parseInt(limit as string)
      )

      res.status(200).json({
        success: true,
        data: suggestions
      })
    } catch (error) {
      logger.error('Autocomplete failed:', error)
      throw new ApiError('Autocomplete failed', 500)
    }
  }

  static async searchSellers(req: Request, res: Response) {
    try {
      const { 
        q = '',
        location,
        rating,
        verified,
        page = 1,
        limit = 20 
      } = req.query

      const results = await SearchService.searchSellers({
        query: q as string,
        location: location as string,
        rating: rating ? parseFloat(rating as string) : undefined,
        verified: verified === 'true',
        page: Math.max(1, parseInt(page as string)),
        limit: Math.min(50, Math.max(1, parseInt(limit as string)))
      })

      res.status(200).json({
        success: true,
        data: results
      })
    } catch (error) {
      logger.error('Seller search failed:', error)
      throw new ApiError('Seller search failed', 500)
    }
  }

  static async getSearchAnalytics(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query

      const analytics = await SearchService.getSearchAnalytics({
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      })

      res.status(200).json({
        success: true,
        data: analytics
      })
    } catch (error) {
      logger.error('Failed to get search analytics:', error)
      throw new ApiError('Failed to get search analytics', 500)
    }
  }

  static async reindexProducts(req: Request, res: Response) {
    try {
      // Only admins can trigger reindexing
      if (!req.user?.isAdmin) {
        throw new BadRequestError('Unauthorized')
      }

      const { productIds, fullReindex = false } = req.body

      const result = await IndexerService.reindexProducts({
        productIds,
        fullReindex
      })

      res.status(200).json({
        success: true,
        data: result,
        message: `Reindexing ${fullReindex ? 'all products' : 'selected products'} started`
      })
    } catch (error) {
      logger.error('Reindexing failed:', error)
      throw new ApiError('Reindexing failed', 500)
    }
  }

  static async getIndexStatus(req: Request, res: Response) {
    try {
      if (!req.user?.isAdmin) {
        throw new BadRequestError('Unauthorized')
      }

      const status = await IndexerService.getIndexStatus()

      res.status(200).json({
        success: true,
        data: status
      })
    } catch (error) {
      logger.error('Failed to get index status:', error)
      throw new ApiError('Failed to get index status', 500)
    }
  }
}