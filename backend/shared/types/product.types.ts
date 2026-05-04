/** Core Product Entity */
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  categoryId: string
  subcategoryId?: string
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

/** Category Hierarchy */
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children?: Category[]
  productCount: number
}

/** Product Review */
export interface ProductReview {
  id: string
  productId: string
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

/** DTOs (Data Transfer Objects) */

/** Create Product DTO */
export interface CreateProductDto {
  name: string
  description: string
  price: number
  categoryId: string
  subcategoryId?: string
  brand?: string
  sku: string
  images?: string[]
  stock: number
  tags?: string[]
  specifications?: Record<string, string>
  shippingInfo?: {
    freeShipping: boolean
    estimatedDelivery: string
    returnPolicy: string
  }
  sellerId: string
}

/** Update Product DTO */
export interface UpdateProductDto {
  name?: string
  description?: string
  price?: number
  categoryId?: string
  subcategoryId?: string
  brand?: string
  images?: string[]
  stock?: number
  tags?: string[]
  specifications?: Record<string, string>
  shippingInfo?: {
    freeShipping?: boolean
    estimatedDelivery?: string
    returnPolicy?: string
  }
}
