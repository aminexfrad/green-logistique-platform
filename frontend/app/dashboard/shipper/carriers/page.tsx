'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { mockCarriers as carriers } from '@/lib/mock-data'
import { Search, MapPin, Truck, Star, Phone, Mail, Award, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function ShipperCarriersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCertification, setFilterCertification] = useState<string>('all')
  const [filterZone, setFilterZone] = useState<string>('all')
  const [selectedCarrier, setSelectedCarrier] = useState<typeof carriers[0] | null>(null)

  const zones = ['all', 'France', 'Europe', 'International']
  const certifications = ['all', 'bronze', 'silver', 'gold']

  const certificationColors: Record<string, string> = {
    bronze: 'bg-amber-900/30 text-amber-400 border-amber-700/50',
    silver: 'bg-slate-600/30 text-slate-300 border-slate-500/50',
    gold: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50',
  }

  const filteredCarriers = carriers.filter((carrier) => {
    const matchesSearch = carrier.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCert = filterCertification === 'all' || carrier.greenCertification === filterCertification
    const matchesZone = filterZone === 'all' || carrier.zone === filterZone
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
                              contact@{carrier.name.toLowerCase().replace(' ', '')}.com
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Fleet Composition</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Electric Vehicles:</span>
                              <span className="font-medium">{Math.ceil(carrier.vehicles.length * 0.6)} ({Math.ceil(carrier.vehicles.length * 0.6 / carrier.vehicles.length * 100)}%)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">GNV Vehicles:</span>
                              <span className="font-medium">{Math.floor(carrier.vehicles.length * 0.25)} ({Math.floor(carrier.vehicles.length * 0.25 / carrier.vehicles.length * 100)}%)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Euro 6 Diesel:</span>
                              <span className="font-medium">{Math.floor(carrier.vehicles.length * 0.15)} ({Math.floor(carrier.vehicles.length * 0.15 / carrier.vehicles.length * 100)}%)</span>
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

            {filteredCarriers.length === 0 && (
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
