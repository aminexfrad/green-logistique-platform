'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useAppStore } from '@/lib/store'
import { getTranslation } from '@/lib/translations'
import { mockShipments } from '@/lib/mock-data'
import {
  Search,
  MapPin,
  Calendar,
  Truck,
  CheckCircle2,
  Package,
  Leaf,
  Star,
} from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function TrackingPage() {
  const { language } = useAppStore()
  const t = (key: string) => getTranslation(language, key)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [selectedShipment, setSelectedShipment] = useState<typeof mockShipments[0] | null>(
    null
  )

  const handleSearch = () => {
    const shipment = mockShipments.find(
      (s) => s.trackingNumber === trackingNumber
    )
    setSelectedShipment(shipment || null)
  }

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: JSX.Element } = {
      created: <Package className="w-4 h-4" />,
      inTransit: <Truck className="w-4 h-4" />,
      delivered: <CheckCircle2 className="w-4 h-4" />,
      cancelled: <Package className="w-4 h-4" />,
      incident: <Package className="w-4 h-4" />,
    }
    return icons[status] || <Package className="w-4 h-4" />
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      created: 'bg-blue-500/20 text-blue-500',
      inTransit: 'bg-yellow-500/20 text-yellow-500',
      delivered: 'bg-green-500/20 text-green-500',
      cancelled: 'bg-red-500/20 text-red-500',
      incident: 'bg-red-500/20 text-red-500',
    }
    return colors[status] || 'bg-gray-500/20 text-gray-500'
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Track Your Shipment
          </h1>
          <p className="text-muted-foreground">
            Enter your tracking number to view the status and delivery details
          </p>
        </div>

        {/* Search Section */}
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Enter tracking number (e.g., TRK-2026-0001)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button
              className="bg-primary text-background hover:bg-primary/90"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>

          {/* Available tracking numbers hint */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">
              Try these demo tracking numbers:
            </p>
            <div className="flex flex-wrap gap-2">
              {mockShipments.map((shipment) => (
                <button
                  key={shipment.id}
                  onClick={() => {
                    setTrackingNumber(shipment.trackingNumber)
                    setSelectedShipment(shipment)
                  }}
                  className="px-3 py-1 bg-sidebar-accent/20 hover:bg-sidebar-accent/30 text-xs font-mono rounded transition-colors"
                >
                  {shipment.trackingNumber}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        {selectedShipment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Tracking #{selectedShipment.trackingNumber}
                  </h2>
                  <p className="text-muted-foreground">
                    {selectedShipment.origin} → {selectedShipment.destination}
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg font-medium capitalize flex items-center gap-2 ${getStatusColor(
                    selectedShipment.status
                  )}`}
                >
                  {getStatusIcon(selectedShipment.status)}
                  {selectedShipment.status}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-sidebar-accent/5 rounded-lg p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Cargo Type</p>
                  <p className="font-semibold text-foreground">
                    {selectedShipment.cargoType}
                  </p>
                </div>
                <div className="bg-sidebar-accent/5 rounded-lg p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Weight</p>
                  <p className="font-semibold text-foreground">
                    {selectedShipment.weight} kg
                  </p>
                </div>
                <div className="bg-sidebar-accent/5 rounded-lg p-4 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Mode</p>
                  <p className="font-semibold text-foreground capitalize">
                    {selectedShipment.transportMode}
                  </p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">CO2 Impact</p>
                  <p className="font-semibold text-primary">
                    {selectedShipment.co2Kg.toFixed(1)} kg
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">
                Delivery Timeline
              </h3>
              <div className="space-y-4">
                {selectedShipment.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0
                            ? 'bg-blue-500/20 text-blue-500'
                            : index === selectedShipment.timeline.length - 1
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-yellow-500/20 text-yellow-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < selectedShipment.timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-semibold text-foreground capitalize">
                        {event.status}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.timestamp}
                      </p>
                      {event.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </p>
                      )}
                      <p className="text-sm text-foreground mt-1">
                        {event.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                Environmental Impact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Your Shipment CO2
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {selectedShipment.co2Kg.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">kg CO2e</p>
                </div>
                <div className="bg-card rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Offset Equivalent
                  </p>
                  <p className="text-2xl font-bold text-secondary">
                    {(selectedShipment.co2Kg / 21).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    trees planted
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Rate This Delivery
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  How was your delivery experience?
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="text-3xl hover:scale-110 transition-transform"
                    >
                      {'⭐'[0]}
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Leave a comment (optional)"
                  className="w-full p-3 rounded-lg border border-border bg-sidebar-accent/5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  rows={3}
                />
                <Button className="bg-primary text-background hover:bg-primary/90">
                  Submit Rating
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {trackingNumber && !selectedShipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-card p-8 text-center"
          >
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              Shipment Not Found
            </h3>
            <p className="text-muted-foreground">
              No shipment found with tracking number: {trackingNumber}
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
