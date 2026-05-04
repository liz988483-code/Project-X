'use client'

import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook, FaApple, FaGithub } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth-store'

export function SocialLogin() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(provider)
    try {
      // Implement social login logic here
      console.log(`Logging in with ${provider}`)
      // await signIn(provider)
    } catch (error) {
      console.error(`${provider} login failed:`, error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => handleSocialLogin('google')}
        disabled={!!isLoading}
        className="w-full"
      >
        <FcGoogle className="h-5 w-5 mr-2" />
        {isLoading === 'google' ? 'Connecting...' : 'Google'}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => handleSocialLogin('facebook')}
        disabled={!!isLoading}
        className="w-full"
      >
        <FaFacebook className="h-5 w-5 mr-2 text-blue-600" />
        {isLoading === 'facebook' ? 'Connecting...' : 'Facebook'}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => handleSocialLogin('apple')}
        disabled={!!isLoading}
        className="w-full"
      >
        <FaApple className="h-5 w-5 mr-2" />
        {isLoading === 'apple' ? 'Connecting...' : 'Apple'}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => handleSocialLogin('github')}
        disabled={!!isLoading}
        className="w-full"
      >
        <FaGithub className="h-5 w-5 mr-2" />
        {isLoading === 'github' ? 'Connecting...' : 'GitHub'}
      </Button>
    </div>
  )
}