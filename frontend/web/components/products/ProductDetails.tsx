import React from 'react'
import { Star, Truck, Shield, Clock, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ProductDetailsProps {
  product: {
    id: number
    name: string
    price: number
    originalPrice?: number
    description: string
    category: string
    rating: number
    reviewCount: number
    stock: number
    seller: string
    sellerRating: number
    specifications: Record<string, string>
  }
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <div className="space-y-6">
      {/* Product Info */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{product.category}</Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 font-medium">{product.rating}</span>
            <span className="text-gray-500 ml-1">({product.reviewCount} reviews)</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          {product.originalPrice && (
            <Badge variant="destructive" className="text-lg">
              Save {((1 - product.price / product.originalPrice) * 100).toFixed(0)}%
            </Badge>
          )}
        </div>
        
        <p className="text-gray-600 mb-6">{product.description}</p>
      </div>

      {/* Seller Info */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="font-bold">S</span>
            </div>
            <div>
              <h3 className="font-semibold">Sold by {product.seller}</h3>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-sm">{product.sellerRating} Seller Rating</span>
              </div>
            </div>
          </div>
          <Button variant="outline">Visit Store</Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Verified Seller</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Fast Response</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-500" />
            <span>Buyer Protection</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-orange-500" />
            <span>Free Shipping</span>
          </div>
        </div>
      </div>

      {/* Stock Status */}
      <div className={`p-4 rounded-lg ${product.stock > 10 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">
              {product.stock > 10 ? 'In Stock' : 'Low Stock'}
            </h4>
            <p className="text-sm">
              {product.stock > 10 
                ? 'Ready to ship'
                : `Only ${product.stock} items left`}
            </p>
          </div>
          {product.stock > 10 ? (
            <Check className="h-6 w-6 text-green-500" />
          ) : (
            <Clock className="h-6 w-6 text-orange-500" />
          )}
        </div>
      </div>

      {/* Specifications */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b pb-2">
              <span className="text-gray-600">{key}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Why Buy From Us?</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>30-day money-back guarantee</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Free shipping on orders over $50</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>24/7 customer support</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Secure payment processing</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ProductDetails