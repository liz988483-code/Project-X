export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
  CATEGORY: (categoryId: string | number) => `/category/${categoryId}`,
  SEARCH: '/search',
  
  // Cart & Checkout
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_SHIPPING: '/checkout/shipping',
  CHECKOUT_PAYMENT: '/checkout/payment',
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: (orderId: string | number) => `/orders/${orderId}`,
  ORDER_TRACKING: '/orders/tracking',
  
  // Account
  ACCOUNT: '/account',
  PROFILE: '/account/profile',
  ADDRESS_BOOK: '/account/address-book',
  WISHLIST: '/account/wishlist',
  SETTINGS: '/account/settings',
  
  // Sellers
  SELLERS: '/sellers',
  SELLER_DETAIL: (sellerId: string | number) => `/sellers/${sellerId}`,
  SELLER_STORE: (sellerId: string | number) => `/sellers/${sellerId}/store`,
  SELLER_DASHBOARD: '/seller/dashboard',
  
  // Messages
  MESSAGES: '/messages',
  CHAT: (chatId: string | number) => `/messages/${chatId}`,
  
  // Support
  SUPPORT: '/support',
  TICKET: (ticketId: string | number) => `/support/tickets/${ticketId}`,
  
  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
} as const