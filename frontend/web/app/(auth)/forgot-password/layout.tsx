import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password - SOKO',
  description: 'Reset your SOKO account password',
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}