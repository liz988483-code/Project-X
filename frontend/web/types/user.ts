export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string  // Add this
  role: 'buyer' | 'seller' | 'admin'
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Buyer extends User {
  role: 'buyer'
  shippingAddresses: Address[]
  billingAddress?: Address
  wishlist: number[]
  orders: string[]
}

export interface Seller extends User {
  role: 'seller'
  storeName: string
  storeDescription?: string
  storeLogo?: string
  storeBanner?: string
  rating: number
  totalSales: number
  productCount: number
  verified: boolean
  businessInfo: {
    taxId?: string
    businessType: string
    registrationNumber?: string
  }
}

export interface Address {
  id: string
  userId: string
  type: 'shipping' | 'billing'
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  phone: string
  isDefault: boolean
}