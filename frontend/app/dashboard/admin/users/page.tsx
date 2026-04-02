'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { fetchUsers } from '@/lib/api'
import { Search, Plus, Edit2, Trash2, Lock, Shield } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { User as ApiUser } from '@/lib/mock-data'

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.status === 'active') ||
      (filterStatus === 'inactive' && user.status !== 'active')

    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-900/30 text-red-400 border-red-700/50',
      shipper: 'bg-green-900/30 text-green-400 border-green-700/50',
      carrier: 'bg-blue-900/30 text-blue-400 border-blue-700/50',
      client: 'bg-purple-900/30 text-purple-400 border-purple-700/50',
    }
    return colors[role] || 'bg-muted/30'
  }

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? 'bg-green-900/30 text-green-400 border-green-700/50'
      : 'bg-red-900/30 text-red-400 border-red-700/50'
  }

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage platform users and permissions</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="User email" className="bg-muted/50" />
                    <Select>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="shipper">Shipper</SelectItem>
                        <SelectItem value="carrier">Carrier</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="w-full bg-primary hover:bg-primary/90">Create User</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-10 bg-muted/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40 bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="shipper">Shipper</SelectItem>
                    <SelectItem value="carrier">Carrier</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border border-border/50 rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-border/50 hover:bg-muted/30">
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getRoleBadge(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{user.company || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getStatusBadge(user.status)}`}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-amber-400 hover:text-amber-500">
                              <Lock className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{loading ? 'Fetching users...' : `Showing ${filteredUsers.length} users`}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
