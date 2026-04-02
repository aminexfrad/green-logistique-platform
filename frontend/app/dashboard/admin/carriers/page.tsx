'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { carriers } from '@/lib/mock-data'
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

export default function AdminCarriersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
            { label: 'Gold Certified', value: carriers.filter(c => c.certification === 'gold').length, icon: '⭐' },
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
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Company Name</FieldLabel>
                        <Input placeholder="Carrier name" className="bg-muted/50" />
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Contact Email</FieldLabel>
                        <Input type="email" placeholder="contact@carrier.com" className="bg-muted/50" />
                      </Field>
                    </FieldGroup>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Zone</FieldLabel>
                        <Input placeholder="Service area" className="bg-muted/50" />
                      </Field>
                    </FieldGroup>
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
                  {filteredCarriers.map((carrier) => (
                    <TableRow key={carrier.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="font-medium">{carrier.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{carrier.zone}</TableCell>
                      <TableCell className="text-sm">{carrier.vehicles}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={certificationLevels[carrier.certification as keyof typeof certificationLevels]}
                        >
                          {carrier.certification.charAt(0).toUpperCase() + carrier.certification.slice(1)}
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
