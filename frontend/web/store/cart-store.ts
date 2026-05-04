import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  sellerId: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          
          if (existingItem) {
            const updatedItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
            return { items: updatedItems }
          } else {
            return { items: [...state.items, { ...item, quantity: 1 }] }
          }
        })
        get().getTotal()
        get().getItemCount()
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
        get().getTotal()
        get().getItemCount()
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }))
        get().getTotal()
        get().getItemCount()
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 })
      },

      getItemCount: () => {
        const count = get().items.reduce((sum, item) => sum + item.quantity, 0)
        set({ itemCount: count })
        return count
      },

      getTotal: () => {
        const total = get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
        set({ total })
        return total
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)