'use client'
import { useState } from 'react'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Heart, 
  ArrowLeft,
  Tag,
  Shield,
  Truck,
  X
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/seperator'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  seller: string
  quantity: number
  maxQuantity: number
  selected: boolean
  isWishlisted: boolean
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 299.99,
      originalPrice: 359.99,
      image: '/images/products/headphones.jpg',
      category: 'Electronics',
      seller: 'TechHub Kenya',
      quantity: 1,
      maxQuantity: 5,
      selected: true,
      isWishlisted: false
    },
    {
      id: 2,
      name: 'Designer T-Shirt Collection',
      price: 49.99,
      image: '/images/products/tshirt.jpg',
      category: 'Fashion',
      seller: 'UrbanStyle',
      quantity: 2,
      maxQuantity: 10,
      selected: true,
      isWishlisted: true
    },
    {
      id: 3,
      name: 'Smart Home Assistant',
      price: 129.99,
      originalPrice: 149.99,
      image: '/images/products/smart-home.jpg',
      category: 'Electronics',
      seller: 'SmartLiving',
      quantity: 1,
      maxQuantity: 3,
      selected: true,
      isWishlisted: false
    },
  ])

  const [coupon, setCoupon] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const updateQuantity = (id: number, change: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change
        if (newQuantity >= 1 && newQuantity <= item.maxQuantity) {
          return { ...item, quantity: newQuantity }
        }
      }
      return item
    }))
  }

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const toggleSelect = (id: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ))
  }

  const toggleSelectAll = () => {
    const allSelected = items.every(item => item.selected)
    setItems(prev => prev.map(item => ({ ...item, selected: !allSelected })))
  }

  const toggleWishlist = (id: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isWishlisted: !item.isWishlisted } : item
    ))
  }

  const selectedItems = items.filter(item => item.selected)
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = selectedItems.length > 0 ? 9.99 : 0
  const tax = subtotal * 0.16 // 16% VAT
  const discount = 0 // Could be calculated from coupon
  const total = subtotal + shipping + tax - discount

  const applyCoupon = () => {
    setIsApplyingCoupon(true)
    // Simulate API call
    setTimeout(() => {
      setIsApplyingCoupon(false)
      setCoupon('')
    }, 1000)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">Review your items and proceed to checkout</p>
          </div>
          <Badge variant="outline" className="text-lg">
            {items.length} items
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-2">
          {/* Cart Header */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="select-all"
                    checked={items.every(item => item.selected) && items.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                  <label htmlFor="select-all" className="font-medium">
                    Select all ({selectedItems.length} selected)
                  </label>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    const selectedIds = items.filter(item => item.selected).map(item => item.id)
                    setItems(prev => prev.filter(item => !item.selected))
                  }}
                  disabled={selectedItems.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Selected
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Selection & Image */}
                        <div className="flex items-start gap-4">
                          <div className="flex items-center">
                            <Checkbox 
                              id={`item-${item.id}`}
                              checked={item.selected}
                              onCheckedChange={() => toggleSelect(item.id)}
                            />
                          </div>
                          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-2xl">
                              {item.category === 'Electronics' ? '📱' : 
                               item.category === 'Fashion' ? '👕' :
                               '🛍️'}
                            </div>
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                              <Link href={`/products/${item.id}`}>
                                <h3 className="font-semibold text-gray-900 hover:text-primary-600 mb-2">
                                  {item.name}
                                </h3>
                              </Link>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                                <span className="text-sm text-gray-500">Sold by {item.seller}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl font-bold text-gray-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                  {item.originalPrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ${(item.originalPrice * item.quantity).toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                {item.originalPrice && (
                                  <Badge variant="destructive" className="text-xs">
                                    Save {((1 - item.price / item.originalPrice) * 100).toFixed(0)}%
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, 1)}
                                  disabled={item.quantity >= item.maxQuantity}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className={`h-8 w-8 ${item.isWishlisted ? 'text-red-500' : ''}`}
                                  onClick={() => toggleWishlist(item.id)}
                                >
                                  <Heart className={`h-4 w-4 ${item.isWishlisted ? 'fill-red-500' : ''}`} />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-red-600 hover:text-red-700"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add items to your cart to continue shopping</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/">
                    <Button variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button>
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Continue Shopping */}
          {items.length > 0 && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Link href="/products">
                    <Button variant="outline">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                  <div className="text-sm text-gray-600">
                    <p>Items in your cart are saved for 30 days</p>
                    <p className="text-xs">Prices and availability may change</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({selectedItems.length} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={applyCoupon}
                    disabled={!coupon.trim() || isApplyingCoupon}
                  >
                    {isApplyingCoupon ? 'Applying...' : 'Apply'}
                  </Button>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/cart/checkout" className="block">
                <Button className="w-full" size="lg" disabled={selectedItems.length === 0}>
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    <span>Free Returns</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estimated Delivery */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Estimated Delivery</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Standard Shipping</p>
                    <p className="text-sm text-gray-600">3-5 business days</p>
                    <p className="text-sm text-green-600">Free</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Express Shipping</p>
                    <p className="text-sm text-gray-600">1-2 business days</p>
                    <p className="text-sm text-gray-600">$12.99</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our customer support team is here to help
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Chat with us
                  </Button>
                  <Button variant="ghost" className="w-full text-sm">
                    View FAQ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}