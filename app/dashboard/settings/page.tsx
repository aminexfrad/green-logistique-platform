'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Bell, Lock, Globe, Palette, Users, LogOut, Trash2, Shield, Save } from 'lucide-react'

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [notifications, setNotifications] = useState({
    shipmentUpdates: true,
    weeklyReport: true,
    promotions: false,
    systemAlerts: true,
    emailDigest: true,
  })

  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'Europe/Paris',
    currency: 'EUR',
    co2Threshold: 100,
    alertsEnabled: true,
  })

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-muted/50 border border-border/50">
            <TabsTrigger value="general" className="gap-2">
              <Globe className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Language</FieldLabel>
                    <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Timezone</FieldLabel>
                    <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris (GMT+2)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT+1)</SelectItem>
                        <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                        <SelectItem value="US/Eastern">US/Eastern</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Currency</FieldLabel>
                    <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>CO2 Threshold Alert (kg)</FieldLabel>
                    <Input
                      type="number"
                      value={settings.co2Threshold}
                      onChange={(e) => setSettings({ ...settings, co2Threshold: parseInt(e.target.value) })}
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Alert when monthly emissions exceed this threshold</p>
                  </Field>
                </FieldGroup>

                <Button className="bg-primary hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { id: 'shipmentUpdates', label: 'Shipment Updates', description: 'Receive updates on shipment status changes' },
                  { id: 'weeklyReport', label: 'Weekly Reports', description: 'Get weekly summary of your activities' },
                  { id: 'promotions', label: 'Promotions', description: 'Receive promotional offers and discounts' },
                  { id: 'systemAlerts', label: 'System Alerts', description: 'Important system notifications' },
                  { id: 'emailDigest', label: 'Email Digest', description: 'Daily email digest of important updates' },
                ].map((notif) => (
                  <div key={notif.id} className="flex items-start justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div>
                      <p className="font-medium">{notif.label}</p>
                      <p className="text-sm text-muted-foreground mt-1">{notif.description}</p>
                    </div>
                    <Switch
                      checked={notifications[notif.id as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [notif.id]: checked })
                      }
                    />
                  </div>
                ))}

                <Button className="bg-primary hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-4">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Current Password</FieldLabel>
                      <Input type="password" placeholder="••••••••" className="bg-muted/50" />
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>New Password</FieldLabel>
                      <Input type="password" placeholder="••••••••" className="bg-muted/50" />
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Confirm Password</FieldLabel>
                      <Input type="password" placeholder="••••••••" className="bg-muted/50" />
                    </Field>
                  </FieldGroup>
                  <Button className="bg-primary hover:bg-primary/90">Update Password</Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-sm text-muted-foreground">2FA is currently disabled</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-900/30 text-amber-400 border-amber-700/50">
                      Disabled
                    </Badge>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">Enable 2FA</Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>Manage your active sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { device: 'MacBook Pro', browser: 'Chrome', location: 'Paris, France', lastActive: 'Now' },
                    { device: 'iPhone 14', browser: 'Safari', location: 'Paris, France', lastActive: '2 hours ago' },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div className="text-sm">
                        <p className="font-medium">{session.device}</p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {session.browser} • {session.location} • {session.lastActive}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-red-400 hover:text-red-500">
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Privacy & Data</CardTitle>
                <CardDescription>Manage your data and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Data & Privacy</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Your data is encrypted and stored securely</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>You can export your data at any time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>We comply with GDPR and data protection regulations</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="border-border/50">Download Data</Button>
                  <Button variant="outline" className="border-border/50 text-amber-400 hover:text-amber-500">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
