import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Reset your password</h1>
        <p className="text-gray-600 mt-2">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ForgotPasswordForm />
      </Suspense>

      <div className="text-center text-sm">
        <p className="text-gray-600">
          Remember your password?{' '}
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