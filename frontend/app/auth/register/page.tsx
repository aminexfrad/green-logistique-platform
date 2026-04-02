'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Lock, Building2, Hash, Briefcase, Check } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleNextStep = () => {
    setIsLoading(true)
    setTimeout(() => {
      setStep(2)
      setIsLoading(false)
    }, 500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-secondary/20 to-transparent rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-2xl border-border/50 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Join Green Logistique and optimize your logistics</CardDescription>
        </CardHeader>

        <CardContent>
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-4 block">Select your role</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'shipper', label: 'Expéditeur', desc: 'Manage shipments' },
                    { id: 'carrier', label: 'Transporteur', desc: 'Manage fleet' },
                    { id: 'admin', label: 'Administrator', desc: 'Manage platform' },
                  ].map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        role === r.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 bg-muted/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{r.label}</h3>
                          <p className="text-sm text-muted-foreground">{r.desc}</p>
                        </div>
                        {role === r.id && <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-primary-foreground" /></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleNextStep} disabled={!role || isLoading} className="w-full bg-primary hover:bg-primary/90">
                {isLoading ? 'Loading...' : 'Continue'}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>First Name</FieldLabel>
                    <Input placeholder="John" required className="bg-muted/50" />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Last Name</FieldLabel>
                    <Input placeholder="Doe" required className="bg-muted/50" />
                  </Field>
                </FieldGroup>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input type="email" placeholder="you@company.com" className="pl-10 bg-muted/50" required />
                  </div>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Company Name</FieldLabel>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input placeholder="Your Company" className="pl-10 bg-muted/50" required />
                  </div>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>SIRET Number</FieldLabel>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input placeholder="14 digits" className="pl-10 bg-muted/50" />
                  </div>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Sector</FieldLabel>
                  <Select>
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Select a sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="ecommerce">E-Commerce</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="pharma">Pharmaceuticals</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input type="password" placeholder="••••••••" className="pl-10 bg-muted/50" required />
                  </div>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input type="password" placeholder="••••••••" className="pl-10 bg-muted/50" required />
                  </div>
                </Field>
              </FieldGroup>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox required className="mt-1" />
                <span className="text-sm text-muted-foreground">I agree to the terms of service and privacy policy</span>
              </label>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-border/50">
                  Back
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1 bg-primary hover:bg-primary/90">
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
