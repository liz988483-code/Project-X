// frontend/web/types/cart.ts
export interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
  name: string
  image: string
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}