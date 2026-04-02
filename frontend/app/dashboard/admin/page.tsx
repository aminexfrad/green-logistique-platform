'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { KPICard } from '@/components/shared/kpi-card'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { getTranslation } from '@/lib/translations'
import { fetchShipments, fetchUsers } from '@/lib/api'
import { BarChart3, Users, PackageOpen, Leaf, Eye, Trash2, Shield } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import type { Shipment, User } from '@/lib/mock-data'

const co2Data = [
  { month: 'Jan', emissions: 450, compensated: 100 },
  { month: 'Feb', emissions: 520, compensated: 150 },
  { month: 'Mar', emissions: 680, compensated: 200 },
  { month: 'Apr', emissions: 590, compensated: 250 },
  { month: 'May', emissions: 720, compensated: 300 },
  { month: 'Jun', emissions: 650, compensated: 350 },
]

const usageData = [
  { day: 'Mon', users: 240, shipments: 35 },
  { day: 'Tue', users: 290, shipments: 42 },
  { day: 'Wed', users: 340, shipments: 48 },
  { day: 'Thu', users: 380, shipments: 55 },
  { day: 'Fri', users: 450, shipments: 65 },
  { day: 'Sat', users: 380, shipments: 48 },
  { day: 'Sun', users: 320, shipments: 40 },
]

export default function AdminDashboard() {
  const { language } = useAppStore()
  const t = (key: string) => getTranslation(language, key)
  const [users, setUsers] = useState<User[]>([])
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    Promise.all([fetchUsers(), fetchShipments()])
      .then(([usersData, shipmentsData]) => {
        setUsers(usersData)
        setShipments(shipmentsData)
      })
      .catch(() => {
        setUsers([])
        setShipments([])
      })
      .finally(() => setLoading(false))
  }, [])

  const totalCO2 = shipments.reduce((sum, shipment) => {
    const co2 = Number(shipment.co2Kg ?? shipment.co2_kg ?? 0)
    return sum + (Number.isFinite(co2) ? co2 : 0)
  }, 0)

  const userColumns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => (
        <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium capitalize">
          {value}
        </span>
      ),
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value === 'active'
            ? 'bg-primary/20 text-primary'
            : 'bg-destructive/20 text-destructive'
        }`}>
          {value === 'active' ? '✓ Active' : 'Inactive'}
        </span>
      ),
    },
  ]

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
      render: (value: number, row: any) => {
        const co2 = typeof value === 'number' ? value : Number(row?.co2Kg ?? row?.co2_kg ?? 0)
        return (
          <span className="font-semibold text-foreground">{Number.isFinite(co2) ? co2.toFixed(1) : '0.0'}</span>
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
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage platform operations and monitor system health
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title={t('total')}
            value={users.length}
            icon={Users}
            unit="users"
            trend={{ value: 12, direction: 'up' }}
            color="primary"
          />
          <KPICard
            title="Total Shipments"
            value={shipments.length}
            icon={PackageOpen}
            unit="shipments"
            trend={{ value: 8, direction: 'up' }}
            color="secondary"
          />
          <KPICard
            title="Total CO2 Emissions"
            value={totalCO2.toFixed(0)}
            icon={Leaf}
            unit="kg"
            trend={{ value: 5, direction: 'down' }}
            color="accent"
          />
          <KPICard
            title="Carbon Credits Sold"
            value={Math.round(shipments.length * 0.6)}
            icon={BarChart3}
            unit="tons"
            trend={{ value: 15, direction: 'up' }}
            color="primary"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CO2 Evolution */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              CO2 Evolution & Compensation
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={co2Data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
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
                  dataKey="emissions"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  dot={false}
                  name="Total Emissions"
                />
                <Line
                  type="monotone"
                  dataKey="compensated"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                  name="Compensated"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Usage */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Weekly Platform Usage
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="users"
                  fill="var(--primary)"
                  name="Active Users"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="shipments"
                  fill="var(--secondary)"
                  name="Shipments Created"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">
              User Management
            </h3>
            <Button className="bg-primary text-background hover:bg-primary/90">
              Add User
            </Button>
          </div>
          <DataTable
            columns={userColumns}
            data={users}
            searchPlaceholder="Search users..."
            actions={(row) => (
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-sidebar-accent/10 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-sidebar-accent/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        </div>

        {/* Shipments Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">
            Recent Shipments
          </h3>
          <DataTable
            columns={shipmentColumns}
            data={shipments}
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
