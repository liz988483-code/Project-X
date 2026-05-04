'use client'
import { useState } from 'react'
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Eye, 
  Share2,
  Filter,
  Search,
  X,
  Check
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import Link from 'next/link'

interface WishlistItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  stock: number
  seller: string
  addedDate: string
  selected: boolean
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 299.99,
      originalPrice: 359.99,
      image: '/images/products/headphones.jpg',
      category: 'Electronics',
      rating: 4.5,
      reviewCount: 128,
      stock: 45,
      seller: 'TechHub Kenya',
      addedDate: '2024-01-15',
      selected: false
    },
    {
      id: 2,
      name: 'Designer T-Shirt Collection',
      price: 49.99,
      image: '/images/products/tshirt.jpg',
      category: 'Fashion',
      rating: 4.2,
      reviewCount: 89,
      stock: 120,
      seller: 'UrbanStyle',
      addedDate: '2024-01-14',
      selected: false
    },
    {
      id: 3,
      name: 'Smart Home Assistant',
      price: 129.99,
      originalPrice: 149.99,
      image: '/images/products/smart-home.jpg',
      category: 'Electronics',
      rating: 4.8,
      reviewCount: 256,
      stock: 30,
      seller: 'SmartLiving',
      addedDate: '2024-01-12',
      selected: false
    },
    {
      id: 4,
      name: 'Yoga Mat Premium',
      price: 39.99,
      image: '/images/products/yoga-mat.jpg',
      category: 'Sports & Fitness',
      rating: 4.3,
      reviewCount: 67,
      stock: 85,
      seller: 'FitLife',
      addedDate: '2024-01-10',
      selected: false
    },
    {
      id: 5,
      name: 'Ceramic Cookware Set',
      price: 199.99,
      originalPrice: 249.99,
      image: '/images/products/cookware.jpg',
      category: 'Home & Kitchen',
      rating: 4.6,
      reviewCount: 142,
      stock: 25,
      seller: 'KitchenEssentials',
      addedDate: '2024-01-08',
      selected: false
    },
    {
      id: 6,
      name: 'Organic Coffee Beans',
      price: 24.99,
      image: '/images/products/coffee.jpg',
      category: 'Groceries',
      rating: 4.7,
      reviewCount: 203,
      stock: 200,
      seller: 'FreshHarvest',
      addedDate: '2024-01-05',
      selected: false
    },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectAll, setSelectAll] = useState(false)

  const categories = ['all', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports & Fitness', 'Groceries']

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      case 'oldest':
        return new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime()
      default:
        return 0
    }
  })

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setItems(prev => prev.map(item => ({ ...item, selected: newSelectAll })))
  }

  const toggleSelectItem = (id: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ))
  }

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const removeSelected = () => {
    setItems(prev => prev.filter(item => !item.selected))
    setSelectAll(false)
  }

  const moveToCart = (id?: number) => {
    if (id) {
      // Move single item to cart
      console.log('Moving item to cart:', id)
      removeItem(id)
    } else {
      // Move selected items to cart
      const selectedIds = items.filter(item => item.selected).map(item => item.id)
      console.log('Moving selected items to cart:', selectedIds)
      setItems(prev => prev.filter(item => !item.selected))
      setSelectAll(false)
    }
  }

  const selectedCount = items.filter(item => item.selected).length
  const totalPrice = items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600">Save items you love for later</p>
          </div>
          <Badge variant="outline" className="text-lg">
            {items.length} items
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none md:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search in wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={removeSelected}
                disabled={selectedCount === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Selected
              </Button>
              <Button 
                onClick={() => moveToCart()}
                disabled={selectedCount === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Move to Cart ({selectedCount})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="select-all" 
                    checked={selectAll}
                    onCheckedChange={toggleSelectAll}
                  />
                  <label htmlFor="select-all" className="font-medium">
                    {selectedCount} items selected
                  </label>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  Total: ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectAll(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Selection
                </Button>
                <Button size="sm" onClick={() => moveToCart()}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wishlist Grid */}
      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                {/* Item Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`item-${item.id}`}
                        checked={item.selected}
                        onCheckedChange={() => toggleSelectItem(item.id)}
                      />
                      <Badge variant="secondary">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Added {item.addedDate}</p>
                      <p className="text-sm text-gray-500">Seller: {item.seller}</p>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                      <span className="text-sm ml-1">{item.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-2xl">
                        {item.category === 'Electronics' ? '📱' : 
                         item.category === 'Fashion' ? '👕' :
                         item.category === 'Home & Kitchen' ? '🏠' :
                         item.category === 'Sports & Fitness' ? '⚽' :
                         item.category === 'Groceries' ? '🍎' : '🛍️'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-primary-600 mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                        {item.originalPrice && (
                          <Badge variant="destructive" className="text-xs">
                            Save {((1 - item.price / item.originalPrice) * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className={`${item.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                          {item.stock > 10 ? 'In Stock' : `Only ${item.stock} left`}
                        </span>
                        <span>•</span>
                        <span>{item.reviewCount} reviews</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => moveToCart(item.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Link href={`/products/${item.id}`} className="flex-1">
                      <Button variant="default" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
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
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== 'all' 
                ? 'No items match your search criteria'
                : 'Save items you love to purchase them later'
              }
            </p>
            <div className="flex gap-3 justify-center">
              {(searchQuery || selectedCategory !== 'all') && (
                <Button variant="outline" onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}>
                  Clear Filters
                </Button>
              )}
              <Link href="/products">
                <Button>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="mt-8 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Wishlist Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Price Drop Alerts</p>
                    <p className="text-sm text-gray-600">Get notified when items go on sale</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Stock Notifications</p>
                    <p className="text-sm text-gray-600">Know when out-of-stock items return</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Quick Purchase</p>
                    <p className="text-sm text-gray-600">Buy multiple items with one click</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}