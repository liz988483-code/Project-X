'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, MapPin, Package, Users, TrendingUp, Award } from 'lucide-react'

interface Seller {
  id: number
  name: string
  description: string
  avatar: string
  coverImage: string
  location: string
  rating: number
  reviewCount: number
  productCount: number
  followerCount: number
  joinedDate: string
  isVerified: boolean
  isTopSeller: boolean
  specialties: string[]
  responseTime: string
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'verified' | 'top'>('all')

  // Mock sellers data
  const mockSellers: Seller[] = [
    {
      id: 1,
      name: 'TechHub Electronics',
      description: 'Premium electronics and gadgets from trusted brands. Fast shipping and excellent customer service.',
      avatar: '/images/sellers/techhub.jpg',
      coverImage: '/images/sellers/techhub-cover.jpg',
      location: 'San Francisco, CA',
      rating: 4.8,
      reviewCount: 1247,
      productCount: 342,
      followerCount: 15420,
      joinedDate: '2020-03-15',
      isVerified: true,
      isTopSeller: true,
      specialties: ['Electronics', 'Smartphones', 'Laptops'],
      responseTime: '< 1 hour'
    },
    {
      id: 2,
      name: 'Fashion Forward',
      description: 'Trendy clothing and accessories for modern lifestyles. Quality fashion at affordable prices.',
      avatar: '/images/sellers/fashion.jpg',
      coverImage: '/images/sellers/fashion-cover.jpg',
      location: 'New York, NY',
      rating: 4.6,
      reviewCount: 892,
      productCount: 567,
      followerCount: 12340,
      joinedDate: '2019-08-22',
      isVerified: true,
      isTopSeller: true,
      specialties: ['Fashion', 'Clothing', 'Accessories'],
      responseTime: '< 2 hours'
    },
    {
      id: 3,
      name: 'Home & Living Co.',
      description: 'Beautiful home decor, furniture, and lifestyle products for your perfect living space.',
      avatar: '/images/sellers/home.jpg',
      coverImage: '/images/sellers/home-cover.jpg',
      location: 'Austin, TX',
      rating: 4.7,
      reviewCount: 654,
      productCount: 289,
      followerCount: 8760,
      joinedDate: '2021-01-10',
      isVerified: true,
      isTopSeller: false,
      specialties: ['Home Decor', 'Furniture', 'Kitchen'],
      responseTime: '< 3 hours'
    },
    {
      id: 4,
      name: 'Sports Pro Shop',
      description: 'Professional sports equipment and fitness gear for athletes of all levels.',
      avatar: '/images/sellers/sports.jpg',
      coverImage: '/images/sellers/sports-cover.jpg',
      location: 'Denver, CO',
      rating: 4.5,
      reviewCount: 423,
      productCount: 198,
      followerCount: 5432,
      joinedDate: '2020-11-05',
      isVerified: true,
      isTopSeller: false,
      specialties: ['Sports', 'Fitness', 'Outdoor'],
      responseTime: '< 4 hours'
    },
    {
      id: 5,
      name: 'Green Market Organics',
      description: 'Fresh organic produce, groceries, and health foods delivered to your door.',
      avatar: '/images/sellers/organic.jpg',
      coverImage: '/images/sellers/organic-cover.jpg',
      location: 'Portland, OR',
      rating: 4.9,
      reviewCount: 756,
      productCount: 445,
      followerCount: 9876,
      joinedDate: '2018-06-18',
      isVerified: true,
      isTopSeller: true,
      specialties: ['Organic', 'Groceries', 'Health Foods'],
      responseTime: '< 1 hour'
    },
    {
      id: 6,
      name: 'Artisan Crafts',
      description: 'Handmade crafts, unique gifts, and artisanal products from local creators.',
      avatar: '/images/sellers/artisan.jpg',
      coverImage: '/images/sellers/artisan-cover.jpg',
      location: 'Asheville, NC',
      rating: 4.4,
      reviewCount: 321,
      productCount: 156,
      followerCount: 3456,
      joinedDate: '2022-02-14',
      isVerified: false,
      isTopSeller: false,
      specialties: ['Handmade', 'Crafts', 'Gifts'],
      responseTime: '< 6 hours'
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchSellers = async () => {
      setLoading(true)
      // In real app: const response = await fetch('/api/sellers')
      // const data = await response.json()

      await new Promise(resolve => setTimeout(resolve, 1000))
      setSellers(mockSellers)
      setLoading(false)
    }

    fetchSellers()
  }, [])

  const filteredSellers = sellers.filter(seller => {
    switch (filter) {
      case 'verified':
        return seller.isVerified
      case 'top':
        return seller.isTopSeller
      default:
        return true
    }
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Sellers</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover trusted sellers on SOKO. Browse their products, read reviews,
          and shop with confidence from verified merchants.
        </p>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Sellers
        </Button>
        <Button
          variant={filter === 'verified' ? 'default' : 'outline'}
          onClick={() => setFilter('verified')}
        >
          <Award className="h-4 w-4 mr-2" />
          Verified
        </Button>
        <Button
          variant={filter === 'top' ? 'default' : 'outline'}
          onClick={() => setFilter('top')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Top Sellers
        </Button>
      </div>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSellers.map(seller => (
          <Card key={seller.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Cover Image */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              {seller.isTopSeller && (
                <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Top Seller
                </Badge>
              )}
            </div>

            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="h-16 w-16 border-4 border-white -mt-8">
                  <AvatarImage src={seller.avatar} alt={seller.name} />
                  <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                </Avatar>

                {/* Seller Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold">{seller.name}</h3>
                    {seller.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{seller.rating}</span>
                      <span>({seller.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{seller.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {seller.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        {seller.productCount}
                      </div>
                      <div className="text-xs text-gray-500">Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {seller.followerCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">
                        {seller.responseTime}
                      </div>
                      <div className="text-xs text-gray-500">Response</div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {seller.specialties.map(specialty => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Link href={`/sellers/${seller.id}`}>
                    <Button className="w-full">
                      Visit Store
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Seller Community Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sellers.length}
            </div>
            <div className="text-sm text-gray-600">Total Sellers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {sellers.filter(s => s.isVerified).length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {sellers.filter(s => s.isTopSeller).length}
            </div>
            <div className="text-sm text-gray-600">Top Sellers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {(sellers.reduce((sum, s) => sum + s.rating, 0) / sellers.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  )
}