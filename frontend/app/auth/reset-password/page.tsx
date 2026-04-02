'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ResetPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setStep('reset')
      setIsLoading(false)
    }, 1500)
  }

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-secondary/20 to-transparent rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md border-border/50 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>We&apos;ll help you regain access to your account</CardDescription>
        </CardHeader>

        <CardContent>
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      className="pl-10 bg-muted/50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Enter the email address associated with your account</p>
                </Field>
              </FieldGroup>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? 'Sending email...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-4 text-sm text-foreground/80">
                <p className="font-medium mb-1">Reset link sent!</p>
                <p>We&apos;ve sent a password reset link to <strong>{email}</strong></p>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel>Reset Code</FieldLabel>
                  <Input placeholder="6-digit code from email" className="bg-muted/50 font-mono text-center tracking-widest" maxLength={6} required />
                  <p className="text-xs text-muted-foreground mt-2">Code expires in 30 minutes</p>
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel>New Password</FieldLabel>
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

              <div className="space-y-3">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? 'Resetting password...' : 'Reset Password'}
                </Button>

                <Button variant="outline" onClick={() => setStep('email')} className="w-full border-border/50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
