import { Role } from './store'

export type AuthUser = {
  name: string
  email: string
  role: Role
}

export type AuthResult = {
  user: AuthUser
  token: string
}

export function getDashboardRoute(role: Role) {
  switch (role) {
    case 'admin':
      return '/dashboard/admin'
    case 'shipper':
      return '/dashboard/shipper'
    case 'carrier':
      return '/dashboard/carrier'
    case 'client':
      return '/dashboard/client/track'
    default:
      return '/dashboard/client/track'
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  const response = await fetch(`${API_URL}/api/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Login failed')
  }

  return response.json()
}
