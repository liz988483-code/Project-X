import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Sparkles, Shield, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand/Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 to-primary-700 text-white p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-3 text-2xl font-bold mb-12">
            <ShoppingBag className="h-8 w-8" />
            <span>SOKO</span>
          </Link>
          
          <div className="max-w-md space-y-10">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Join thousands of happy customers
              </h2>
              <p className="text-primary-200 text-lg">
                Shop from trusted sellers with secure payments and fast delivery.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-xl">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure Transactions</h3>
                  <p className="text-primary-200 text-sm">100% payment protection</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-xl">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Fast Delivery</h3>
                  <p className="text-primary-200 text-sm">Across 50+ countries</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-xl">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Best Prices</h3>
                  <p className="text-primary-200 text-sm">Price match guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-primary-300 text-sm">
            © {new Date().getFullYear()} SOKO Marketplace. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="flex-1 flex flex-col">
        <div className="lg:hidden p-6 border-b">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag className="h-6 w-6" />
            SOKO
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 lg:hidden">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to SOKO
              </h1>
              <p className="text-gray-600">
                Your trusted marketplace
              </p>
            </div>

            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-primary-600 hover:underline font-medium">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 hover:underline font-medium">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}