'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Download, MapPin, Package, Truck, FileText, AlertCircle, Clock, CheckCircle, MessageSquare } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'

export default function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const shipment = {
    id: params.id,
    trackingNumber: 'TRK-2026-0042',
    status: 'in_transit',
    origin: 'Paris (75001), France',
    destination: 'Lyon (69000), France',
    weight: 250,
    volume: 1.5,
    transportMode: 'road',
    vehicleType: 'Truck',
    vehicleFuel: 'Electric',
    carrier: 'TransEco Services',
    co2Emitted: 18.5,
    co2Estimated: 24.3,
    createdAt: '2026-04-01 10:30:00',
    departureDate: '2026-04-01 14:00:00',
    estimatedDelivery: '2026-04-02 16:00:00',
    actualDelivery: null,
    driver: 'Jean Dupont',
    driverPhone: '+33 6 12 34 56 78',
    vehicle: 'Tesla Semi - XXXX-12-345',
    incidents: [
      { id: 1, type: 'delay', time: '2026-04-02 12:15:00', description: 'Traffic on A7 highway' },
    ],
    events: [
      { id: 1, time: '2026-04-01 14:00:00', status: 'picked_up', location: 'Paris', description: 'Shipment picked up' },
      { id: 2, time: '2026-04-01 16:30:00', status: 'in_transit', location: 'A7 Highway', description: 'In transit to destination' },
      { id: 3, time: '2026-04-02 12:15:00', status: 'delayed', location: 'A7 Highway', description: 'Traffic congestion encountered' },
    ],
    documents: [
      { name: 'CMR Document', type: 'cmr', size: '245 KB' },
      { name: 'Invoice', type: 'invoice', size: '156 KB' },
      { name: 'CO2 Certificate', type: 'certificate', size: '89 KB' },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picked_up':
        return 'bg-blue-900/30 text-blue-400'
      case 'in_transit':
        return 'bg-primary/20 text-primary'
      case 'delivered':
        return 'bg-green-900/30 text-green-400'
      case 'delayed':
        return 'bg-amber-900/30 text-amber-400'
      case 'incident':
        return 'bg-red-900/30 text-red-400'
      default:
        return 'bg-muted/30'
    }
  }

  return (
    <DashboardLayout title={`Shipment ${params.id}`}>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{shipment.trackingNumber}</h1>
            <p className="text-muted-foreground mt-2">{shipment.origin} → {shipment.destination}</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-border/50">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report Incident
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border/50">
                <DialogHeader>
                  <DialogTitle>Report Incident</DialogTitle>
                  <DialogDescription>Describe the incident you want to report</DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Incident Type</FieldLabel>
                      <select className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded-md">
                        <option>Delay</option>
                        <option>Damage</option>
                        <option>Lost Package</option>
                        <option>Weather</option>
                        <option>Other</option>
                      </select>
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Description</FieldLabel>
                      <Textarea placeholder="Describe the incident..." className="bg-muted/50" />
                    </Field>
                  </FieldGroup>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Report Incident
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="border-border/50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Weight', value: `${shipment.weight} kg`, icon: Package },
            { label: 'Transport Mode', value: shipment.transportMode.charAt(0).toUpperCase() + shipment.transportMode.slice(1), icon: Truck },
            { label: 'Vehicle', value: shipment.vehicleFuel, icon: Truck },
            { label: 'CO2 Emitted', value: `${shipment.co2Emitted} kg`, icon: AlertCircle },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className="w-5 h-5 text-primary/50" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList className="bg-muted/50 border border-border/50">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="tracking">GPS Tracking</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shipment.events.map((event, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(event.status)}`}>
                          {event.status === 'delivered' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        {i < shipment.events.length - 1 && <div className="w-0.5 h-12 bg-border/50 my-2"></div>}
                      </div>
                      <div className="flex-1 py-1">
                        <p className="font-medium">{event.description}</p>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                        <p className="text-xs text-muted-foreground mt-1">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>GPS Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-border/50">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Interactive map would be displayed here</p>
                    <p className="text-sm text-muted-foreground mt-2">Current location: {shipment.origin}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {shipment.documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                {shipment.incidents.length > 0 ? (
                  <div className="space-y-3">
                    {shipment.incidents.map((incident) => (
                      <div key={incident.id} className="p-4 bg-amber-900/20 border border-amber-700/50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium">{incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}</p>
                            <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">{incident.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No incidents reported</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Shipment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tracking Number:</span>
                    <span className="font-medium">{shipment.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">{shipment.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departure:</span>
                    <span className="font-medium">{shipment.departureDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Delivery:</span>
                    <span className="font-medium">{shipment.estimatedDelivery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="font-medium">{shipment.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volume:</span>
                    <span className="font-medium">{shipment.volume} m³</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Carrier Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carrier:</span>
                    <span className="font-medium">{shipment.carrier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Driver:</span>
                    <span className="font-medium">{shipment.driver}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{shipment.driverPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span className="font-medium">{shipment.vehicle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Type:</span>
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">{shipment.vehicleFuel}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
