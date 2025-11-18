import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

interface LayoutProps {
  children: ReactNode
}

export function OrgLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar variant="org" />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="p-6 space-y-6">{children}</main>
      </div>
    </div>
  )
}
