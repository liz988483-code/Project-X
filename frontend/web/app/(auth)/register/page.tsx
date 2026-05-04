import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RegisterForm } from '@/components/forms/RegisterForm'
import { SocialLogin } from '@/components/forms/SocialLogin'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
        <p className="text-gray-600 mt-2">
          Join SOKO marketplace today
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <RegisterForm />
      </Suspense>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <SocialLogin />

      <div className="text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}