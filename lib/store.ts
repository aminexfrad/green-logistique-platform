import { create } from 'zustand'

export type Role = 'admin' | 'expéditeur' | 'transporteur' | 'client'
export type Language = 'fr' | 'en' | 'ar'

interface AppStore {
  currentRole: Role
  setCurrentRole: (role: Role) => void
  language: Language
  setLanguage: (lang: Language) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  currentRole: 'expéditeur',
  setCurrentRole: (role) => set({ currentRole: role }),
  language: 'fr',
  setLanguage: (lang) => set({ language: lang }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
