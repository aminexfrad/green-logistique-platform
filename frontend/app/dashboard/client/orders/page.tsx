'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAppStore } from '@/lib/store'
import { getTranslation } from '@/lib/translations'
import { fetchOrders } from '@/lib/api'
import { Eye, Leaf, Clock, CheckCircle2 } from 'lucide-react'
import type { Shipment } from '@/lib/mock-data'

export default function ClientOrders() {
  const { language } = useAppStore()
  const t = (key: string) => getTranslation(language, key)
  const [orders, setOrders] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
      .then((data) => setOrders(data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  const orderColumns = [
    {
      key: 'id',
      label: 'Order #',
      sortable: true,
    },
    {
      key: 'origin',
      label: 'Ship From',
      sortable: true,
    },
    {
      key: 'destination',
      label: 'Ship To',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const colors: { [key: string]: string } = {
          created: 'bg-blue-500/20 text-blue-500',
          inTransit: 'bg-yellow-500/20 text-yellow-500',
          delivered: 'bg-green-500/20 text-green-500',
          cancelled: 'bg-red-500/20 text-red-500',
          incident: 'bg-red-500/20 text-red-500',
        }
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colors[value]}`}>
            {value}
          </span>
        )
      },
    },
    {
      key: 'deliveryDate',
      label: 'Est. Delivery',
      sortable: true,
    },
  ]

  const totalCO2 = orders.reduce((sum, s) => sum + (s.co2Kg || 0), 0)
  const greenOrders = orders.filter((s) => s.transportMode === 'maritime' || s.transportMode === 'rail')
  const orderCount = orders.length

  const stats = [
    {
      icon: CheckCircle2,
      label: 'Total Orders',
      value: orderCount,
      color: 'primary',
    },
    {
      icon: Clock,
      label: 'In Transit',
      value: orders.filter((s) => s.status === 'inTransit').length,
      color: 'yellow-500',
    },
    {
      icon: CheckCircle2,
      label: 'Delivered',
      value: orders.filter((s) => s.status === 'delivered').length,
      color: 'green-500',
    },
    {
      icon: Leaf,
      label: 'Total CO2 Impact',
      value: `${totalCO2.toFixed(0)} kg`,
      color: 'primary',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground">View and manage all your shipments and orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            const colorClass = stat.color === 'primary' ? 'text-primary' : `text-${stat.color}`
            return (
              <Card key={stat.label} className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color === 'primary' ? 'bg-primary/10 text-primary' : `bg-${stat.color}/10 ${colorClass}`}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold ${colorClass}`}>{stat.value}</p>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">All Orders</h3>
          <DataTable
            columns={orderColumns}
            data={orders}
            loading={loading}
            searchPlaceholder="Search orders..."
            actions={(row) => (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  window.location.href = `/dashboard/client/track?tracking=${row.trackingNumber}`
                }}
              >
                <Eye className="w-4 h-4" />
                Track
              </Button>
            )}
          />
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Your Environmental Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Total CO2 Generated</p>
              <p className="text-3xl font-bold text-primary">{totalCO2.toFixed(0)} kg</p>
              <p className="text-xs text-muted-foreground mt-2">This year</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Green Shipments</p>
              <p className="text-3xl font-bold text-green-500">
                {orderCount ? Math.round((greenOrders.length / orderCount) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground mt-2">Using eco-friendly transport</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Equivalent to...</p>
              <p className="text-3xl font-bold text-secondary">
                {orderCount ? (totalCO2 / 21).toFixed(0) : '0'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">trees planted</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
