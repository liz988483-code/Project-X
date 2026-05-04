export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  emailVerified: boolean
  phoneVerified: boolean
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Buyer extends User {
  role: 'buyer'
  shippingAddresses: Address[]
  billingAddress?: Address
  wishlist: string[]
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

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  userType: 'buyer' | 'seller'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}
