import type { Address } from './user'

export interface OrderItem {
  id: string
  productId: number
  productName: string
  productImage: string
  price: number
  quantity: number
  sellerId: string
  sellerName: string
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  shippingAddress: Address
  billingAddress: Address
  trackingNumber?: string
  estimatedDelivery?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}
