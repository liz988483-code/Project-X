'use client'

import { ChevronRight, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  ShoppingCart, 
  TrendingUp, 
  Shield, 
  Truck, 
  Clock,
  Search,
  Filter,
  Sparkles,
  Tag,
  ShoppingBag,
  Smartphone,
  Home as HomeIcon,
  Dumbbell,
  Shirt,
  ChefHat
} from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import ProductSkeleton from '@/components/products/ProductSkeleton'
import SearchBar from '@/components/shared/SearchBar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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

interface Category {
  id: number
  name: string
  icon: React.ReactNode
  count: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories: Category[] = [
    { id: 1, name: 'Electronics', icon: <Smartphone className="h-5 w-5" />, count: 42 },
    { id: 2, name: 'Fashion', icon: <Shirt className="h-5 w-5" />, count: 156 },
    { id: 3, name: 'Home & Kitchen', icon: <HomeIcon className="h-5 w-5" />, count: 89 },
    { id: 4, name: 'Sports & Fitness', icon: <Dumbbell className="h-5 w-5" />, count: 67 },
    { id: 5, name: 'Groceries', icon: <ChefHat className="h-5 w-5" />, count: 124 },
  ]

  useEffect(() => {
    // Simulate API call with mock data
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // Mock products data
        const mockProducts: Product[] = [
          {
            id: 1,
            name: 'Premium Wireless Headphones',
            price: 299.99,
            description: 'Noise-cancelling over-ear headphones with premium sound quality',
            category: 'Electronics',
            rating: 4.5,
            reviewCount: 128,
            image: '/images/products/headphones.jpg',
            discount: 20,
            isNew: true,
            stock: 45
          },
          {
            id: 2,
            name: 'Designer T-Shirt Collection',
            price: 49.99,
            description: 'Premium cotton t-shirt with modern design',
            category: 'Fashion',
            rating: 4.2,
            reviewCount: 89,
            image: '/images/products/tshirt.jpg',
            stock: 120
          },
          {
            id: 3,
            name: 'Smart Home Assistant',
            price: 129.99,
            description: 'Voice-controlled smart home device with AI capabilities',
            category: 'Electronics',
            rating: 4.8,
            reviewCount: 256,
            image: '/images/products/smart-home.jpg',
            discount: 15,
            stock: 30
          },
          {
            id: 4,
            name: 'Yoga Mat Premium',
            price: 39.99,
            description: 'Non-slip yoga mat with extra cushioning',
            category: 'Sports & Fitness',
            rating: 4.3,
            reviewCount: 67,
            image: '/images/products/yoga-mat.jpg',
            isNew: true,
            stock: 85
          },
          {
            id: 5,
            name: 'Ceramic Cookware Set',
            price: 199.99,
            description: '10-piece ceramic non-stick cookware set',
            category: 'Home & Kitchen',
            rating: 4.6,
            reviewCount: 142,
            image: '/images/products/cookware.jpg',
            discount: 25,
            stock: 25
          },
          {
            id: 6,
            name: 'Organic Coffee Beans',
            price: 24.99,
            description: 'Fair trade organic arabica coffee beans',
            category: 'Groceries',
            rating: 4.7,
            reviewCount: 203,
            image: '/images/products/coffee.jpg',
            stock: 200
          },
          {
            id: 7,
            name: 'Gaming Mouse Pro',
            price: 89.99,
            description: 'RGB gaming mouse with customizable buttons',
            category: 'Electronics',
            rating: 4.4,
            reviewCount: 91,
            image: '/images/products/gaming-mouse.jpg',
            discount: 10,
            stock: 60
          },
          {
            id: 8,
            name: 'Running Shoes',
            price: 129.99,
            description: 'Lightweight running shoes with cushion technology',
            category: 'Sports & Fitness',
            rating: 4.5,
            reviewCount: 178,
            image: '/images/products/shoes.jpg',
            isNew: true,
            stock: 40
          }
        ]

        setProducts(mockProducts)
        setFeaturedProducts(mockProducts.slice(0, 3))
        setCartCount(12) // Mock cart count
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                <Sparkles className="h-3 w-3 mr-2" />
                New Collection
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Discover Amazing
                <span className="block text-primary-200">Products Daily</span>
              </h1>
              <p className="text-lg text-primary-100 max-w-lg">
                Shop from thousands of authentic sellers. Fast delivery, secure payments, 
                and premium customer service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Shop Now
                  </Button>
                </Link>
                <Link href="/sellers">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                    Become a Seller
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-gentle" />
                <div className="absolute -bottom-8 -right-6 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-gentle animation-delay-2000" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    {featuredProducts.slice(0, 4).map((product) => (
                      <div key={product.id} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-2xl mb-2">{product.category === 'Electronics' ? '📱' : '👕'}</div>
                        <h4 className="font-semibold text-sm">{product.name}</h4>
                        <div className="flex items-center mt-2">
                          <span className="text-yellow-400">${product.price}</span>
                          {product.discount && (
                            <Badge variant="secondary" className="ml-2">
                              -{product.discount}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4">
              <Truck className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
            <p className="text-gray-600 text-sm">On orders over $50</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">Dedicated support team</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
              <Shield className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
            <p className="text-gray-600 text-sm">100% secure transactions</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Best Prices</h3>
            <p className="text-gray-600 text-sm">Price match guarantee</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse Products</h2>
              <p className="text-gray-600 mt-1">Discover amazing products from trusted sellers</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <SearchBar 
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search products, categories, brands..."
                  className="w-full md:w-80"
                  navigateOnSearch={false}
                />
              </div>
              <Button variant="outline" className="hidden md:flex">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('all')}
              className="whitespace-nowrap"
            >
              <Tag className="h-4 w-4 mr-2" />
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.name ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category.name)}
                className="whitespace-nowrap"
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">
              {activeCategory === 'all' ? 'All Products' : activeCategory}
              <span className="text-gray-500 text-sm font-normal ml-2">
                ({filteredProducts.length} products)
              </span>
            </h3>
            <Link href="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => setCartCount(prev => prev + 1)}
                  onQuickView={() => {}}
                  onAddToWishlist={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={() => { setSearchQuery(''); setActiveCategory('all') }}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 mb-12 border border-primary-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-700 mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-700 mb-2">500+</div>
              <div className="text-gray-600">Trusted Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-700 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-700 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white overflow-hidden">
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to start selling?
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                Join thousands of sellers who trust SOKO to grow their business.
                Get started in minutes with our easy setup process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sellers/dashboard">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                    <Store className="mr-2 h-5 w-5" />
                    Start Selling
                  </Button>
                </Link>
                <Link href="/sellers/features">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      <Link href="/cart">
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            <Button 
              size="lg" 
              className="rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 h-14 w-14"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </Link>
    </div>
  )
}