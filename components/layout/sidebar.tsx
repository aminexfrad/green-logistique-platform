'use client'

import { useAppStore } from '@/lib/store'
import { getTranslation } from '@/lib/translations'
import {
  BarChart3,
  PackageOpen,
  Truck,
  Leaf,
  FileText,
  Settings,
  LogOut,
  Users,
  BadgeCheck,
  ShoppingCart,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const { currentRole, language, sidebarOpen } = useAppStore()
  const t = (key: string) => getTranslation(language, key)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const navigationByRole = {
    admin: [
      {
        label: t('dashboard'),
        href: '/dashboard/admin',
        icon: BarChart3,
        id: 'dashboard',
      },
      {
        label: t('shipments'),
        href: '/dashboard/admin/shipments',
        icon: PackageOpen,
        id: 'shipments',
      },
      {
        label: 'User Management',
        href: '/dashboard/admin/users',
        icon: Users,
        id: 'users',
      },
      {
        label: 'Carrier Validation',
        href: '/dashboard/admin/carriers',
        icon: BadgeCheck,
        id: 'carriers',
      },
      {
        label: t('carbonMarketplace'),
        href: '/dashboard/admin/carbon',
        icon: Leaf,
        id: 'carbon',
      },
      {
        label: 'Audit Logs',
        href: '/dashboard/admin/logs',
        icon: FileText,
        id: 'logs',
      },
    ],
    expéditeur: [
      {
        label: t('dashboard'),
        href: '/dashboard/shipper',
        icon: BarChart3,
        id: 'dashboard',
      },
      {
        label: t('shipments'),
        href: '/dashboard/shipper/shipments',
        icon: PackageOpen,
        id: 'shipments',
      },
      {
        label: 'Carrier Network',
        href: '/dashboard/shipper/carriers',
        icon: Truck,
        id: 'carriers',
      },
      {
        label: t('carbonMarketplace'),
        href: '/dashboard/shipper/carbon',
        icon: Leaf,
        id: 'carbon',
      },
      {
        label: 'ESG Reports',
        href: '/dashboard/shipper/reports',
        icon: FileText,
        id: 'reports',
      },
    ],
    transporteur: [
      {
        label: t('dashboard'),
        href: '/dashboard/carrier',
        icon: BarChart3,
        id: 'dashboard',
      },
      {
        label: 'My Missions',
        href: '/dashboard/carrier/missions',
        icon: PackageOpen,
        id: 'missions',
      },
      {
        label: 'Fleet Management',
        href: '/dashboard/carrier/fleet',
        icon: Truck,
        id: 'fleet',
      },
      {
        label: 'Green Score',
        href: '/dashboard/carrier/score',
        icon: Leaf,
        id: 'score',
      },
      {
        label: 'Reviews',
        href: '/dashboard/carrier/reviews',
        icon: BarChart2,
        id: 'reviews',
      },
    ],
    client: [
      {
        label: 'Track Shipment',
        href: '/dashboard/client/track',
        icon: PackageOpen,
        id: 'track',
      },
      {
        label: 'My Orders',
        href: '/dashboard/client/orders',
        icon: ShoppingCart,
        id: 'orders',
      },
    ],
  }

  const navItems = navigationByRole[currentRole as keyof typeof navigationByRole] || []

  if (!sidebarOpen) {
    return null
  }

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={cn(
        'h-full bg-card border-r border-border overflow-y-auto transition-all duration-300',
        'w-64',
      )}
    >
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-background" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary">Green</h1>
            <p className="text-xs text-muted-foreground">Logistique</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/10',
                'text-sm',
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-border bg-card p-4">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/10 text-sm',
            'mb-2',
          )}
        >
          <Settings className="w-4 h-4" />
          <span>{t('settings')}</span>
        </Link>
        <button
          className={cn(
            'w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
            'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/10 text-sm',
          )}
        >
          <LogOut className="w-4 h-4" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  )
}
