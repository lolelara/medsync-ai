import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?: 'default' | 'green' | 'red' | 'amber' | 'blue'
}

export function Badge({ children, color = 'default' }: BadgeProps) {
  const colors: Record<string, string> = {
    default: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    amber: 'bg-amber-50 text-amber-800',
    blue: 'bg-primary-50 text-primary-700',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}
