'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Copy, Check, AlertCircle, Smartphone } from 'lucide-react'
import { toast } from 'sonner'

export default function MFASetupPage() {
  const [step, setStep] = useState<'scan' | 'verify' | 'backup'>('scan')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const qrSecret = '00ABCD1234567890'
  const backupCodes = [
    'WXYZ-1234-5678',
    'ABCD-9012-3456',
    'EFGH-7890-1234',
    'IJKL-5678-9012',
    'MNOP-3456-7890',
  ]

  const handleCopy = async () => {
    await navigator.clipboard.writeText(qrSecret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setStep('verify')
      setIsLoading(false)
    }, 800)
  }

  const handleConfirmCode = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setStep('backup')
      setIsLoading(false)
    }, 800)
  }

  const handleDownloadBackup = () => {
    const text = `Green Logistique MFA Backup Codes\n${new Date().toLocaleDateString()}\n\n${backupCodes.join('\n')}`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mfa-backup-codes.txt'
    a.click()
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
              <Smartphone className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Setup Two-Factor Authentication</CardTitle>
          <CardDescription>Secure your account with 2FA</CardDescription>
        </CardHeader>

        <CardContent>
          {step === 'scan' && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-8 flex items-center justify-center border-2 border-dashed border-border/50">
                <div className="w-40 h-40 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QRCodePlaceholder />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Or enter this key manually:</label>
                  <div className="flex gap-2">
                    <Input value={qrSecret} readOnly className="bg-muted/50 font-mono text-sm" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopy}
                      className="border-border/50"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <ol className="text-sm space-y-2 text-muted-foreground">
                  <li>1. Download Google Authenticator or Authy on your phone</li>
                  <li>2. Scan this QR code or enter the key above</li>
                  <li>3. Click continue and enter the 6-digit code</li>
                </ol>
              </div>

              <Button onClick={() => setStep('verify')} className="w-full bg-primary hover:bg-primary/90">
                I've scanned the code
              </Button>
            </div>
          )}

          {step === 'verify' && (
            <form onSubmit={handleConfirmCode} className="space-y-4">
              <div className="bg-blue-900/20 border border-secondary/30 rounded-lg p-3 text-sm flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-secondary mt-0.5" />
                <div>Enter the 6-digit code from your authenticator app</div>
              </div>

              <FieldGroup>
                <Field>
                  <FieldLabel>Verification Code</FieldLabel>
                  <Input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="bg-muted/50 font-mono text-center text-2xl tracking-widest"
                    required
                  />
                </Field>
              </FieldGroup>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </form>
          )}

          {step === 'backup' && (
            <div className="space-y-4">
              <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4 space-y-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Save your backup codes</p>
                    <p className="text-muted-foreground text-xs">Store these codes in a safe place. You can use them to access your account if you lose access to your authenticator.</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                {backupCodes.map((code, i) => (
                  <div key={i} className="font-mono text-sm text-muted-foreground">
                    {code}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownloadBackup} className="flex-1 border-border/50">
                  <Copy className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  <Check className="w-4 h-4 mr-2" />
                  Done
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function QRCodePlaceholder() {
  return (
    <div className="space-y-1">
      <div className="text-4xl">◼◻◼</div>
      <div className="text-4xl">◻◼◻</div>
      <div className="text-4xl">◼◻◼</div>
      <p className="text-xs text-muted-foreground mt-4">QR Code</p>
    </div>
  )
}
