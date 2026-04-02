'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { Edit2, Save, Shield, Award, MapPin, Phone, Mail } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

export default function CarrierProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    companyName: 'TransEco Services',
    siret: '12345678901234',
    zone: 'France',
    email: 'contact@transeco.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de Logistique, Paris 75001',
    website: 'www.transeco.com',
    description: 'Leading sustainable logistics provider in France with a fleet of electric vehicles.',
    certification: 'gold',
    greenScore: 87,
    employees: 45,
    yearFounded: 2015,
  })

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <DashboardLayout title="Company Profile">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{profile.companyName}</h1>
            <p className="text-muted-foreground mt-2">SIRET: {profile.siret}</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="gap-2"
            variant={isEditing ? 'default' : 'outline'}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Green Score', value: `${profile.greenScore}%`, icon: '🌱' },
            { label: 'Certification', value: 'Gold', icon: '⭐' },
            { label: 'Employees', value: profile.employees, icon: '👥' },
            { label: 'Zone', value: profile.zone, icon: '📍' },
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-muted/50 border border-border/50">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6 space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Company Name</FieldLabel>
                    <Input
                      value={profile.companyName}
                      onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                      disabled={!isEditing}
                      className="bg-muted/50"
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>SIRET Number</FieldLabel>
                    <Input
                      value={profile.siret}
                      onChange={(e) => setProfile({ ...profile, siret: e.target.value })}
                      disabled={!isEditing}
                      className="bg-muted/50"
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Service Zone</FieldLabel>
                    <Input
                      value={profile.zone}
                      onChange={(e) => setProfile({ ...profile, zone: e.target.value })}
                      disabled={!isEditing}
                      className="bg-muted/50"
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea
                      value={profile.description}
                      onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                      disabled={!isEditing}
                      className="bg-muted/50 min-h-24"
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Employees</FieldLabel>
                    <Input
                      type="number"
                      value={profile.employees}
                      onChange={(e) => setProfile({ ...profile, employees: parseInt(e.target.value) })}
                      disabled={!isEditing}
                      className="bg-muted/50"
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Year Founded</FieldLabel>
                    <Input
                      type="number"
                      value={profile.yearFounded}
                      onChange={(e) => setProfile({ ...profile, yearFounded: parseInt(e.target.value) })}
                      disabled={!isEditing}
                      className="bg-muted/50"
                    />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6 space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 bg-muted/50"
                      />
                    </div>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Phone</FieldLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 bg-muted/50"
                      />
                    </div>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Address</FieldLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 bg-muted/50"
                      />
                    </div>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Website</FieldLabel>
                    <Input
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      disabled={!isEditing}
                      className="bg-muted/50"
                    />
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Environmental Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: 'Gold Certified', status: 'active', date: '2025-06-15', icon: '⭐' },
                    { name: 'ISO 14001', status: 'active', date: '2024-12-01', icon: '🏆' },
                    { name: 'Carbon Neutral 2025', status: 'pending', date: '2026-05-30', icon: '🌍' },
                  ].map((cert, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{cert.icon}</div>
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-xs text-muted-foreground">{cert.date}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cert.status === 'active' ? 'bg-green-900/30 text-green-400 border-green-700/50' : 'bg-amber-900/30 text-amber-400 border-amber-700/50'}
                      >
                        {cert.status === 'active' ? 'Active' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Certification Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Gold Certification Certificate', size: '2.4 MB', date: '2025-06-15' },
                    { name: 'ISO 14001 Audit Report', size: '1.8 MB', date: '2024-12-01' },
                    { name: 'Fleet Emissions Report', size: '856 KB', date: '2026-03-15' },
                    { name: 'Environmental Policy', size: '542 KB', date: '2025-01-01' },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{doc.date} • {doc.size}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 px-3">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
