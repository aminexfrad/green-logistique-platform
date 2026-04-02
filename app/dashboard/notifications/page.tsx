'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, CheckCircle, AlertCircle, Info, Package, Truck, AlertTriangle } from 'lucide-react'

const notifications = [
  {
    id: 1,
    type: 'success',
    title: 'Shipment Delivered',
    message: 'Your shipment TRK-2026-0042 has been successfully delivered',
    timestamp: '2026-04-02 14:35:22',
    read: false,
    icon: CheckCircle,
  },
  {
    id: 2,
    type: 'info',
    title: 'Weekly Report Ready',
    message: 'Your weekly logistics report is ready for download',
    timestamp: '2026-04-02 09:00:00',
    read: false,
    icon: Info,
  },
  {
    id: 3,
    type: 'warning',
    title: 'CO2 Threshold Alert',
    message: 'Your monthly CO2 emissions are approaching the set threshold',
    timestamp: '2026-04-01 16:30:00',
    read: true,
    icon: AlertTriangle,
  },
  {
    id: 4,
    type: 'info',
    title: 'Mission Accepted',
    message: 'Driver has accepted your shipment for delivery',
    timestamp: '2026-04-01 12:15:00',
    read: true,
    icon: Truck,
  },
  {
    id: 5,
    type: 'success',
    title: 'Carbon Credits Purchased',
    message: 'You have successfully purchased 50 carbon credits',
    timestamp: '2026-03-31 11:20:00',
    read: true,
    icon: Package,
  },
  {
    id: 6,
    type: 'info',
    title: 'System Maintenance',
    message: 'System maintenance scheduled for tomorrow at 02:00 UTC',
    timestamp: '2026-03-30 15:45:00',
    read: true,
    icon: AlertCircle,
  },
]

export default function NotificationsPage() {
  const [filteredNotifications, setFilteredNotifications] = useState(notifications)
  const [filter, setFilter] = useState('all')

  const handleFilter = (value: string) => {
    setFilter(value)
    if (value === 'all') {
      setFilteredNotifications(notifications)
    } else if (value === 'unread') {
      setFilteredNotifications(notifications.filter((n) => !n.read))
    } else {
      setFilteredNotifications(notifications.filter((n) => n.type === value))
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/30 text-green-400 border-green-700/50'
      case 'warning':
        return 'bg-amber-900/30 text-amber-400 border-amber-700/50'
      case 'error':
        return 'bg-red-900/30 text-red-400 border-red-700/50'
      default:
        return 'bg-blue-900/30 text-blue-400 border-blue-700/50'
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DashboardLayout title="Notifications">
      <div className="space-y-6 max-w-4xl">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All notifications read'}
                </CardDescription>
              </div>
              <Button variant="outline" className="border-border/50" disabled={unreadCount === 0}>
                Mark all as read
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Select value={filter} onValueChange={handleFilter}>
                <SelectTrigger className="w-48 bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notifications</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => {
                  const Icon = notification.icon
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all ${
                        notification.read
                          ? 'bg-muted/20 border-border/50'
                          : 'bg-muted/30 border-border/50 ring-1 ring-primary/20'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg flex-shrink-0 ${getTypeColor(notification.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium">{notification.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!notification.read && (
                                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">
                                  New
                                </Badge>
                              )}
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No notifications to display</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
