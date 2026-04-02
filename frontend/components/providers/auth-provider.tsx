'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuthState = useAppStore((state) => state.setAuthState)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const token = window.localStorage.getItem('authToken')
    const storedUser = window.localStorage.getItem('authUser')

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setAuthState(parsedUser, token)
      } catch {
        // Ignore invalid stored auth data
      }
    }
  }, [setAuthState])

  return <>{children}</>
}
