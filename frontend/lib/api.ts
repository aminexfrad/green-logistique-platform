import { AuthUser } from '@/lib/store'
import { Carrier, Shipment, User as ApiUser, CarbonProject, AuditLog } from '@/lib/mock-data'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function toCamelCase(key: string) {
  return key.replace(/_([a-z])/g, (_, char) => char.toUpperCase())
}

function normalizeKeys<T>(data: unknown): T {
  if (Array.isArray(data)) {
    return data.map((item) => normalizeKeys(item)) as unknown as T
  }

  if (data && typeof data === 'object' && data.constructor === Object) {
    const normalized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      normalized[toCamelCase(key)] = normalizeKeys(value)
    }
    return normalized as T
  }

  return data as T
}

function getAuthToken() {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage.getItem('authToken')
}

function getAuthHeaders() {
  const token = getAuthToken()
  return token ? { Authorization: `Token ${token}` } : {}
}

async function request<T>(path: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')
  const body = isJson ? await response.json() : null

  if (!response.ok) {
    throw new Error(body?.message || 'API request failed')
  }

  return normalizeKeys<T>(body)
}

export type LoginResult = {
  token: string
  user: AuthUser
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  return request<LoginResult>('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function registerUser(data: Record<string, unknown>): Promise<LoginResult> {
  return request<LoginResult>('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function fetchShipments(): Promise<Shipment[]> {
  return request<Shipment[]>('/api/shipments/')
}

export async function fetchCarriers(): Promise<Carrier[]> {
  return request<Carrier[]>('/api/carriers/')
}

export async function fetchVehicles(): Promise<any[]> {
  return request<any[]>('/api/vehicles/')
}

export async function fetchUsers(): Promise<ApiUser[]> {
  return request<ApiUser[]>('/api/users/')
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  return request<AuditLog[]>('/api/audit-logs/')
}

export async function fetchOrders(): Promise<Shipment[]> {
  return request<Shipment[]>('/api/orders/')
}

export async function fetchCarbonProjects(): Promise<CarbonProject[]> {
  return request<CarbonProject[]>('/api/carbon-projects/')
}

export async function fetchTracking(trackingNumber: string): Promise<Shipment> {
  const encoded = encodeURIComponent(trackingNumber)
  return request<Shipment>(`/api/track/?trackingNumber=${encoded}`)
}
