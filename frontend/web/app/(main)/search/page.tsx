'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'
import ProductSkeleton from '@/components/products/ProductSkeleton'
import SearchBar from '@/components/shared/SearchBar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search } from 'lucide-react'

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

interface Seller {
  id: number
  name: string
  description: string
  rating: number
  reviewCount: number
  productCount: number
  location: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  const [searchQuery, setSearchQuery] = useState(query)
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<Product[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Mock data
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
      stock: 78
    }
  ]

  const mockSellers: Seller[] = [
    {
      id: 1,
      name: 'TechHub Electronics',
      description: 'Premium electronics and gadgets from trusted brands',
      rating: 4.8,
      reviewCount: 1247,
      productCount: 342,
      location: 'San Francisco, CA'
    },
    {
      id: 2,
      name: 'Fashion Forward',
      description: 'Trendy clothing and accessories for modern lifestyles',
      rating: 4.6,
      reviewCount: 892,
      productCount: 567,
      location: 'New York, NY'
    }
  ]

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setHasSearched(true)

    try {
      // In real app, these would be API calls
      // const productsResponse = await fetch(`/api/products/search?q=${encodeURIComponent(searchTerm)}`)
      // const sellersResponse = await fetch(`/api/sellers/search?q=${encodeURIComponent(searchTerm)}`)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Filter mock data based on search term
      const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )

      const filteredSellers = mockSellers.filter(seller =>
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.description.toLowerCase().includes(searchTerm.toLowerCase())
      )

      setProducts(filteredProducts)
      setSellers(filteredSellers)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      performSearch(searchQuery)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setProducts([])
    setSellers([])
    setHasSearched(false)
    router.push('/search')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Search</h1>

        <form onSubmit={handleSearch} className="relative">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search for products, sellers, or categories..."
            className="w-full"
            navigateOnSearch={false}
          />
          <Button type="submit" className="w-full mt-3" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="products">
              Products ({products.length})
            </TabsTrigger>
            <TabsTrigger value="sellers">
              Sellers ({sellers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search terms or browse our categories.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => router.push('/categories')}>
                    Browse Categories
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/products')}>
                    View All Products
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    Found {products.length} product{products.length !== 1 ? 's' : ''} for "{query}"
                  </p>
                  <Badge variant="secondary">
                    Search Results
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="sellers" className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : sellers.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sellers found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search terms or browse all sellers.
                </p>
                <Button onClick={() => router.push('/sellers')}>
                  View All Sellers
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    Found {sellers.length} seller{sellers.length !== 1 ? 's' : ''} for "{query}"
                  </p>
                  <Badge variant="secondary">
                    Search Results
                  </Badge>
                </div>
                <div className="grid gap-4">
                  {sellers.map(seller => (
                    <div key={seller.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{seller.name}</h3>
                          <p className="text-gray-600 mb-3">{seller.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span>⭐ {seller.rating} ({seller.reviewCount} reviews)</span>
                            <span>{seller.productCount} products</span>
                            <span>{seller.location}</span>
                          </div>
                          <Button onClick={() => router.push(`/sellers/${seller.id}`)}>
                            Visit Store
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Popular Searches / Suggestions */}
      {!hasSearched && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'wireless headphones',
              'smartphones',
              'laptops',
              'fashion',
              'home decor',
              'sports equipment',
              'books',
              'electronics'
            ].map(term => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery(term)
                  router.push(`/search?q=${encodeURIComponent(term)}`)
                  performSearch(term)
                }}
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}