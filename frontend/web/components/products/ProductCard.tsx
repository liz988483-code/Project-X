'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Eye, ShoppingCart, Star, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: {
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
  viewMode?: 'grid' | 'list'
  onAddToCart?: () => void
  onQuickView?: () => void
  onAddToWishlist?: () => void
}

export default function ProductCard({
  product,
  viewMode = 'grid',
  onAddToCart,
  onQuickView,
  onAddToWishlist
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const finalPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    onAddToWishlist?.()
  }

  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300",
        viewMode === 'list' && "md:grid md:grid-cols-[18rem_1fr]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.discount && (
          <Badge className="bg-red-500 text-white border-0 animate-slide-up">
            -{product.discount}%
          </Badge>
        )}
        {product.isNew && (
          <Badge className="bg-green-500 text-white border-0 animate-slide-up">
            NEW
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
      >
        <Heart
          className={cn(
            "h-5 w-5",
            isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
          )}
        />
      </button>

      {/* Image Container */}
      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Mock Image - Replace with Next Image */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl">
            {product.category === 'Electronics' ? '📱' : 
             product.category === 'Fashion' ? '👕' :
             product.category === 'Home & Kitchen' ? '🏠' : 
             product.category === 'Sports & Fitness' ? '💪' : '☕'}
          </div>
        </div>

        {/* Stock Indicator */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <span className="text-sm font-medium">
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </span>
            {product.stock > 0 && product.stock <= 10 && (
              <Zap className="h-4 w-4 text-yellow-300 animate-pulse" />
            )}
          </div>
        </div>

        {/* Quick View Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex gap-4">
            <Button
              onClick={onQuickView}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5">
        {/* Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ${finalPrice.toFixed(2)}
            </span>
            {product.discount && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onAddToCart}
          className="w-full group/btn"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:animate-bounce" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  )
}
