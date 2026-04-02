'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Truck, MapPin, Package, Calendar, AlertCircle } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface ShipmentFormProps {
  onSubmit?: (data: any) => void
}

export function ShipmentForm({ onSubmit }: ShipmentFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    weight: '',
    volume: '',
    cargoType: '',
    transportMode: 'road',
    deliveryDate: '',
    deliveryTime: '09:00',
  })

  // Calculate CO2 based on transport mode
  const co2Factors: { [key: string]: number } = {
    road: 62,
    rail: 18,
    maritime: 8,
    air: 500,
    multimodal: 40,
  }

  const weight = parseFloat(formData.weight) || 0
  const estimatedCO2 = (weight * co2Factors[formData.transportMode] * 100) / 1000

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      onSubmit?.(formData)
      toast.success('Shipment created successfully!')
      setFormData({
        origin: '',
        destination: '',
        weight: '',
        volume: '',
        cargoType: '',
        transportMode: 'road',
        deliveryDate: '',
        deliveryTime: '09:00',
      })
      setStep(1)
    }
  }

  const transportModes = [
    { value: 'road', label: 'Road (Routier)' },
    { value: 'rail', label: 'Rail (Ferroviaire)' },
    { value: 'maritime', label: 'Maritime' },
    { value: 'air', label: 'Air (Aérien)' },
    { value: 'multimodal', label: 'Multimodal' },
  ]

  const cargoTypes = [
    'Electronics',
    'Food & Beverages',
    'Textiles',
    'Machinery',
    'Chemicals',
    'Documents',
    'Other',
  ]

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{
                scale: 1,
                backgroundColor: step >= s ? 'var(--primary)' : 'var(--border)',
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-background"
            >
              {s}
            </motion.div>
            {s < 4 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: step > s ? 1 : 0 }}
                className="h-1 w-16 bg-primary origin-left"
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Origin & Destination */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: step === 1 ? 1 : 0, x: step === 1 ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className={step === 1 ? '' : 'hidden'}
      >
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Location Details
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="origin">Origin / Departure</Label>
              <Input
                id="origin"
                placeholder="e.g., Paris, France"
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="destination">Destination / Arrival</Label>
              <Input
                id="destination"
                placeholder="e.g., Barcelona, Spain"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="transportMode">Transport Mode</Label>
              <Select
                value={formData.transportMode}
                onValueChange={(value) =>
                  handleInputChange('transportMode', value)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {transportModes.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Step 2: Cargo Details */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: step === 2 ? 1 : 0, x: step === 2 ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className={step === 2 ? '' : 'hidden'}
      >
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Cargo Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="1000"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="volume">Volume (m³)</Label>
                <Input
                  id="volume"
                  type="number"
                  placeholder="5"
                  value={formData.volume}
                  onChange={(e) => handleInputChange('volume', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cargoType">Cargo Type</Label>
              <Select
                value={formData.cargoType}
                onValueChange={(value) =>
                  handleInputChange('cargoType', value)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select cargo type" />
                </SelectTrigger>
                <SelectContent>
                  {cargoTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Step 3: Delivery Details */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: step === 3 ? 1 : 0, x: step === 3 ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className={step === 3 ? '' : 'hidden'}
      >
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Delivery Schedule
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) =>
                  handleInputChange('deliveryDate', e.target.value)
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="deliveryTime">Delivery Time</Label>
              <Input
                id="deliveryTime"
                type="time"
                value={formData.deliveryTime}
                onChange={(e) =>
                  handleInputChange('deliveryTime', e.target.value)
                }
                className="mt-2"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Step 4: CO2 Summary & Review */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: step === 4 ? 1 : 0, x: step === 4 ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className={step === 4 ? '' : 'hidden'}
      >
        <div className="space-y-4">
          {/* CO2 Estimation Card */}
          <Card className="p-6 border-primary/20 bg-primary/5">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              CO2 Estimation & Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Estimated CO2</p>
                <p className="text-3xl font-bold text-primary">
                  {formatNumber(estimatedCO2, 1)} kg
                </p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground mb-1">
                  Greenest Option
                </p>
                <p className="text-2xl font-bold text-secondary">Maritime</p>
                <p className="text-xs text-muted-foreground">-87% CO2</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-card rounded-lg p-4 border border-border space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">From:</span>
                <span className="font-semibold text-foreground">
                  {formData.origin}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">To:</span>
                <span className="font-semibold text-foreground">
                  {formData.destination}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Weight:</span>
                <span className="font-semibold text-foreground">
                  {formData.weight} kg
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mode:</span>
                <span className="font-semibold text-foreground capitalize">
                  {formData.transportMode}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery:</span>
                <span className="font-semibold text-foreground">
                  {formData.deliveryDate} {formData.deliveryTime}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Step {step} of 4
        </span>
        <Button
          className="bg-primary text-background hover:bg-primary/90"
          onClick={handleSubmit}
        >
          {step === 4 ? 'Create Shipment' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
