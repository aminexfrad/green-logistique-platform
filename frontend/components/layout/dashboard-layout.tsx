'use client'

import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { useAppStore } from '@/lib/store'
import { useEffect } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarOpen, language, hydrateAuth } = useAppStore()

  useEffect(() => {
    hydrateAuth()
  }, [hydrateAuth])

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
