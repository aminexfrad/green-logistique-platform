'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { getTranslation } from '@/lib/translations'
import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

const quarterlyData = [
  { quarter: 'Q1', emissions: 1200, compensated: 300, offset: 25 },
  { quarter: 'Q2', emissions: 1400, compensated: 500, offset: 36 },
  { quarter: 'Q3', emissions: 1600, compensated: 800, offset: 50 },
  { quarter: 'Q4', emissions: 1800, compensated: 1200, offset: 67 },
]

const monthlyScores = [
  { month: 'Jan', esg: 65 },
  { month: 'Feb', esg: 68 },
  { month: 'Mar', esg: 72 },
  { month: 'Apr', esg: 75 },
  { month: 'May', esg: 78 },
  { month: 'Jun', esg: 80 },
]

export default function ESGReports() {
  const { language } = useAppStore()
  const t = (key: string) => getTranslation(language, key)

  const reports = [
    {
      id: 1,
      period: 'H1 2026',
      date: 'June 30, 2026',
      status: 'completed',
      score: 78,
      certification: 'Silver',
    },
    {
      id: 2,
      period: 'Q1 2026',
      date: 'March 31, 2026',
      status: 'completed',
      score: 72,
      certification: 'Silver',
    },
    {
      id: 3,
      period: 'Full Year 2025',
      date: 'December 31, 2025',
      status: 'completed',
      score: 68,
      certification: 'Bronze',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ESG Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Monitor your Environmental, Social, and Governance performance
          </p>
        </div>

        {/* Current ESG Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Score Circle */}
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="8"
                    strokeDasharray={`${(80 / 100) * 339.3} 339.3`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-primary">80</p>
                  <p className="text-xs text-muted-foreground">/100</p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Certification Level
                </p>
                <p className="text-2xl font-bold text-foreground">Gold</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Last Updated
                </p>
                <p className="text-2xl font-bold text-foreground">Apr 2, 2026</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">
                    Environmental
                  </span>
                  <span className="text-sm font-bold text-green-500">85</span>
                </div>
                <div className="h-2 bg-sidebar-accent/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">
                    Social
                  </span>
                  <span className="text-sm font-bold text-secondary">78</span>
                </div>
                <div className="h-2 bg-sidebar-accent/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: '78%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">
                    Governance
                  </span>
                  <span className="text-sm font-bold text-blue-500">77</span>
                </div>
                <div className="h-2 bg-sidebar-accent/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: '77%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quarterly Emissions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Quarterly Emissions & Offset
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="emissions"
                  fill="var(--chart-3)"
                  name="Total Emissions"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="compensated"
                  fill="var(--primary)"
                  name="Compensated"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ESG Score Trend */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              ESG Score Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="esg"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--primary)', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="ESG Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Available Reports */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">
            Available Reports
          </h3>
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-sidebar-accent/5 hover:bg-sidebar-accent/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">
                      ESG Report - {report.period}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Generated on {report.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-primary">{report.score}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.certification}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'CO2 Reduction',
                value: '23%',
                description: 'vs last year',
                color: 'green-500',
              },
              {
                title: 'Green Shipments',
                value: '67%',
                description: 'of total shipments',
                color: 'primary',
              },
              {
                title: 'Offset Rate',
                value: '50%',
                description: 'of total emissions',
                color: 'secondary',
              },
            ].map((insight) => (
              <Card
                key={insight.title}
                className="p-4 bg-sidebar-accent/5 border-border"
              >
                <p className="text-sm text-muted-foreground mb-2">
                  {insight.title}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    insight.color === 'primary'
                      ? 'text-primary'
                      : `text-${insight.color}`
                  }`}
                >
                  {insight.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {insight.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
