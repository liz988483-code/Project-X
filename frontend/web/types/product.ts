export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  category: string
  subcategory?: string
  brand?: string
  sku: string
  images: string[]
  rating: number
  reviewCount: number
  stock: number
  sellerId: string
  sellerName: string
  tags: string[]
  specifications: Record<string, string>
  shippingInfo: {
    freeShipping: boolean
    estimatedDelivery: string
    returnPolicy: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface ProductReview {
  id: number
  productId: number
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  images?: string[]
  helpfulCount: number
  createdAt: Date
}

export interface ProductFilter {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  brand?: string[]
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular'
}