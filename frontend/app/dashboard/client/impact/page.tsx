'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Leaf, Zap, Trees, TrendingDown } from 'lucide-react'

const co2Data = [
  { month: 'Jan', co2: 245, baseline: 380 },
  { month: 'Feb', co2: 321, baseline: 380 },
  { month: 'Mar', co2: 198, baseline: 380 },
  { month: 'Apr', co2: 267, baseline: 380 },
  { month: 'May', co2: 289, baseline: 380 },
]

const transportModes = [
  { name: 'Electric', value: 45, color: '#2dff6e' },
  { name: 'GNV', value: 25, color: '#4dc8ff' },
  { name: 'Conventional', value: 30, color: '#ffc34d' },
]

const deliveries = [
  { id: 1, tracking: 'TRK-2026-0001', co2: 12.5, trees: 0.3, mode: 'Electric' },
  { id: 2, tracking: 'TRK-2026-0002', co2: 18.3, trees: 0.4, mode: 'Electric' },
  { id: 3, tracking: 'TRK-2026-0003', co2: 8.7, trees: 0.2, mode: 'GNV' },
  { id: 4, tracking: 'TRK-2026-0004', co2: 24.5, trees: 0.5, mode: 'Conventional' },
]

export default function ClientImpactPage() {
  const totalCO2 = deliveries.reduce((sum, d) => sum + d.co2, 0)
  const totalTrees = deliveries.reduce((sum, d) => sum + d.trees, 0)
  const savings = (totalCO2 * 0.35).toFixed(1)

  return (
    <DashboardLayout title="Environmental Impact">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total CO2 Emitted', value: `${totalCO2.toFixed(1)} kg`, icon: Zap, color: 'text-amber-400' },
            { label: 'Trees Equivalent', value: `${totalTrees.toFixed(1)}`, icon: Trees, color: 'text-green-400' },
            { label: 'CO2 Saved', value: `${savings} kg`, icon: TrendingDown, color: 'text-green-400' },
            { label: 'Green Shipments', value: '70%', icon: Leaf, color: 'text-primary' },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} className="bg-card/50 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>CO2 Emissions Trend</CardTitle>
              <CardDescription>Your emissions vs. industry baseline</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={co2Data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0b0f0e', border: '1px solid #1f2720' }}
                    cursor={{ stroke: '#2dff6e' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="co2" stroke="#2dff6e" strokeWidth={2} name="Your Emissions" />
                  <Line type="monotone" dataKey="baseline" stroke="#ffc34d" strokeWidth={2} name="Baseline" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Transport Modes</CardTitle>
              <CardDescription>Distribution of deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={transportModes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {transportModes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0b0f0e', border: '1px solid #1f2720' }}
                    formatter={(value) => `${value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Recent Deliveries Impact</CardTitle>
            <CardDescription>Environmental metrics for your recent orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{delivery.tracking}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {delivery.co2} kg CO2 • {delivery.trees} trees equivalent
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      delivery.mode === 'Electric'
                        ? 'bg-green-900/30 text-green-400 border-green-700/50'
                        : delivery.mode === 'GNV'
                          ? 'bg-blue-900/30 text-blue-400 border-blue-700/50'
                          : 'bg-amber-900/30 text-amber-400 border-amber-700/50'
                    }
                  >
                    {delivery.mode}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-green-900/10 border-border/50">
          <CardHeader>
            <CardTitle>Environmental Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Request consolidated shipments to reduce per-unit emissions</li>
              <li>• Prefer electric or GNV transport when available</li>
              <li>• Consider carbon offset programs for necessary conventional deliveries</li>
              <li>• Monitor your monthly impact and set reduction targets</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
