import axios from 'axios'
import { API_CONFIG } from './config'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
  isSeller: boolean
  isAdmin: boolean
  preferences?: any
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
  acceptTerms: boolean
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

class AuthService {
  private baseURL = API_CONFIG.baseURL

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, credentials)
      this.setAuthTokens(response.data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/auth/register`, data)
      this.setAuthTokens(response.data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async socialLogin(data: {
    provider: string
    accessToken: string
    email: string
    name: string
  }): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/auth/social`, data)
      this.setAuthTokens(response.data)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getToken()
      if (token) {
        await axios.post(`${this.baseURL}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } finally {
      this.clearAuthTokens()
      // Clear all storage
      localStorage.clear()
      sessionStorage.clear()
      // Redirect to home
      window.location.href = '/'
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await axios.post(`${this.baseURL}/auth/refresh`, {
        refreshToken
      })

      this.setAuthTokens(response.data)
      return response.data.token
    } catch (error) {
      this.clearAuthTokens()
      throw error
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/auth/forgot-password`, { email })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/auth/reset-password`, {
        token,
        password
      })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/auth/verify-email`, { token })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No authentication token')
      }

      const response = await axios.get(`${this.baseURL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const token = this.getToken()
      const response = await axios.put(`${this.baseURL}/auth/profile`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async changePassword(data: {
    currentPassword: string
    newPassword: string
  }): Promise<void> {
    try {
      const token = this.getToken()
      await axios.post(`${this.baseURL}/auth/change-password`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Token management
  setAuthTokens(data: { token: string; refreshToken: string }) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
    // Set token expiry (assuming 1 hour expiry)
    const expiry = new Date()
    expiry.setHours(expiry.getHours() + 1)
    localStorage.setItem('tokenExpiry', expiry.toISOString())
  }

  getToken(): string | null {
    const token = localStorage.getItem('token')
    const expiry = localStorage.getItem('tokenExpiry')
    
    if (!token || !expiry) {
      return null
    }

    // Check if token is expired
    if (new Date(expiry) < new Date()) {
      return null
    }

    return token
  }

  clearAuthTokens() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('tokenExpiry')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  getUserRole(): string | null {
    const token = this.getToken()
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.role
    } catch {
      return null
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      return new Error(message)
    }
    return error
  }
}

export const authService = new AuthService()