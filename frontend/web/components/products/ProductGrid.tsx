'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import ProductSkeleton from './ProductSkeleton'

interface Product {
  id: number
  name: string
  price: number
  description: string
  category: string
  rating: number
  reviewCount: number
  image: string
  discount?: number
  isNew?: boolean
  stock: number
}

interface ProductGridProps {
  products?: Product[] // Make optional
  isLoading?: boolean
  columns?: number
  sellerId?: string // Add sellerId prop
}

export default function ProductGrid({ 
  products: propProducts, 
  isLoading = false,
  columns = 4,
  sellerId
}: ProductGridProps) {
  const [wishlist, setWishlist] = useState<number[]>([])
  const [products, setProducts] = useState<Product[]>(propProducts || [])
  const [loading, setLoading] = useState(isLoading)

  // Fetch products based on sellerId if provided
  useEffect(() => {
    if (sellerId && !propProducts) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        const sellerProducts: Product[] = [
          { id: 1, name: 'Wireless Headphones', price: 99.99, description: 'Premium wireless headphones', category: 'Electronics', rating: 4.5, reviewCount: 124, image: '/api/placeholder/300/300', stock: 45 },
          { id: 2, name: 'Smart Watch Series 5', price: 299.99, description: 'Latest smart watch with health tracking', category: 'Electronics', rating: 4.8, reviewCount: 89, image: '/api/placeholder/300/300', stock: 23 },
          { id: 3, name: 'USB-C Fast Charger', price: 29.99, description: 'Fast charging USB-C cable', category: 'Accessories', rating: 4.2, reviewCount: 210, image: '/api/placeholder/300/300', stock: 100 },
          { id: 4, name: 'Bluetooth Speaker', price: 79.99, description: 'Portable Bluetooth speaker', category: 'Electronics', rating: 4.6, reviewCount: 156, image: '/api/placeholder/300/300', stock: 34 },
          { id: 5, name: 'Laptop Stand', price: 49.99, description: 'Adjustable laptop stand', category: 'Accessories', rating: 4.3, reviewCount: 67, image: '/api/placeholder/300/300', stock: 12 },
          { id: 6, name: 'Wireless Mouse', price: 39.99, description: 'Ergonomic wireless mouse', category: 'Accessories', rating: 4.4, reviewCount: 189, image: '/api/placeholder/300/300', stock: 56 },
        ]
        setProducts(sellerProducts)
        setLoading(false)
      }, 500)
    } else if (propProducts) {
      setProducts(propProducts)
    }
  }, [sellerId, propProducts])

  const handleAddToWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  }

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6`}>
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {sellerId ? 'This seller has no products yet' : 'No products found'}
        </h3>
        <p className="text-gray-600">
          {sellerId ? 'Check back later for new products' : 'Try adjusting your search or filter criteria'}
        </p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => console.log('Add to cart:', product.id)}
          onQuickView={() => console.log('Quick view:', product.id)}
          onAddToWishlist={() => handleAddToWishlist(product.id)}
        />
      ))}
    </div>
  )
}