'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'
import ProductSkeleton from '@/components/products/ProductSkeleton'
import SearchBar from '@/components/shared/SearchBar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react'

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

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedCategory, setSelectedCategory] = useState(category || 'all')
  const [searchQuery, setSearchQuery] = useState(search || '')

  // Mock products data - in real app, this would come from API
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
      description: 'Voice-controlled smart home assistant with multiple features',
      category: 'Electronics',
      rating: 4.3,
      reviewCount: 256,
      image: '/images/products/assistant.jpg',
      isNew: true,
      stock: 78
    },
    {
      id: 4,
      name: 'Organic Coffee Beans',
      price: 24.99,
      description: 'Premium organic coffee beans from sustainable farms',
      category: 'Groceries',
      rating: 4.7,
      reviewCount: 67,
      image: '/images/products/coffee.jpg',
      stock: 200
    },
    {
      id: 5,
      name: 'Fitness Tracker Pro',
      price: 199.99,
      description: 'Advanced fitness tracker with heart rate monitoring',
      category: 'Sports & Fitness',
      rating: 4.4,
      reviewCount: 203,
      image: '/images/products/tracker.jpg',
      discount: 15,
      stock: 92
    },
    {
      id: 6,
      name: 'Ceramic Dinner Set',
      price: 89.99,
      description: 'Elegant ceramic dinner set for 6 people',
      category: 'Home & Kitchen',
      rating: 4.1,
      reviewCount: 45,
      image: '/images/products/dinnerset.jpg',
      stock: 34
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      setLoading(true)
      // In real app: const response = await fetch('/api/products')
      // const data = await response.json()

      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay
      setProducts(mockProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by price range
    filtered = filtered.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return b.id - a.id // Assuming higher ID = newer
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchQuery, sortBy, priceRange])

  const categories = ['all', ...new Set(products.map(p => p.category.toLowerCase()))]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search products..."
          navigateOnSearch={false}
        />
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5" />
          <span className="font-medium">Filters:</span>
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>

        {/* View Mode */}
        <div className="flex border rounded">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
        {selectedCategory !== 'all' && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            <button
              onClick={() => setSelectedCategory('all')}
              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
            >
              ×
            </button>
          </Badge>
        )}
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <Button
            onClick={() => {
              setSelectedCategory('all')
              setPriceRange([0, 1000])
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  )
}
