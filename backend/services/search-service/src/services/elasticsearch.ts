import { Client } from '@elastic/elasticsearch'
import { config } from '../config'
import { logger } from '../../../shared/utils/logger'

export interface SearchOptions {
  query: string
  category?: string
  seller?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  sortBy: string
  page: number
  limit: number
  filters?: Record<string, any>
  location?: string
  attributes?: Record<string, any>
}

export interface SearchResult {
  products: any[]
  total: number
  page: number
  pages: number
  aggregations: Record<string, any>
  suggestions: string[]
  spellCheck?: {
    original: string
    suggested: string
    corrected: boolean
  }
}

class ElasticSearchService {
  private client: Client

  constructor() {
    this.client = new Client({
      node: config.elasticsearch.node,
      auth: {
        username: config.elasticsearch.username,
        password: config.elasticsearch.password
      },
      maxRetries: 3,
      requestTimeout: 30000
    })
  }

  async searchProducts(options: SearchOptions): Promise<SearchResult> {
    const from = (options.page - 1) * options.limit
    const size = options.limit

    const mustClauses: any[] = []
    const filterClauses: any[] = []
    const shouldClauses: any[] = []

    // Text search
    if (options.query) {
      mustClauses.push({
        multi_match: {
          query: options.query,
          fields: [
            'name^3',
            'description^2',
            'category^2',
            'brand^2',
            'sku',
            'attributes.value'
          ],
          type: 'best_fields',
          fuzziness: 'AUTO',
          operator: 'and'
        }
      })

      // Add fuzzy suggestions
      shouldClauses.push({
        match: {
          name: {
            query: options.query,
            fuzziness: 'AUTO',
            boost: 2
          }
        }
      })
    }

    // Filters
    if (options.category) {
      filterClauses.push({
        term: { 'category.slug': options.category }
      })
    }

    if (options.seller) {
      filterClauses.push({
        term: { 'seller.id': options.seller }
      })
    }

    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
      const priceFilter: any = { range: { price: {} } }
      if (options.minPrice !== undefined) priceFilter.range.price.gte = options.minPrice
      if (options.maxPrice !== undefined) priceFilter.range.price.lte = options.maxPrice
      filterClauses.push(priceFilter)
    }

    if (options.rating !== undefined) {
      filterClauses.push({
        range: { rating: { gte: options.rating } }
      })
    }

    if (options.inStock) {
      filterClauses.push({
        range: { stock: { gt: 0 } }
      })
    }

    // Location-based search
    if (options.location) {
      // This would be more complex with geospatial search
      // For now, just filter by location field
      filterClauses.push({
        term: { 'seller.location': options.location }
      })
    }

    // Custom attributes
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        filterClauses.push({
          nested: {
            path: 'attributes',
            query: {
              bool: {
                must: [
                  { term: { 'attributes.key': key } },
                  { term: { 'attributes.value': value } }
                ]
              }
            }
          }
        })
      })
    }

    // Additional filters from request
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          filterClauses.push({
            terms: { [key]: value }
          })
        } else {
          filterClauses.push({
            term: { [key]: value }
          })
        }
      })
    }

    // Sorting
    let sort: any[] = []
    switch (options.sortBy) {
      case 'price_asc':
        sort = [{ price: { order: 'asc' } }]
        break
      case 'price_desc':
        sort = [{ price: { order: 'desc' } }]
        break
      case 'rating':
        sort = [{ rating: { order: 'desc' } }, { reviewCount: { order: 'desc' } }]
        break
      case 'newest':
        sort = [{ createdAt: { order: 'desc' } }]
        break
      case 'popular':
        sort = [{ salesCount: { order: 'desc' } }]
        break
      default: // relevance
        sort = ['_score']
    }

    const body = {
      query: {
        bool: {
          must: mustClauses,
          filter: filterClauses,
          should: shouldClauses,
          minimum_should_match: shouldClauses.length > 0 ? 1 : 0
        }
      },
      sort,
      from,
      size,
      aggs: this.getAggregations(),
      suggest: {
        text_suggestion: {
          text: options.query,
          term: {
            field: 'name',
            sort: 'score',
            suggest_mode: 'missing'
          }
        }
      },
      highlight: {
        fields: {
          name: {},
          description: {},
          category: {}
        },
        pre_tags: ['<mark>'],
        post_tags: ['</mark>']
      }
    }

    try {
      const response = await this.client.search({
        index: 'products',
        body
      })

      const products = response.body.hits.hits.map((hit: any) => ({
        ...hit._source,
        id: hit._id,
        score: hit._score,
        highlight: hit.highlight
      }))

      const total = response.body.hits.total.value
      const pages = Math.ceil(total / options.limit)

      // Spell check
      let spellCheck
      if (response.body.suggest?.text_suggestion?.[0]?.options?.length > 0) {
        const suggestion = response.body.suggest.text_suggestion[0].options[0]
        spellCheck = {
          original: options.query,
          suggested: suggestion.text,
          corrected: suggestion.score > 0.5
        }
      }

      return {
        products,
        total,
        page: options.page,
        pages,
        aggregations: response.body.aggregations || {},
        suggestions: response.body.suggest?.text_suggestion?.[0]?.options?.map((opt: any) => opt.text) || [],
        spellCheck
      }
    } catch (error) {
      logger.error('Elasticsearch search failed:', error)
      throw error
    }
  }

  async autocomplete(query: string, limit: number = 10): Promise<string[]> {
    const body = {
      query: {
        bool: {
          should: [
            {
              match_phrase_prefix: {
                name: {
                  query,
                  boost: 2,
                  max_expansions: 10
                }
              }
            },
            {
              prefix: {
                'name.keyword': {
                  value: query.toLowerCase(),
                  boost: 1.5
                }
              }
            },
            {
              wildcard: {
                'name.keyword': {
                  value: `*${query.toLowerCase()}*`,
                  boost: 1
                }
              }
            }
          ]
        }
      },
      size: limit,
      _source: ['name'],
      sort: [
        { _score: { order: 'desc' } },
        { popularity: { order: 'desc' } }
      ]
    }

    try {
      const response = await this.client.search({
        index: 'products',
        body
      })

      return Array.from(
        new Set(
          response.body.hits.hits.map((hit: any) => hit._source.name)
        )
      ).slice(0, limit)
    } catch (error) {
      logger.error('Elasticsearch autocomplete failed:', error)
      return []
    }
  }

  async searchSellers(options: {
    query?: string
    location?: string
    rating?: number
    verified?: boolean
    page: number
    limit: number
  }) {
    const from = (options.page - 1) * options.limit
    const size = options.limit

    const mustClauses: any[] = []
    const filterClauses: any[] = []

    if (options.query) {
      mustClauses.push({
        multi_match: {
          query: options.query,
          fields: [
            'shopName^3',
            'description^2',
            'location^2',
            'categories'
          ],
          fuzziness: 'AUTO'
        }
      })
    }

    if (options.location) {
      filterClauses.push({
        term: { 'location.city': options.location }
      })
    }

    if (options.rating !== undefined) {
      filterClauses.push({
        range: { rating: { gte: options.rating } }
      })
    }

    if (options.verified) {
      filterClauses.push({
        term: { verified: true }
      })
    }

    const body = {
      query: {
        bool: {
          must: mustClauses,
          filter: filterClauses
        }
      },
      sort: [
        { rating: { order: 'desc' } },
        { productCount: { order: 'desc' } }
      ],
      from,
      size,
      aggs: {
        locations: {
          terms: { field: 'location.city.keyword', size: 10 }
        },
        categories: {
          terms: { field: 'categories.keyword', size: 10 }
        }
      }
    }

    try {
      const response = await this.client.search({
        index: 'sellers',
        body
      })

      const sellers = response.body.hits.hits.map((hit: any) => ({
        ...hit._source,
        id: hit._id
      }))

      return {
        sellers,
        total: response.body.hits.total.value,
        page: options.page,
        pages: Math.ceil(response.body.hits.total.value / options.limit),
        aggregations: response.body.aggregations || {}
      }
    } catch (error) {
      logger.error('Seller search failed:', error)
      throw error
    }
  }

  private getAggregations() {
    return {
      categories: {
        terms: { field: 'category.name.keyword', size: 10 }
      },
      price_ranges: {
        range: {
          field: 'price',
          ranges: [
            { to: 25 },
            { from: 25, to: 50 },
            { from: 50, to: 100 },
            { from: 100, to: 200 },
            { from: 200 }
          ]
        }
      },
      rating: {
        histogram: {
          field: 'rating',
          interval: 1,
          min_doc_count: 1
        }
      },
      brands: {
        terms: { field: 'brand.keyword', size: 10 }
      },
      sellers: {
        terms: { field: 'seller.name.keyword', size: 10 }
      },
      attributes: {
        nested: { path: 'attributes' },
        aggs: {
          keys: {
            terms: { field: 'attributes.key.keyword', size: 20 },
            aggs: {
              values: {
                terms: { field: 'attributes.value.keyword', size: 10 }
              }
            }
          }
        }
      }
    }
  }

  async indexProduct(product: any) {
    try {
      await this.client.index({
        index: 'products',
        id: product.id,
        body: {
          ...product,
          indexedAt: new Date().toISOString()
        },
        refresh: 'wait_for'
      })
    } catch (error) {
      logger.error('Failed to index product:', error)
      throw error
    }
  }

  async deleteProduct(productId: string) {
    try {
      await this.client.delete({
        index: 'products',
        id: productId,
        refresh: 'wait_for'
      })
    } catch (error) {
      // Ignore not found errors
      if (error.meta?.statusCode !== 404) {
        logger.error('Failed to delete product from index:', error)
        throw error
      }
    }
  }

  async getIndexStatus() {
    try {
      const [health, stats, indices] = await Promise.all([
        this.client.cluster.health(),
        this.client.indices.stats({ index: 'products' }),
        this.client.indices.get({ index: 'products' })
      ])

      return {
        health: health.body,
        stats: stats.body,
        indices: indices.body
      }
    } catch (error) {
      logger.error('Failed to get index status:', error)
      throw error
    }
  }
}

export const SearchService = new ElasticSearchService()