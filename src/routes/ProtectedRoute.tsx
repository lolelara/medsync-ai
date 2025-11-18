import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Role } from '../types'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  roles?: Role[]
  children: ReactNode
}

export function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { user, hasRole } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
