import { NavLink } from 'react-router-dom'

interface SidebarProps {
  variant: 'admin' | 'doctor' | 'org'
}

export function Sidebar({ variant }: SidebarProps) {
  const navAdmin = [
    { to: '/admin', label: 'Overview' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/organizations', label: 'Organizations' },
    { to: '/admin/api-keys', label: 'API Keys' },
    { to: '/admin/settings', label: 'Settings' },
  ]

  const navDoctor = [
    { to: '/doctor', label: 'My Queue' },
  ]

  const navOrg = [
    { to: '/org', label: 'Overview' },
    { to: '/org/doctors', label: 'Doctors' },
    { to: '/org/prescriptions', label: 'Prescriptions' },
  ]

  const items = variant === 'admin' ? navAdmin : variant === 'doctor' ? navDoctor : navOrg

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 flex-col border-r border-slate-200 bg-white">
      <div className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {variant === 'admin' && 'Admin Console'}
        {variant === 'doctor' && 'Doctor Workspace'}
        {variant === 'org' && 'Organization Portal'}
      </div>
      <nav className="flex-1 space-y-1 px-3 pb-4">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
