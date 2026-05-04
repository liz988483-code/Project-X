// frontend/web/hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react'
import { Product, ProductFilter } from '@/types/product'

export const useProducts = (initialFilters: ProductFilter = {}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilter>(initialFilters)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock API call - replace with actual API
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Wireless Headphones',
          description: 'Premium noise-cancelling headphones',
          price: 199.99,
          originalPrice: 249.99,
          discount: 20,
          category: 'electronics',
          subcategory: 'audio',
          brand: 'SoundMax',
          sku: 'SM-WH-001',
          images: ['/images/headphones.jpg'],
          rating: 4.5,
          reviewCount: 128,
          stock: 50,
          sellerId: 'seller_001',
          sellerName: 'SoundMax Store',
          tags: ['wireless', 'bluetooth', 'noise-cancelling'],
          specifications: {
            'Battery Life': '30 hours',
            'Connectivity': 'Bluetooth 5.0',
            'Weight': '250g'
          },
          shippingInfo: {
            freeShipping: true,
            estimatedDelivery: '3-5 business days',
            returnPolicy: '30-day return policy'
          },
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        }
        // Add more mock products as needed
      ]
      
      setProducts(mockProducts)
      applyFilters(mockProducts, filters)
    } catch (err) {
      setError('Failed to fetch products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const applyFilters = (productsList: Product[], currentFilters: ProductFilter) => {
    let filtered = [...productsList]

    if (currentFilters.category) {
      filtered = filtered.filter(p => p.category === currentFilters.category)
    }

    if (currentFilters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= currentFilters.minPrice!)
    }

    if (currentFilters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= currentFilters.maxPrice!)
    }

    if (currentFilters.rating) {
      filtered = filtered.filter(p => p.rating >= currentFilters.rating!)
    }

    if (currentFilters.brand && currentFilters.brand.length > 0) {
      filtered = filtered.filter(p => 
        currentFilters.brand!.includes(p.brand || '')
      )
    }

    if (currentFilters.sortBy) {
      switch (currentFilters.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
          filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          break
        case 'popular':
          filtered.sort((a, b) => b.reviewCount - a.reviewCount)
          break
      }
    }

    setFilteredProducts(filtered)
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    applyFilters(products, filters)
  }, [filters, products])

  const updateFilters = (newFilters: Partial<ProductFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  return {
    products,
    filteredProducts,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch: fetchProducts
  }
}