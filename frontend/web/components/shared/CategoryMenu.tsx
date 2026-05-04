'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ChevronDown, 
  ChevronRight, 
  Smartphone, 
  Laptop, 
  Shirt, 
  Home, 
  Utensils,
  Music,
  BookOpen,
  Heart,
  Star,
  TrendingUp,
  Award,
  Clock,
  Zap,
  ShoppingBag,
  Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// Types
export interface Category {
  id: string
  name: string
  slug: string
  icon?: React.ReactNode
  description?: string
  productCount?: number
  subcategories?: Subcategory[]
  featured?: boolean
  trending?: boolean
  isNew?: boolean
  imageUrl?: string
  color?: string
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  productCount?: number
  popular?: boolean
}

export interface CategoryMenuProps {
  categories: Category[]
  isLoading?: boolean
  onCategoryClick?: (category: Category) => void
  onSubcategoryClick?: (subcategory: Subcategory) => void
  showAllCategories?: boolean
  compact?: boolean
  className?: string
  showIcons?: boolean
  showCount?: boolean
  featuredCount?: number
}

// Default categories data (fallback)
const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    icon: <Smartphone className="h-4 w-4" />,
    description: 'Latest gadgets and devices',
    productCount: 1250,
    trending: true,
    subcategories: [
      { id: '1-1', name: 'Smartphones', slug: 'smartphones', productCount: 450, popular: true },
      { id: '1-2', name: 'Laptops', slug: 'laptops', productCount: 320, popular: true },
      { id: '1-3', name: 'Tablets', slug: 'tablets', productCount: 180 },
      { id: '1-4', name: 'Wearables', slug: 'wearables', productCount: 150 },
      { id: '1-5', name: 'Accessories', slug: 'accessories', productCount: 150 },
    ],
  },
  {
    id: '2',
    name: 'Fashion',
    slug: 'fashion',
    icon: <Shirt className="h-4 w-4" />,
    description: 'Clothing and accessories',
    productCount: 890,
    subcategories: [
      { id: '2-1', name: 'Men\'s Clothing', slug: 'mens-clothing', productCount: 320, popular: true },
      { id: '2-2', name: 'Women\'s Clothing', slug: 'womens-clothing', productCount: 350, popular: true },
      { id: '2-3', name: 'Shoes', slug: 'shoes', productCount: 150 },
      { id: '2-4', name: 'Bags & Accessories', slug: 'bags-accessories', productCount: 70 },
    ],
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    icon: <Home className="h-4 w-4" />,
    description: 'Furniture and decor',
    productCount: 750,
    featured: true,
    subcategories: [
      { id: '3-1', name: 'Furniture', slug: 'furniture', productCount: 280 },
      { id: '3-2', name: 'Kitchenware', slug: 'kitchenware', productCount: 220, popular: true },
      { id: '3-3', name: 'Home Decor', slug: 'home-decor', productCount: 150 },
      { id: '3-4', name: 'Garden Tools', slug: 'garden-tools', productCount: 100 },
    ],
  },
  {
    id: '4',
    name: 'Groceries',
    slug: 'groceries',
    icon: <Utensils className="h-4 w-4" />,
    description: 'Food and beverages',
    productCount: 1200,
    subcategories: [
      { id: '4-1', name: 'Fresh Produce', slug: 'fresh-produce', productCount: 400, popular: true },
      { id: '4-2', name: 'Dairy & Eggs', slug: 'dairy-eggs', productCount: 250 },
      { id: '4-3', name: 'Beverages', slug: 'beverages', productCount: 300 },
      { id: '4-4', name: 'Snacks', slug: 'snacks', productCount: 250 },
    ],
  },
  {
    id: '5',
    name: 'Entertainment',
    slug: 'entertainment',
    icon: <Music className="h-4 w-4" />,
    description: 'Movies, music, and games',
    productCount: 560,
    isNew: true,
    subcategories: [
      { id: '5-1', name: 'Books', slug: 'books', productCount: 200 },
      { id: '5-2', name: 'Games', slug: 'games', productCount: 180, popular: true },
      { id: '5-3', name: 'Music', slug: 'music', productCount: 100 },
      { id: '5-4', name: 'Movies & TV', slug: 'movies-tv', productCount: 80 },
    ],
  },
]

// Category Card Component
const CategoryCard: React.FC<{
  category: Category
  onClick?: (category: Category) => void
  compact?: boolean
  showIcons?: boolean
  showCount?: boolean
}> = ({ category, onClick, compact = false, showIcons = true, showCount = true }) => {
  return (
    <div
      className={cn(
        'group relative flex items-center justify-between p-3 rounded-lg transition-all duration-200',
        'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700',
        compact ? 'px-2 py-1.5' : ''
      )}
      onClick={() => onClick?.(category)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(category)
        }
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        {showIcons && (
          <div className="flex-shrink-0">
            {category.icon || (
              <ShoppingBag className={cn(
                "text-gray-500 group-hover:text-primary transition-colors",
                compact ? "h-3 w-3" : "h-4 w-4"
              )} />
            )}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors",
              compact ? "text-sm" : ""
            )}>
              {category.name}
            </span>
            
            {category.isNew && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                New
              </Badge>
            )}
            
            {category.trending && (
              <Badge variant="outline" className="text-xs px-1.5 py-0 border-amber-200 text-amber-700">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
          </div>
          
          {!compact && category.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {category.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {showCount && category.productCount !== undefined && (
          <Badge variant="outline" className={cn(
            "text-gray-500 dark:text-gray-400",
            compact ? "text-xs px-1.5" : "text-xs"
          )}>
            {category.productCount.toLocaleString()}
          </Badge>
        )}
        
        {!compact && (
          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        )}
      </div>
    </div>
  )
}

// Subcategory List Component
const SubcategoryList: React.FC<{
  subcategories: Subcategory[]
  onSubcategoryClick?: (subcategory: Subcategory) => void
  compact?: boolean
}> = ({ subcategories, onSubcategoryClick, compact = false }) => {
  return (
    <div className={cn(
      "space-y-1",
      compact ? "pl-2" : "pl-8"
    )}>
      {subcategories.map((subcategory) => (
        <Link
          key={subcategory.id}
          href={`/products/category/${subcategory.slug}`}
          className={cn(
            "flex items-center justify-between py-2 px-3 rounded-md transition-all",
            "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-primary"
          )}
          onClick={() => onSubcategoryClick?.(subcategory)}
        >
          <span className="text-sm truncate">{subcategory.name}</span>
          
          <div className="flex items-center gap-2">
            {subcategory.popular && (
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            )}
            
            {subcategory.productCount !== undefined && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {subcategory.productCount}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

// Skeleton Loader
const CategoryMenuSkeleton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="h-4 w-4 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className={cn(
              "h-4 rounded",
              compact ? "w-24" : "w-32"
            )} />
            {!compact && <Skeleton className="h-3 w-20 rounded" />}
          </div>
          <Skeleton className="h-4 w-8 rounded" />
        </div>
      ))}
    </div>
  )
}

// Featured Categories Component
const FeaturedCategories: React.FC<{
  categories: Category[]
  onCategoryClick?: (category: Category) => void
}> = ({ categories, onCategoryClick }) => {
  const featured = categories.filter(cat => cat.featured).slice(0, 4)
  
  if (featured.length === 0) return null
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Featured Categories
        </h3>
        <div className="flex items-center gap-1 text-sm text-primary">
          <TrendingUp className="h-4 w-4" />
          <span>Trending</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {featured.map((category) => (
          <div
            key={category.id}
            className="group relative p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            onClick={() => onCategoryClick?.(category)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {category.icon || <ShoppingBag className="h-5 w-5" />}
                  </div>
                  {category.trending && (
                    <Badge variant="secondary" className="text-xs">
                      Hot
                    </Badge>
                  )}
                </div>
                
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {category.name}
                </h4>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {category.description}
                </p>
              </div>
              
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors mt-1" />
            </div>
            
            {category.productCount !== undefined && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {category.productCount.toLocaleString()} products
                  </span>
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    Browse
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Category Menu Component
export const CategoryMenu: React.FC<CategoryMenuProps> = ({
  categories = defaultCategories,
  isLoading = false,
  onCategoryClick,
  onSubcategoryClick,
  showAllCategories = true,
  compact = false,
  className,
  showIcons = true,
  showCount = true,
  featuredCount = 3,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  // Filter categories based on featuredCount
  const displayedCategories = showAllCategories 
    ? categories 
    : categories.slice(0, featuredCount)

  // Find featured categories for featured section
  const featuredCategories = categories.filter(cat => cat.featured)

  // Handle category click
  const handleCategoryClick = (category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setExpandedCategory(expandedCategory === category.id ? null : category.id)
    }
    onCategoryClick?.(category)
  }

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setExpandedCategory(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Loading state
  if (isLoading) {
    return <CategoryMenuSkeleton compact={compact} />
  }

  return (
    <div 
      ref={menuRef}
      className={cn(
        "bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800",
        compact ? "p-2" : "p-4",
        className
      )}
    >
      {/* Header */}
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Categories
            </h2>
          </div>
          
          <Link 
            href="/products"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View all
          </Link>
        </div>
      )}

      {/* Featured Categories Section */}
      {!compact && featuredCategories.length > 0 && (
        <FeaturedCategories 
          categories={featuredCategories}
          onCategoryClick={onCategoryClick}
        />
      )}

      {/* Categories List */}
      <div className={cn(
        "space-y-1",
        compact && "space-y-0.5"
      )}>
        {displayedCategories.map((category) => {
          const isExpanded = expandedCategory === category.id
          const isHovered = hoveredCategory === category.id
          const hasSubcategories = category.subcategories && category.subcategories.length > 0

          return (
            <div 
              key={category.id}
              className="relative"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <CategoryCard
                category={category}
                onClick={handleCategoryClick}
                compact={compact}
                showIcons={showIcons}
                showCount={showCount}
              />

              {/* Subcategories Panel */}
              {hasSubcategories && (isExpanded || (!compact && isHovered)) && (
                <div className={cn(
                  "absolute left-full top-0 ml-1 z-50",
                  "w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700",
                  compact ? "hidden" : ""
                )}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {category.name}
                      </h3>
                      <Link 
                        href={`/products/category/${category.slug}`}
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        View all
                      </Link>
                    </div>
                    
                    <SubcategoryList
                      subcategories={category.subcategories!}
                      onSubcategoryClick={onSubcategoryClick}
                    />

                    {/* View all products link */}
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <Link
                        href={`/products/category/${category.slug}`}
                        className="flex items-center justify-center w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        View all {category.productCount?.toLocaleString()} products
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline subcategories for compact mode */}
              {hasSubcategories && isExpanded && compact && (
                <SubcategoryList
                  subcategories={category.subcategories!}
                  onSubcategoryClick={onSubcategoryClick}
                  compact={compact}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Stats (Desktop only) */}
      {!compact && (
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {categories.reduce((sum, cat) => sum + (cat.trending ? 1 : 0), 0)}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Trending</span>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="h-4 w-4 text-blue-500" />
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {categories.reduce((sum, cat) => sum + (cat.featured ? 1 : 0), 0)}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Featured</span>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {categories.filter(cat => cat.isNew).length}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">New</span>
            </div>
          </div>
        </div>
      )}

      {/* View All Categories Button */}
      {!compact && !showAllCategories && categories.length > featuredCount && (
        <div className="mt-4">
          <Link
            href="/categories"
            className="flex items-center justify-center w-full py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary/50"
          >
            Show all {categories.length} categories
            <ChevronDown className="ml-2 h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

// Mobile Category Menu Component
export const MobileCategoryMenu: React.FC<CategoryMenuProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Browse Categories</span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-[60vh] overflow-y-auto">
          <CategoryMenu {...props} compact showAllCategories />
        </div>
      )}
    </div>
  )
}

// Horizontal Scroll Category Menu
export const HorizontalCategoryMenu: React.FC<{
  categories: Category[]
  onCategoryClick?: (category: Category) => void
  className?: string
}> = ({ categories, onCategoryClick, className }) => {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className="flex space-x-2 pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={() => onCategoryClick?.(category)}
          >
            {category.icon}
            <span>{category.name}</span>
            {category.productCount !== undefined && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.productCount}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default CategoryMenu