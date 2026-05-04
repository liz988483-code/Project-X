import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - SOKO',
  description: 'Sign in to your SOKO account',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}