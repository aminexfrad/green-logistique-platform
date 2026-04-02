'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  unit?: string
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  color?: 'primary' | 'secondary' | 'accent' | 'destructive'
  description?: string
}

export function KPICard({
  title,
  value,
  icon: Icon,
  unit,
  trend,
  color = 'primary',
  description,
}: KPICardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    destructive: 'bg-destructive/10 text-destructive',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl border border-border bg-card p-6',
        'hover:shadow-lg transition-all duration-300',
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-medium',
                trend.direction === 'up' ? 'text-primary' : 'text-destructive',
              )}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
