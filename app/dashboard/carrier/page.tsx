'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { KPICard } from '@/components/shared/kpi-card'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { getTranslation } from '@/lib/translations'
import { mockShipments, mockCarriers } from '@/lib/mock-data'
import {
  Activity,
  CheckCircle,
  Leaf,
  Star,
  Eye,
  Check,
  X,
} from 'lucide-react'
import { LinearProgress } from '@/components/ui/progress'

export default function CarrierDashboard() {
  const { language } = useAppStore()
  const t = (key: string) => getTranslation(language, key)
  const carrier = mockCarriers[0]

  const missionColumns = [
    {
      key: 'id',
      label: 'Shipment ID',
      sortable: true,
    },
    {
      key: 'origin',
      label: 'From',
      sortable: true,
    },
    {
      key: 'destination',
      label: 'To',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const statusColors: { [key: string]: string } = {
          created: 'bg-blue-500/20 text-blue-500',
          inTransit: 'bg-yellow-500/20 text-yellow-500',
          delivered: 'bg-green-500/20 text-green-500',
          cancelled: 'bg-red-500/20 text-red-500',
          incident: 'bg-red-500/20 text-red-500',
        }
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[value]}`}>
            {value}
          </span>
        )
      },
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Carrier Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage missions and track your green performance
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Active Missions"
            value="8"
            icon={Activity}
            unit="missions"
            trend={{ value: 3, direction: 'up' }}
            color="primary"
          />
          <KPICard
            title="Completed Deliveries"
            value="156"
            icon={CheckCircle}
            unit="deliveries"
            trend={{ value: 12, direction: 'up' }}
            color="secondary"
          />
          <KPICard
            title="Green Score"
            value="92/100"
            icon={Leaf}
            color="accent"
            description="Gold Certified"
          />
          <KPICard
            title="Average Rating"
            value="4.8"
            icon={Star}
            unit="/ 5"
            trend={{ value: 2, direction: 'up' }}
            color="primary"
          />
        </div>

        {/* Fleet Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {carrier.vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-foreground">
                    {vehicle.type === 'dieselTruck'
                      ? 'Diesel Truck'
                      : vehicle.type === 'electricTruck'
                        ? 'Electric Truck'
                        : vehicle.type === 'hybridTruck'
                          ? 'Hybrid Truck'
                          : 'Van'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
                </div>
                {vehicle.fuelType === 'electric' && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full font-medium">
                    Green
                  </span>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-semibold">{vehicle.capacityKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CO2 Factor:</span>
                  <span className="font-semibold text-primary">
                    {vehicle.co2Factor} g/t.km
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">
            Performance Metrics
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  On-Time Delivery Rate
                </span>
                <span className="text-sm font-bold text-primary">96%</span>
              </div>
              <div className="h-2 bg-sidebar-accent/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: '96%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Green Shipments (%)
                </span>
                <span className="text-sm font-bold text-green-500">78%</span>
              </div>
              <div className="h-2 bg-sidebar-accent/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: '78%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Customer Satisfaction
                </span>
                <span className="text-sm font-bold text-secondary">92%</span>
              </div>
              <div className="h-2 bg-sidebar-accent/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full"
                  style={{ width: '92%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Missions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">
            Current Missions
          </h3>
          <DataTable
            columns={missionColumns}
            data={mockShipments.filter((s) => s.status !== 'cancelled')}
            searchPlaceholder="Search missions..."
            actions={(row) => (
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-green-500/10 rounded-lg text-green-500 hover:text-green-600 transition-colors">
                  <Check className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 hover:text-red-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
