import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OzH',
  description: 'OzH by BTC',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-gray-900'>{children}</body>
    </html>
  )
}
