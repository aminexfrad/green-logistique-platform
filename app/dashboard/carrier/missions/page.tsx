'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DataTable } from '@/components/shared/data-table'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { getTranslation } from '@/lib/translations'
import { mockShipments } from '@/lib/mock-data'
import { Check, X, Eye, MapPin, Package, Calendar, DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Missions() {
  const { language } = useAppStore()
  const t = (key: string) => getTranslation(language, key)
  const [acceptedMissions, setAcceptedMissions] = useState<string[]>([])

  const handleAccept = (shipmentId: string) => {
    setAcceptedMissions((prev) => [...prev, shipmentId])
    toast.success('Mission accepted!')
  }

  const handleReject = (shipmentId: string) => {
    toast.info('Mission declined')
  }

  const activeMissions = mockShipments.filter((s) => !acceptedMissions.includes(s.id))
  const acceptedShipments = mockShipments.filter((s) => acceptedMissions.includes(s.id))

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
      key: 'weight',
      label: 'Weight',
      render: (value: number) => `${value} kg`,
    },
    {
      key: 'co2Kg',
      label: 'CO2 Impact',
      render: (value: number) => (
        <span className="text-primary font-semibold">{value.toFixed(1)} kg</span>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Incoming Missions
          </h1>
          <p className="text-muted-foreground">
            Review and accept new shipment requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: 'Pending Requests',
              value: activeMissions.length,
              color: 'yellow-500',
            },
            {
              label: 'Accepted Missions',
              value: acceptedMissions.length,
              color: 'green-500',
            },
            {
              label: 'Total CO2',
              value: `${acceptedShipments.reduce((sum, s) => sum + s.co2Kg, 0).toFixed(0)} kg`,
              color: 'primary',
            },
          ].map((stat) => (
            <Card key={stat.label} className="p-4">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p
                className={`text-2xl font-bold ${
                  stat.color === 'primary'
                    ? 'text-primary'
                    : `text-${stat.color}`
                }`}
              >
                {stat.value}
              </p>
            </Card>
          ))}
        </div>

        {/* Pending Missions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">
            Pending Requests ({activeMissions.length})
          </h3>
          {activeMissions.length > 0 ? (
            <div className="space-y-3">
              {activeMissions.map((mission) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Shipment
                          </p>
                          <p className="font-mono font-bold text-foreground">
                            {mission.id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Route
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {mission.origin.split(',')[0]} →{' '}
                              {mission.destination.split(',')[0]}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Cargo
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {mission.weight} kg
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Delivery
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {mission.deliveryDate}
                            </p>
                          </div>
                        </div>
                        <div className="bg-primary/10 rounded-lg p-2">
                          <p className="text-xs text-muted-foreground">CO2</p>
                          <p className="font-bold text-primary">
                            {mission.co2Kg.toFixed(1)} kg
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleAccept(mission.id)}
                        className="p-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors"
                        title="Accept"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(mission.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-lg bg-sidebar-accent/20 text-muted-foreground hover:text-foreground transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center bg-sidebar-accent/5">
              <p className="text-muted-foreground">
                No pending requests at this time
              </p>
            </Card>
          )}
        </div>

        {/* Accepted Missions */}
        {acceptedShipments.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              Accepted Missions ({acceptedShipments.length})
            </h3>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <DataTable
                columns={missionColumns}
                data={acceptedShipments}
                searchable={false}
                actions={(row) => (
                  <button className="p-2 hover:bg-sidebar-accent/10 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
