from pathlib import Path

base = Path(__file__).parent
files = {
    'app/dashboard/admin/page.tsx': ''''use client'

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

  const totalCO2 = shipments.reduce((sum, shipment) => sum + (shipment.co2Kg || 0), 0)

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
      render: (value: number) => (
        <span className="font-semibold text-foreground">{value.toFixed(1)}</span>
      ),
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
''',
    'app/dashboard/admin/carriers/page.tsx': ''''use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { fetchCarriers } from '@/lib/api'
import { Search, Plus, CheckCircle, AlertCircle, FileText, Star } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { Carrier } from '@/lib/mock-data'

export default function AdminCarriersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCarriers()
      .then((data) => setCarriers(data))
      .catch(() => setCarriers([]))
      .finally(() => setLoading(false))
  }, [])

  const certificationLevels = {
    bronze: 'bg-amber-900/30 text-amber-400 border-amber-700/50',
    silver: 'bg-slate-600/30 text-slate-300 border-slate-500/50',
    gold: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50',
  }

  const filteredCarriers = carriers.filter((carrier) => {
    const matchesSearch = carrier.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'verified' && carrier.isVerified) ||
      (filterStatus === 'pending' && !carrier.isVerified)
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout title="Carrier Management">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Carriers', value: carriers.length, icon: '🚚' },
            { label: 'Verified', value: carriers.filter(c => c.isVerified).length, icon: '✓' },
            { label: 'Pending Validation', value: carriers.filter(c => !c.isVerified).length, icon: '⏳' },
            { label: 'Gold Certified', value: carriers.filter(c => c.greenCertification === 'gold').length, icon: '⭐' },
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Carriers</CardTitle>
                <CardDescription>Manage and validate transportation partners</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Carrier
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>Add Carrier</DialogTitle>
                    <DialogDescription>Register a new transportation partner</DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">Company Name</label>
                        <Input placeholder="Carrier name" className="bg-muted/50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">Contact Email</label>
                        <Input type="email" placeholder="contact@carrier.com" className="bg-muted/50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">Zone</label>
                        <Input placeholder="Service area" className="bg-muted/50" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Add Carrier
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search carriers..."
                  className="pl-10 bg-muted/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending Validation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border border-border/50 rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead>Company Name</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Vehicles</TableHead>
                    <TableHead>Certification</TableHead>
                    <TableHead>Green Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Loading carriers...
                      </TableCell>
                    </TableRow>
                  ) : filteredCarriers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No carriers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCarriers.map((carrier) => (
                      <TableRow key={carrier.id} className="border-border/50 hover:bg-muted/30">
                        <TableCell className="font-medium">{carrier.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{carrier.zone}</TableCell>
                        <TableCell className="text-sm">{carrier.vehicles.length} vehicles</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={certificationLevels[carrier.greenCertification as keyof typeof certificationLevels]}
                          >
                            {carrier.greenCertification.charAt(0).toUpperCase() + carrier.greenCertification.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-muted/50 rounded-full h-2">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{ width: `${carrier.greenScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{carrier.greenScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {carrier.isVerified ? (
                            <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-700/50">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-900/30 text-amber-400 border-amber-700/50">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-sm">
                              <FileText className="w-4 h-4 mr-1" />
                              Docs
                            </Button>
                            {!carrier.isVerified && (
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-sm text-green-400 hover:text-green-500">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Verify
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
''',
    'app/dashboard/shipper/carriers/page.tsx': ''''use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { fetchCarriers } from '@/lib/api'
import { Search, MapPin, Truck, Star, Phone, Mail, Award, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Carrier } from '@/lib/mock-data'

export default function ShipperCarriersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCertification, setFilterCertification] = useState<string>('all')
  const [filterZone, setFilterZone] = useState<string>('all')
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null)
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [loading, setLoading] = useState(true)

  const zones = ['all', 'France', 'Europe', 'International']
  const certifications = ['all', 'bronze', 'silver', 'gold']

  useEffect(() => {
    fetchCarriers()
      .then((data) => setCarriers(data))
      .catch(() => setCarriers([]))
      .finally(() => setLoading(false))
  }, [])

  const certificationColors: Record<string, string> = {
    bronze: 'bg-amber-900/30 text-amber-400 border-amber-700/50',
    silver: 'bg-slate-600/30 text-slate-300 border-slate-500/50',
    gold: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50',
  }

  const filteredCarriers = carriers.filter((carrier) => {
    const matchesSearch = carrier.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCert = filterCertification === 'all' || carrier.greenCertification === filterCertification
    const matchesZone =
      filterZone === 'all' ||
      carrier.zone.toLowerCase().includes(filterZone.toLowerCase())

    return matchesSearch && matchesCert && matchesZone
  })

  return (
    <DashboardLayout title="Carrier Directory">
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-border/50">
          <CardContent className="pt-8">
            <h2 className="text-2xl font-bold mb-2">Find Your Perfect Carrier</h2>
            <p className="text-muted-foreground">Browse our network of certified green logistics partners</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Carriers</CardTitle>
            <CardDescription>All verified and certified transportation partners</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search carriers by name..."
                  className="pl-10 bg-muted/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterCertification} onValueChange={setFilterCertification}>
                  <SelectTrigger className="w-40 bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Certifications</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterZone} onValueChange={setFilterZone}>
                  <SelectTrigger className="w-40 bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone === 'all' ? 'All Zones' : zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCarriers.map((carrier) => (
                <Dialog key={carrier.id}>
                  <DialogTrigger asChild>
                    <Card className="bg-card/50 border-border/50 hover:border-primary/50 cursor-pointer transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-base">{carrier.name}</h3>
                          <Badge
                            variant="outline"
                            className={certificationColors[carrier.greenCertification]}
                          >
                            {carrier.greenCertification.charAt(0).toUpperCase() + carrier.greenCertification.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(carrier.greenScore / 20) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                            />
                          ))}
                          <span className="text-sm font-medium ml-2">{carrier.greenScore}%</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {carrier.zone}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Truck className="w-4 h-4" />
                          {carrier.vehicles.length} vehicles
                        </div>
                        <div className="w-full bg-muted/50 rounded-full h-2 mt-3">
                          <div
                            className="bg-primary h-full rounded-full"
                            style={{ width: `${carrier.greenScore}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border/50 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{carrier.name}</DialogTitle>
                      <DialogDescription>{carrier.zone}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{carrier.vehicles.length}</p>
                          <p className="text-xs text-muted-foreground">Vehicles</p>
                        </div>
                        <div className="text-center">
                          <Badge variant="outline" className={certificationColors[carrier.greenCertification]}>
                            {carrier.greenCertification.charAt(0).toUpperCase() + carrier.greenCertification.slice(1)}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-2">Certification</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-400">{carrier.greenScore}%</p>
                          <p className="text-xs text-muted-foreground">Green Score</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-secondary">4.8</p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Contact Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              +33 1 23 45 67 89
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              contact@{carrier.name.toLowerCase().replace(/\s+/g, '')}.com
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Fleet Composition</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Electric Vehicles:</span>
                              <span className="font-medium">{Math.ceil(carrier.vehicles.length * 0.6)} ({Math.ceil((Math.ceil(carrier.vehicles.length * 0.6) / (carrier.vehicles.length || 1)) * 100)}%)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">GNV Vehicles:</span>
                              <span className="font-medium">{Math.floor(carrier.vehicles.length * 0.25)} ({Math.floor((Math.floor(carrier.vehicles.length * 0.25) / (carrier.vehicles.length || 1)) * 100)}%)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Euro 6 Diesel:</span>
                              <span className="font-medium">{Math.floor(carrier.vehicles.length * 0.15)} ({Math.floor((Math.floor(carrier.vehicles.length * 0.15) / (carrier.vehicles.length || 1)) * 100)}%)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button className="flex-1 bg-primary hover:bg-primary/90">
                          <Award className="w-4 h-4 mr-2" />
                          Select Carrier
                        </Button>
                        <Button variant="outline" className="flex-1 border-border/50">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>

            {loading && (
              <div className="text-center py-12 text-muted-foreground">
                Loading carriers...
              </div>
            )}

            {!loading && filteredCarriers.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No carriers found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
''',
    'app/dashboard/shipper/page.tsx': ''''use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { KPICard } from '@/components/shared/kpi-card'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { getTranslation } from '@/lib/translations'
import { fetchShipments } from '@/lib/api'
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
import { Shipment } from '@/lib/mock-data'
import { useState as useLocalState } from 'react'

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
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const t = (key: string) => getTranslation(language, key)

  useEffect(() => {
    fetchShipments()
      .then((data) => setShipments(data))
      .catch(() => setShipments([]))
      .finally(() => setLoading(false))
  }, [])

  const totalCO2 = shipments.reduce((sum, shipment) => sum + (shipment.co2Kg || 0), 0)
  const greenShipmentsCount = shipments.filter((shipment) => shipment.transportMode === 'maritime' || shipment.transportMode === 'rail').length
  const greenShipmentsPercent = shipments.length ? Math.round((greenShipmentsCount / shipments.length) * 100) : 0

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
            value={shipments.length}
            icon={PackageOpen}
            unit="shipments"
            trend={{ value: 12, direction: 'up' }}
            color="primary"
          />
          <KPICard
            title={t('totalCO2')}
            value={totalCO2.toFixed(0)}
            icon={Leaf}
            unit="kg"
            trend={{ value: 8, direction: 'up' }}
            color="secondary"
          />
          <KPICard
            title={t('compensatedCO2')}
            value={Math.round(totalCO2 * 0.2)}
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
          </div>
        </div>

        {/* Shipments Table */}
        <div className="rounded-xl border border-border bg-card p-6">
          <DataTable
            columns={shipmentColumns}
            data={shipments}
            searchPlaceholder="Search shipments..."
            actions={(row) => (
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                View
              </Button>
            )}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
''',
}
```}