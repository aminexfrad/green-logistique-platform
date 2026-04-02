'use client'

import { useAppStore } from '@/lib/store'
import { getTranslation } from '@/lib/translations'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Leaf, Package, Truck, User } from 'lucide-react'

export default function Home() {
  const { currentRole, setCurrentRole, language } = useAppStore()
  const router = useRouter()
  const t = (key: string) => getTranslation(language, key)

  // Auto-redirect if role is already selected
  useEffect(() => {
    if (currentRole === 'admin') {
      router.push('/dashboard/admin')
    } else if (currentRole === 'expéditeur') {
      router.push('/dashboard/shipper')
    } else if (currentRole === 'transporteur') {
      router.push('/dashboard/carrier')
    } else if (currentRole === 'client') {
      router.push('/dashboard/client/track')
    }
  }, [currentRole, router])

  const roles = [
    {
      id: 'admin' as const,
      title: 'Administrator',
      description: 'Manage users, validate carriers, and oversee platform operations',
      icon: '👨‍💼',
      color: 'from-blue-500 to-blue-600',
      highlight: 'bg-blue-500/20',
    },
    {
      id: 'expéditeur' as const,
      title: 'Expéditeur (Shipper)',
      description: 'Create shipments, track deliveries, and manage carbon emissions',
      icon: '📦',
      color: 'from-green-500 to-emerald-600',
      highlight: 'bg-green-500/20',
    },
    {
      id: 'transporteur' as const,
      title: 'Transporteur (Carrier)',
      description: 'Manage missions, fleet, and track your green score',
      icon: '🚚',
      color: 'from-orange-500 to-red-600',
      highlight: 'bg-orange-500/20',
    },
    {
      id: 'client' as const,
      title: 'Client Final (Customer)',
      description: 'Track your shipments and view carbon impact',
      icon: '👤',
      color: 'from-purple-500 to-pink-600',
      highlight: 'bg-purple-500/20',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <Leaf className="w-7 h-7 text-background" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="text-primary">Green</span>
                <span className="text-foreground"> Logistique</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {t('welcomeMessage')}
            </p>
            <p className="text-muted-foreground mt-2">{t('selectRole')}</p>
          </motion.div>

          {/* Role Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
          >
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative group cursor-pointer`}
                onClick={() => setCurrentRole(role.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 rounded-xl transition-all duration-300 blur-xl`} />
                <div
                  className={`relative rounded-xl border border-border bg-card p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-xl ${role.highlight}`}
                >
                  <div className="mb-4 text-5xl">{role.icon}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {role.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {role.description}
                  </p>
                  <Button
                    className="w-full bg-primary text-background hover:bg-primary/90"
                    onClick={() => setCurrentRole(role.id)}
                  >
                    Select Role
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center text-sm text-muted-foreground"
          >
            <p>Click on a role card to access the corresponding dashboard</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
