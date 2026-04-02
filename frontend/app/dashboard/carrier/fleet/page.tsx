'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { Plus, Truck, Battery, Zap, Fuel } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const vehicles = [
  { id: 1, type: 'Truck', registration: 'XXXX-12-345', fuelType: 'Electric', capacity: 25000, year: 2024, mileage: 12500, status: 'active', co2PerKm: 0 },
  { id: 2, type: 'Truck', registration: 'XXXX-12-346', fuelType: 'Electric', capacity: 25000, year: 2024, mileage: 8900, status: 'active', co2PerKm: 0 },
  { id: 3, type: 'Van', registration: 'XXXX-12-347', fuelType: 'GNV', capacity: 5000, year: 2022, mileage: 45000, status: 'maintenance', co2PerKm: 40 },
  { id: 4, type: 'Van', registration: 'XXXX-12-348', fuelType: 'Electric', capacity: 3500, year: 2023, mileage: 22000, status: 'active', co2PerKm: 0 },
  { id: 5, type: 'Truck', registration: 'XXXX-12-349', fuelType: 'Diesel Euro 6', capacity: 25000, year: 2020, mileage: 87000, status: 'active', co2PerKm: 62 },
]

export default function CarrierFleetPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterFuel, setFilterFuel] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.registration.toLowerCase().includes(searchQuery.toLowerCase()) || vehicle.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFuel = filterFuel === 'all' || vehicle.fuelType.includes(filterFuel)
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus
    return matchesSearch && matchesFuel && matchesStatus
  })

  const fuelTypeIcon: Record<string, React.ReactNode> = {
    'Electric': <Battery className="w-4 h-4 text-green-400" />,
    'GNV': <Zap className="w-4 h-4 text-blue-400" />,
    'Diesel Euro 6': <Fuel className="w-4 h-4 text-amber-400" />,
  }

  const getFuelColor = (fuel: string) => {
    if (fuel.includes('Electric')) return 'bg-green-900/30 text-green-400 border-green-700/50'
    if (fuel.includes('GNV')) return 'bg-blue-900/30 text-blue-400 border-blue-700/50'
    return 'bg-amber-900/30 text-amber-400 border-amber-700/50'
  }

  const stats = [
    { label: 'Total Vehicles', value: vehicles.length },
    { label: 'Active', value: vehicles.filter(v => v.status === 'active').length },
    { label: 'Electric Vehicles', value: vehicles.filter(v => v.fuelType === 'Electric').length },
    { label: 'Average CO2/km', value: '15.6g' },
  ]

  return (
    <DashboardLayout title="Fleet Management">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vehicles</CardTitle>
                <CardDescription>Manage your transportation fleet</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>Add New Vehicle</DialogTitle>
                    <DialogDescription>Register a new vehicle to your fleet</DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Vehicle Type</FieldLabel>
                        <select className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded-md">
                          <option>Truck</option>
                          <option>Van</option>
                          <option>Small Van</option>
                        </select>
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Registration Number</FieldLabel>
                        <Input placeholder="XX-123-456" className="bg-muted/50" />
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Fuel Type</FieldLabel>
                        <select className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded-md">
                          <option>Electric</option>
                          <option>GNV</option>
                          <option>Diesel Euro 6</option>
                        </select>
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Capacity (kg)</FieldLabel>
                        <Input type="number" placeholder="25000" className="bg-muted/50" />
                      </Field>
                    </FieldGroup>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Add Vehicle
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Input
                placeholder="Search by registration or type..."
                className="flex-1 bg-muted/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 bg-muted/50 border border-border/50 rounded-md text-sm"
                  value={filterFuel}
                  onChange={(e) => setFilterFuel(e.target.value)}
                >
                  <option value="all">All Fuel Types</option>
                  <option value="Electric">Electric</option>
                  <option value="GNV">GNV</option>
                  <option value="Diesel">Diesel</option>
                </select>
                <select
                  className="px-3 py-2 bg-muted/50 border border-border/50 rounded-md text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="border border-border/50 rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead>Registration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fuel Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Mileage</TableHead>
                    <TableHead>CO2/km</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="font-medium">{vehicle.registration}</TableCell>
                      <TableCell>{vehicle.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getFuelColor(vehicle.fuelType)}>
                          <div className="flex items-center gap-2">
                            {fuelTypeIcon[vehicle.fuelType]}
                            {vehicle.fuelType}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>{vehicle.capacity.toLocaleString()} kg</TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.mileage.toLocaleString()} km</TableCell>
                      <TableCell>
                        <span className={vehicle.co2PerKm === 0 ? 'text-green-400' : 'text-amber-400'}>
                          {vehicle.co2PerKm}g
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={vehicle.status === 'active' ? 'bg-green-900/30 text-green-400 border-green-700/50' : 'bg-amber-900/30 text-amber-400 border-amber-700/50'}
                        >
                          {vehicle.status === 'active' ? 'Active' : 'Maintenance'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-sm">
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
