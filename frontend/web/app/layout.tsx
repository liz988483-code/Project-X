import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toast'
import Header from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'SOKO Marketplace',
  description: 'Your trusted marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
