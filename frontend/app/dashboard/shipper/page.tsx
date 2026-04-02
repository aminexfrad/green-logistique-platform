'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { KPICard } from '@/components/shared/kpi-card'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { getTranslation } from '@/lib/translations'
import { mockShipments } from '@/lib/mock-data'
import {
  BarChart3,
  PackageOpen,
  Leaf,
  TrendingDown,
  Plus,
  Eye,
  AlertCircle,
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ShipmentForm } from '@/components/shared/shipment-form'

const monthlyData = [
  { month: 'Jan', shipments: 12, co2: 520 },
  { month: 'Feb', shipments: 18, co2: 680 },
  { month: 'Mar', shipments: 24, co2: 890 },
  { month: 'Apr', shipments: 28, co2: 950 },
  { month: 'May', shipments: 32, co2: 1100 },
  { month: 'Jun', shipments: 38, co2: 1250 },
]

const transportModeData = [
  { name: 'Road', value: 45, emissions: 450 },
  { name: 'Rail', value: 25, emissions: 150 },
  { name: 'Maritime', value: 20, emissions: 80 },
  { name: 'Air', value: 10, emissions: 400 },
]

const COLORS = ['#ff7c7c', '#ff9f4a', '#ffcc4d', '#4dc8ff']

export default function ShipperDashboard() {
  const { language } = useAppStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const t = (key: string) => getTranslation(language, key)

  const shipmentColumns = [
    {
      key: 'id',
      label: 'Tracking #',
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
    {
      key: 'co2Kg',
      label: 'CO2 (kg)',
      render: (value: number) => (
        <span className="font-semibold text-primary">{value.toFixed(1)}</span>
      ),
      sortable: true,
    },
    {
      key: 'deliveryDate',
      label: 'Est. Delivery',
      sortable: true,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Shipper Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your shipments and track carbon emissions
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-background hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" />
                New Shipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Shipment</DialogTitle>
              </DialogHeader>
              <ShipmentForm
                onSubmit={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title={t('totalShipments')}
            value="142"
            icon={PackageOpen}
            unit="shipments"
            trend={{ value: 12, direction: 'up' }}
            color="primary"
          />
          <KPICard
            title={t('totalCO2')}
            value="3,240"
            icon={Leaf}
            unit="kg"
            trend={{ value: 8, direction: 'up' }}
            color="secondary"
          />
          <KPICard
            title={t('compensatedCO2')}
            value="1,200"
            icon={TrendingDown}
            unit="kg"
            trend={{ value: 15, direction: 'up' }}
            color="accent"
          />
          <KPICard
            title={t('esgScore')}
            value="78/100"
            icon={BarChart3}
            color="primary"
            description="Silver Certification"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Monthly Shipments & CO2
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="shipments"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                  name="Shipments"
                />
                <Line
                  type="monotone"
                  dataKey="co2"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  dot={false}
                  name="CO2 (kg)"
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Transport Mode Distribution */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Transport Mode Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={transportModeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${entry.value}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {transportModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="rounded-xl border border-border bg-card p-6 border-yellow-500/30 bg-yellow-500/5">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Active Alerts
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div>
                <p className="font-medium text-foreground">
                  CO2 Threshold Alert
                </p>
                <p className="text-sm text-muted-foreground">
                  You&apos;ve reached 85% of your monthly CO2 limit
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div>
                <p className="font-medium text-foreground">
                  Carrier Recommendation
                </p>
                <p className="text-sm text-muted-foreground">
                  EcoTrans Express has a new green-certified route available
                </p>
              </div>
              <Button variant="outline" size="sm">
                Explore
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Shipments */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">
            Recent Shipments
          </h3>
          <DataTable
            columns={shipmentColumns}
            data={mockShipments}
            searchPlaceholder="Search shipments..."
            actions={(row) => (
              <button className="p-2 hover:bg-sidebar-accent/10 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            )}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
