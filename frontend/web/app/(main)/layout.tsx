import type { Metadata } from 'next'
import '../globals.css'
import { Toaster } from '@/components/ui/toast'

export const metadata: Metadata = {
  title: 'SOKO Marketplace',
  description: 'Your trusted marketplace',
  keywords: ['ecommerce', 'marketplace', 'shopping', 'online store'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
