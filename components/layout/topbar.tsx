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
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getMockUserByRole } from '@/lib/mock-data'

export function Topbar() {
  const {
    currentRole,
    setCurrentRole,
    language,
    setLanguage,
    setSidebarOpen,
  } = useAppStore()
  const [notificationCount] = useState(3)
  const t = (key: string) => getTranslation(language, key)
  const user = getMockUserByRole(currentRole)

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
            {currentRole === 'expéditeur'
              ? t('shipper')
              : currentRole === 'transporteur'
                ? t('carrier')
                : currentRole === 'client'
                  ? t('client')
                  : t('admin')}{' '}
            Dashboard
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

          {/* Role Switcher (Demo) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'px-3 py-2 rounded-lg transition-colors text-sm font-medium',
                  'bg-primary/10 text-primary hover:bg-primary/20',
                )}
              >
                {currentRole === 'expéditeur'
                  ? '📦'
                  : currentRole === 'transporteur'
                    ? '🚚'
                    : currentRole === 'client'
                      ? '👤'
                      : '👨‍💼'}{' '}
                {currentRole}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setCurrentRole('admin')}
                className={currentRole === 'admin' ? 'bg-sidebar-accent/10' : ''}
              >
                👨‍💼 Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setCurrentRole('expéditeur')}
                className={currentRole === 'expéditeur' ? 'bg-sidebar-accent/10' : ''}
              >
                📦 Expéditeur
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setCurrentRole('transporteur')}
                className={currentRole === 'transporteur' ? 'bg-sidebar-accent/10' : ''}
              >
                🚚 Transporteur
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setCurrentRole('client')}
                className={currentRole === 'client' ? 'bg-sidebar-accent/10' : ''}
              >
                👤 Client Final
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
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                {t('profile')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="w-4 h-4 mr-2">⚙️</span>
                {t('settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
