import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - SOKO',
  description: 'Create your SOKO account',
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}