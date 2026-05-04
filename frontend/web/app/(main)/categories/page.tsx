'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Dumbbell,
  ChefHat,
  Car,
  Baby,
  BookOpen,
  Gamepad2,
  Heart,
  Sparkles
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Category {
  id: number
  name: string
  description: string
  icon: string
  productCount: number
  image: string
  featured: boolean
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const iconMap: Record<string, LucideIcon> = {
    Smartphone,
    Shirt,
    HomeIcon,
    Dumbbell,
    ChefHat,
    Car,
    Baby,
    BookOpen,
    Gamepad2,
    Heart,
    Sparkles
  }

  // Mock categories data
  const mockCategories: Category[] = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Latest gadgets, smartphones, laptops, and tech accessories',
      icon: 'Smartphone',
      productCount: 1247,
      image: '/images/categories/electronics.jpg',
      featured: true
    },
    {
      id: 2,
      name: 'Fashion',
      description: 'Clothing, shoes, accessories, and fashion essentials',
      icon: 'Shirt',
      productCount: 2156,
      image: '/images/categories/fashion.jpg',
      featured: true
    },
    {
      id: 3,
      name: 'Home & Kitchen',
      description: 'Furniture, appliances, decor, and kitchen essentials',
      icon: 'HomeIcon',
      productCount: 1834,
      image: '/images/categories/home.jpg',
      featured: true
    },
    {
      id: 4,
      name: 'Sports & Fitness',
      description: 'Exercise equipment, sports gear, and fitness accessories',
      icon: 'Dumbbell',
      productCount: 892,
      image: '/images/categories/sports.jpg',
      featured: false
    },
    {
      id: 5,
      name: 'Groceries',
      description: 'Fresh food, beverages, and grocery items',
      icon: 'ChefHat',
      productCount: 3241,
      image: '/images/categories/groceries.jpg',
      featured: true
    },
    {
      id: 6,
      name: 'Automotive',
      description: 'Car parts, accessories, and automotive supplies',
      icon: 'Car',
      productCount: 567,
      image: '/images/categories/automotive.jpg',
      featured: false
    },
    {
      id: 7,
      name: 'Baby & Kids',
      description: 'Baby products, toys, and children\'s essentials',
      icon: 'Baby',
      productCount: 1456,
      image: '/images/categories/baby.jpg',
      featured: false
    },
    {
      id: 8,
      name: 'Books & Media',
      description: 'Books, movies, music, and digital media',
      icon: 'BookOpen',
      productCount: 2341,
      image: '/images/categories/books.jpg',
      featured: false
    },
    {
      id: 9,
      name: 'Gaming',
      description: 'Video games, consoles, and gaming accessories',
      icon: 'Gamepad2',
      productCount: 678,
      image: '/images/categories/gaming.jpg',
      featured: false
    },
    {
      id: 10,
      name: 'Health & Beauty',
      description: 'Personal care, cosmetics, and health products',
      icon: 'Heart',
      productCount: 1892,
      image: '/images/categories/health.jpg',
      featured: false
    },
    {
      id: 11,
      name: 'Special Offers',
      description: 'Limited time deals and special promotions',
      icon: 'Sparkles',
      productCount: 234,
      image: '/images/categories/specials.jpg',
      featured: true
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchCategories = async () => {
      setLoading(true)
      // In real app: const response = await fetch('/api/categories')
      // const data = await response.json()

      await new Promise(resolve => setTimeout(resolve, 1000))
      setCategories(mockCategories)
      setLoading(false)
    }

    fetchCategories()
  }, [])

  const featuredCategories = categories.filter(cat => cat.featured)
  const otherCategories = categories.filter(cat => !cat.featured)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover our wide range of products organized by category.
          Find exactly what you're looking for with our easy-to-browse categories.
        </p>
      </div>

      {/* Featured Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCategories.map(category => {
            const IconComponent = iconMap[category.icon] || Sparkles
            return (
              <Link key={category.id} href={`/products?category=${category.name.toLowerCase()}`}>
                <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        <Badge variant="secondary" className="mt-1">
                          {category.productCount.toLocaleString()} products
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <div className="text-blue-600 font-medium group-hover:underline">
                      Shop {category.name} →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* All Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6">All Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {otherCategories.map(category => {
            const IconComponent = iconMap[category.icon] || Sparkles
            return (
              <Link key={category.id} href={`/products?category=${category.name.toLowerCase()}`}>
                <Card className="group hover:shadow-md transition-shadow duration-300 cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors mx-auto w-fit mb-3">
                      <IconComponent className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="font-medium group-hover:text-blue-600 transition-colors mb-1">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {category.productCount} items
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Category Stats */}
      <section className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Category Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {categories.reduce((sum, cat) => sum + cat.productCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {featuredCategories.length}
            </div>
            <div className="text-sm text-gray-600">Featured</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.max(...categories.map(cat => cat.productCount)).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Most Popular</div>
          </div>
        </div>
      </section>
    </div>
  )
}
