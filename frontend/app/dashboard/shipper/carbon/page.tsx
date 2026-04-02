'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { getTranslation } from '@/lib/translations'
import { fetchCarbonProjects } from '@/lib/api'
import { Leaf, ShoppingCart, Check, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { KPICard } from '@/components/shared/kpi-card'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CarbonProject } from '@/lib/mock-data'

export default function CarbonMarketplace() {
  const { language } = useAppStore()
  const t = (key: string) => getTranslation(language, key)
  const [projects, setProjects] = useState<CarbonProject[]>([])
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCarbonProjects()
      .then((data) => setProjects(data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const handleAddToCart = (projectId: string) => {
    setCart((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] || 0) + 1,
    }))
    toast.success('Project added to cart!')
  }

  const handleCheckout = () => {
    toast.success('Purchase completed! Certificate sent to your email.')
    setCart({})
    setCartOpen(false)
  }

  const cartTotal = Object.entries(cart).reduce((sum, [projectId, qty]) => {
    const project = projects.find((p) => p.id === projectId)
    return sum + (project?.pricePerTon || 0) * qty
  }, 0)

  const cartItems = Object.entries(cart).map(([projectId, qty]) => ({
    project: projects.find((p) => p.id === projectId)!,
    qty,
  }))

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Carbon Marketplace</h1>
            <p className="text-muted-foreground">Purchase carbon credits to offset your shipment emissions</p>
          </div>
          <Dialog open={cartOpen} onOpenChange={setCartOpen}>
            <DialogTrigger asChild>
              <button className="relative p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {Object.keys(cart).length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {Object.keys(cart).length}
                  </span>
                )}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Shopping Cart</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {cartItems.length > 0 ? (
                  <>
                    {cartItems.map((item) => (
                      <div
                        key={item.project.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{item.project.name}</p>
                          <p className="text-sm text-muted-foreground">{item.qty} ton(s) × ${item.project.pricePerTon}</p>
                        </div>
                        <p className="font-bold text-primary">${(item.qty * item.project.pricePerTon).toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between mb-4">
                        <span className="font-bold text-foreground">Total:</span>
                        <span className="font-bold text-2xl text-primary">${cartTotal.toFixed(2)}</span>
                      </div>
                      <Button className="w-full bg-primary text-background hover:bg-primary/90" onClick={handleCheckout}>
                        <Check className="w-4 h-4 mr-2" />
                        Checkout
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Total CO2 Compensated"
            value="1,200"
            icon={Leaf}
            unit="tons"
            color="primary"
            description="This year"
          />
          <KPICard
            title="Available Budget"
            value="$5,000"
            icon={ShoppingCart}
            color="secondary"
            description="Remaining balance"
          />
          <KPICard
            title="Carbon Offset Rate"
            value="78%"
            icon={TrendingDown}
            color="accent"
            description="Of total emissions"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Available Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
                Loading projects...
              </div>
            ) : (
              projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                    <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center text-5xl">
                      {project.image}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-foreground mb-2">{project.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 flex-1">{project.location}</p>
                      <div className="space-y-2 mb-4">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Certification: </span>
                          <span className="font-semibold text-foreground">{project.certification}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Available: </span>
                          <span className="font-semibold text-primary">{project.co2TonsAvailable.toLocaleString()} tons</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Price: </span>
                          <span className="font-bold text-secondary">${project.pricePerTon}/ton</span>
                        </div>
                      </div>
                      <Button className="w-full bg-primary text-background hover:bg-primary/90 gap-2" onClick={() => handleAddToCart(project.id)}>
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Recently Compensated Shipments</h3>
          <div className="space-y-3">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <div>
                  <p className="font-semibold text-foreground">{project.name}</p>
                  <p className="text-sm text-muted-foreground">Compensated {project.co2TonsAvailable.toLocaleString()} tons CO2</p>
                </div>
                <Check className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
