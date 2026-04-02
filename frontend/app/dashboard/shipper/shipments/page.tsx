'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { getTranslation } from '@/lib/translations'
import { fetchShipments } from '@/lib/api'
import { formatNumber } from '@/lib/utils'
import { Eye, Download, MapPin, Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState as useLocalState } from 'react'
import type { Shipment } from '@/lib/mock-data'

export default function ShipmentsList() {
  const { language } = useAppStore()
  const t = (key: string) => getTranslation(language, key)
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShipments()
      .then((data) => setShipments(data))
      .catch(() => setShipments([]))
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    {
      key: 'id',
      label: 'Tracking',
      sortable: true,
      width: '100px',
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
      key: 'co2Kg',
      label: 'CO2',
      render: (value: number) => (
        <span className="font-semibold text-primary">{formatNumber(value, 1)} kg</span>
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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Shipments
          </h1>
          <p className="text-muted-foreground">
            Track and manage all your active shipments
          </p>
        </div>

        {/* Filters & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: shipments.length, color: 'primary' },
            { label: 'In Transit', value: shipments.filter(s => s.status === 'inTransit').length, color: 'yellow-500' },
            { label: 'Delivered', value: shipments.filter(s => s.status === 'delivered').length, color: 'green-500' },
            { label: 'Issues', value: shipments.filter(s => s.status === 'incident').length, color: 'red-500' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card p-4"
            >
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color === 'primary' ? 'text-primary' : `text-${stat.color}`}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Shipments Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <DataTable
            columns={columns}
            data={shipments}
            searchPlaceholder="Search shipments..."
            actions={(row) => (
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    onClick={() => setSelectedShipment(row)}
                    className="p-2 hover:bg-sidebar-accent/10 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                {selectedShipment && (
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Shipment Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-sidebar-accent/5 rounded-lg p-4 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">
                            Tracking Number
                          </p>
                          <p className="font-mono font-bold text-foreground">
                            {selectedShipment.trackingNumber}
                          </p>
                        </div>
                        <div className="bg-sidebar-accent/5 rounded-lg p-4 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">
                            Status
                          </p>
                          <p className="font-semibold text-foreground capitalize">
                            {selectedShipment.status}
                          </p>
                        </div>
                        <div className="bg-sidebar-accent/5 rounded-lg p-4 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">
                            Weight
                          </p>
                          <p className="font-semibold text-foreground">
                            {selectedShipment.weight} kg
                          </p>
                        </div>
                        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                          <p className="text-xs text-muted-foreground mb-1">
                            CO2 Impact
                          </p>
                          <p className="font-semibold text-primary">
                            {formatNumber(selectedShipment.co2Kg ?? selectedShipment.co2_kg, 1)} kg
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Route
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          From: {selectedShipment.origin}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          To: {selectedShipment.destination}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Timeline
                        </h4>
                        <div className="space-y-2">
                          {selectedShipment.timeline.map((event, idx) => (
                            <div key={event.id} className="text-sm">
                              <p className="font-medium text-foreground capitalize">
                                {event.status}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {event.timestamp}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full bg-primary text-background hover:bg-primary/90 gap-2">
                        <Download className="w-4 h-4" />
                        Download Documents
                      </Button>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            )}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
