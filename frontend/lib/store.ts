import { create } from 'zustand'

export type Role = 'admin' | 'shipper' | 'carrier' | 'client'
export type Language = 'fr' | 'en' | 'ar'

export type AuthUser = {
  name: string
  email: string
  role: Role
}

interface AppStore {
  authUser: AuthUser | null
  authToken: string | null
  setAuthState: (user: AuthUser, token: string) => void
  hydrateAuth: () => void
  logout: () => void
  language: Language
  setLanguage: (lang: Language) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  authUser: null,
  authToken: null,
  setAuthState: (user, token) => set({ authUser: user, authToken: token }),
  hydrateAuth: () => {
    if (typeof window === 'undefined') {
      return
    }

    const token = window.localStorage.getItem('authToken')
    const user = window.localStorage.getItem('authUser')

    if (!token || !user) {
      return
    }

    try {
      const parsedUser = JSON.parse(user) as AuthUser
      set({ authUser: parsedUser, authToken: token })
    } catch {
      // ignore invalid local storage data
    }
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('authToken')
      window.localStorage.removeItem('authUser')
      document.cookie = 'authToken=; path=/; max-age=0'
      document.cookie = 'userRole=; path=/; max-age=0'
    }
    set({ authUser: null, authToken: null })
  },
  language: 'fr',
  setLanguage: (lang) => set({ language: lang }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
