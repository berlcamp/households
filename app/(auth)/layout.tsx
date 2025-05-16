'use client'

import { AppSidebar } from '@/components/AppSidebar'
import { AuthGuard } from '@/components/AuthGuard'
import { OfflineDetector } from '@/components/OfflineDetector'
import StickyHeader from '@/components/StickyHeader'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Providers } from '@/lib/redux/providers'
import { Toaster } from 'react-hot-toast'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Toaster />
      <OfflineDetector />
      <Providers>
        <AuthGuard>
          <SidebarProvider>
            <AppSidebar />
            <StickyHeader />
            <main className="w-full">
              <div className="mt-16">{children}</div>
            </main>
          </SidebarProvider>
        </AuthGuard>
      </Providers>
    </>
  )
}
