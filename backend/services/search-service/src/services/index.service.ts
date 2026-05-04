import { SearchService } from './elasticsearch.service'
import { MessageBroker } from '../../../message-broker'
import { logger } from '../../../shared/utils/logger'
import { ProductServiceClient } from '../../../shared/clients/product.client'

export class IndexerService {
  static async reindexProducts(options: {
    productIds?: string[]
    fullReindex?: boolean
  }) {
    const batchSize = 100
    let totalIndexed = 0
    let totalFailed = 0
    const errors: string[] = []

    try {
      if (options.fullReindex) {
        // Full reindex - fetch all products in batches
        let page = 1
        let hasMore = true

        while (hasMore) {
          const products = await ProductServiceClient.getProducts({
            page,
            limit: batchSize,
            includeInactive: true
          })

          if (products.length === 0) {
            hasMore = false
            break
          }

          for (const product of products) {
            try {
              await SearchService.indexProduct(product)
              totalIndexed++
            } catch (error) {
              totalFailed++
              errors.push(`Product ${product.id}: ${error.message}`)
              logger.error(`Failed to index product ${product.id}:`, error)
            }
          }

          page++
          logger.info(`Indexed batch ${page - 1}: ${totalIndexed} products`)
        }
      } else if (options.productIds && options.productIds.length > 0) {
        // Partial reindex - specific products
        for (const productId of options.productIds) {
          try {
            const product = await ProductServiceClient.getProduct(productId)
            if (product) {
              await SearchService.indexProduct(product)
              totalIndexed++
            }
          } catch (error) {
            totalFailed++
            errors.push(`Product ${productId}: ${error.message}`)
            logger.error(`Failed to index product ${productId}:`, error)
          }
        }
      }

      // Publish indexing complete event
      await MessageBroker.publish('search_events', {
        type: 'reindex_completed',
        data: {
          totalIndexed,
          totalFailed,
          fullReindex: options.fullReindex,
          timestamp: new Date()
        }
      })

      return {
        success: true,
        totalIndexed,
        totalFailed,
        errors: errors.slice(0, 10) // Limit error messages
      }
    } catch (error) {
      logger.error('Reindexing failed:', error)
      throw error
    }
  }

  static async handleProductUpdate(product: any) {
    try {
      if (product.status === 'deleted' || product.status === 'archived') {
        await SearchService.deleteProduct(product.id)
        logger.info(`Product ${product.id} removed from search index`)
      } else if (product.status === 'active') {
        await SearchService.indexProduct(product)
        logger.info(`Product ${product.id} indexed/updated`)
      }
    } catch (error) {
      logger.error(`Failed to handle product update for ${product.id}:`, error)
      // Don't throw - we don't want to fail the main operation
    }
  }

  static async getIndexStatus() {
    try {
      const status = await SearchService.getIndexStatus()
      
      // Additional index metrics
      const metrics = {
        totalProducts: status.stats?.indices?.products?.total?.docs?.count || 0,
        indexSize: status.stats?.indices?.products?.total?.store?.size_in_bytes || 0,
        health: status.health?.status,
        lastRefresh: new Date().toISOString()
      }

      return {
        ...status,
        metrics
      }
    } catch (error) {
      logger.error('Failed to get index status:', error)
      throw error
    }
  }
}

// Listen for product updates
MessageBroker.subscribe('product_updates', async (message) => {
  try {
    if (message.type === 'product_created' || message.type === 'product_updated') {
      await IndexerService.handleProductUpdate(message.data)
    } else if (message.type === 'product_deleted') {
      await SearchService.deleteProduct(message.data.productId)
    }
  } catch (error) {
    logger.error('Failed to process product update:', error)
  }
})