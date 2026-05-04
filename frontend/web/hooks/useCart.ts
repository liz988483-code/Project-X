// frontend/web/hooks/useCart.ts
import { useState, useEffect } from 'react'
import { CartItem } from '@/types/cart'

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          setCart(JSON.parse(savedCart))
        }
      } catch (error) {
        console.error('Failed to load cart:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadCart()
  }, [])

  const addToCart = (product: {
    id: string
    productId: string
    price: number
    name: string
    image: string
  }, quantity: number = 1) => {
    setCart((prev: CartItem[]) => {
      const existingItem = prev.find(item => item.productId === product.productId)
      let newCart: CartItem[]
      
      if (existingItem) {
        newCart = prev.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        newCart = [...prev, {
          id: product.id,
          productId: product.productId,
          quantity,
          price: product.price,
          name: product.name,
          image: product.image
        }]
      }
      
      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev: CartItem[]) => {
      const newCart = prev.filter(item => item.productId !== productId)
      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prev: CartItem[]) => {
      const newCart = prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + (item.quantity * item.price), 0)
  }

  const getItemCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount
  }
}