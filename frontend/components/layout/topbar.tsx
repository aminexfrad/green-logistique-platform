'use client'

import { useAppStore } from '@/lib/store'
import { getTranslation } from '@/lib/translations'
import {
  Bell,
  Globe,
  Menu,
  User,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Topbar() {
  const {
    authUser,
    language,
    setLanguage,
    setSidebarOpen,
    logout,
  } = useAppStore()
  const [notificationCount] = useState(3)
  const router = useRouter()
  const t = (key: string) => getTranslation(language, key)

  const user = authUser ?? {
    name: 'Guest User',
    email: 'guest@greenlogistique.com',
    role: 'client' as const,
  }

  const roleLabel =
    user.role === 'shipper'
      ? t('shipper')
      : user.role === 'carrier'
      ? t('carrier')
      : user.role === 'client'
      ? t('client')
      : t('admin')

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleProfile = () => {
    if (!authUser) {
      router.push('/')
      return
    }

    switch (authUser.role) {
      case 'carrier':
        router.push('/dashboard/carrier/profile')
        break
      case 'shipper':
        router.push('/dashboard/shipper')
        break
      case 'client':
        router.push('/dashboard/client/track')
        break
      case 'admin':
        router.push('/dashboard/admin')
        break
      default:
        router.push('/dashboard/client/track')
    }
  }

  const handleSettings = () => {
    router.push('/dashboard/settings')
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen((prev: boolean) => !prev)}
            className={cn(
              'p-2 hover:bg-sidebar-accent/10 rounded-lg transition-colors',
              'text-muted-foreground hover:text-foreground',
            )}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold text-foreground capitalize">
            {roleLabel} Dashboard
          </h2>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'p-2 hover:bg-sidebar-accent/10 rounded-lg transition-colors',
                  'text-muted-foreground hover:text-foreground',
                )}
              >
                <Globe className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLanguage('fr')}
                className={language === 'fr' ? 'bg-sidebar-accent/10' : ''}
              >
                🇫🇷 Français
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-sidebar-accent/10' : ''}
              >
                🇬🇧 English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('ar')}
                className={language === 'ar' ? 'bg-sidebar-accent/10' : ''}
              >
                🇸🇦 العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 hover:bg-sidebar-accent/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div>
                  <p className="font-medium text-sm">New shipment request</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div>
                  <p className="font-medium text-sm">Delivery completed</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div>
                  <p className="font-medium text-sm">Carbon credit purchase confirmed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'p-2 hover:bg-sidebar-accent/10 rounded-lg transition-colors',
                  'text-muted-foreground hover:text-foreground',
                )}
              >
                <User className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                <User className="w-4 h-4 mr-2" />
                {t('profile')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>
                <span className="w-4 h-4 mr-2">⚙️</span>
                {t('settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <LogOut className="w-4 h-4 mr-2" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
