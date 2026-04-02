'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Download, Shield, Edit, Trash2, LogIn, LogOut } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const auditLogs = [
  {
    id: 1,
    timestamp: '2026-04-02 14:35:22',
    user: 'admin@company.com',
    action: 'login',
    resource: 'Authentication',
    details: 'Successful login from 192.168.1.1',
    status: 'success',
    ipAddress: '192.168.1.1',
  },
  {
    id: 2,
    timestamp: '2026-04-02 14:30:15',
    user: 'john.carrier@transport.com',
    action: 'carrier_verified',
    resource: 'Carriers',
    details: 'Carrier "TransEco Services" verified with Gold certification',
    status: 'success',
    ipAddress: '10.0.0.5',
  },
  {
    id: 3,
    timestamp: '2026-04-02 14:25:40',
    user: 'shipper@logistics.com',
    action: 'shipment_created',
    resource: 'Shipments',
    details: 'New shipment created: SHP-2026-0042 (250kg, Paris to Lyon)',
    status: 'success',
    ipAddress: '172.16.0.1',
  },
  {
    id: 4,
    timestamp: '2026-04-02 14:20:05',
    user: 'admin@company.com',
    action: 'user_suspended',
    resource: 'Users',
    details: 'User account suspended: suspicious_user@email.com',
    status: 'warning',
    ipAddress: '192.168.1.1',
  },
  {
    id: 5,
    timestamp: '2026-04-02 14:15:30',
    user: 'carrier@fleet.com',
    action: 'mission_updated',
    resource: 'Missions',
    details: 'Mission MIS-2026-0156 status changed to "in_transit"',
    status: 'success',
    ipAddress: '203.0.113.42',
  },
  {
    id: 6,
    timestamp: '2026-04-02 14:10:12',
    user: 'admin@company.com',
    action: 'carbon_credits_updated',
    resource: 'Carbon Marketplace',
    details: 'Carbon credit price updated: Gold Standard 45€/ton',
    status: 'success',
    ipAddress: '192.168.1.1',
  },
  {
    id: 7,
    timestamp: '2026-04-02 14:05:48',
    user: 'client@shop.com',
    action: 'carbon_credit_purchase',
    resource: 'Carbon Marketplace',
    details: 'Purchased 100 carbon credits (Gold Standard) - €4,500',
    status: 'success',
    ipAddress: '198.51.100.1',
  },
  {
    id: 8,
    timestamp: '2026-04-02 13:55:22',
    user: 'unknown_user',
    action: 'failed_login',
    resource: 'Authentication',
    details: 'Failed login attempt for account: user@company.com',
    status: 'error',
    ipAddress: '203.0.113.99',
  },
]

export default function AdminAuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAction, setFilterAction] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = filterAction === 'all' || log.action === filterAction
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus
    return matchesSearch && matchesAction && matchesStatus
  })

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
        return <LogIn className="w-4 h-4" />
      case 'logout':
        return <LogOut className="w-4 h-4" />
      case 'user_suspended':
        return <Shield className="w-4 h-4" />
      default:
        return <Edit className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-900/30 text-green-400 border-green-700/50'
      case 'warning':
        return 'bg-amber-900/30 text-amber-400 border-amber-700/50'
      case 'error':
        return 'bg-red-900/30 text-red-400 border-red-700/50'
      default:
        return 'bg-muted/30'
    }
  }

  return (
    <DashboardLayout title="Audit Logs">
      <div className="space-y-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>Track all platform activities and changes</CardDescription>
              </div>
              <Button variant="outline" className="border-border/50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10 bg-muted/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-48 bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                    <SelectItem value="shipment_created">Shipment Created</SelectItem>
                    <SelectItem value="mission_updated">Mission Updated</SelectItem>
                    <SelectItem value="user_suspended">User Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border border-border/50 rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                      <TableCell className="text-sm font-medium">{log.user}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className="text-sm">{log.action.replace(/_/g, ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{log.resource}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{log.details}</TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">{log.ipAddress}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(log.status)}>
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {filteredLogs.length} of {auditLogs.length} logs</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
