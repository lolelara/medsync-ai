import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import { Role, User } from '../types'
import { useData } from './DataContext'

interface AuthContextValue {
  user: User | null
  loginAsUserId: (id: string) => void
  logout: () => void
  hasRole: (role: Role | Role[]) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { users } = useData()
  const [userId, setUserId] = useState<string | null>(null)

  const user = useMemo(
    () => users.find(u => u.id === userId) ?? null,
    [users, userId]
  )

  const loginAsUserId = (id: string) => {
    setUserId(id)
  }

  const logout = () => {
    setUserId(null)
  }

  const hasRole = (role: Role | Role[]) => {
    if (!user) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(user.role)
  }

  const value = useMemo(
    () => ({ user, loginAsUserId, logout, hasRole }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
