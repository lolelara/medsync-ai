import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

interface SidebarProps {
  variant: 'admin' | 'doctor' | 'org'
}

export function Sidebar({ variant }: SidebarProps) {
  const { language } = useLanguage()

  const navAdmin = [
    { to: '/admin', label: language === 'ar' ? 'نظرة عامة' : 'Overview' },
    { to: '/admin/users', label: language === 'ar' ? 'المستخدمون' : 'Users' },
    { to: '/admin/organizations', label: language === 'ar' ? 'المنشآت' : 'Organizations' },
    { to: '/admin/api-keys', label: language === 'ar' ? 'مفاتيح واجهات البرمجة' : 'API Keys' },
    { to: '/admin/settings', label: language === 'ar' ? 'الإعدادات' : 'Settings' },
  ]

  const navDoctor = [
    { to: '/doctor', label: language === 'ar' ? 'قائمة الوصفات' : 'My Queue' },
  ]

  const navOrg = [
    { to: '/org', label: language === 'ar' ? 'نظرة عامة' : 'Overview' },
    { to: '/org/doctors', label: language === 'ar' ? 'الأطباء' : 'Doctors' },
    { to: '/org/prescriptions', label: language === 'ar' ? 'الوصفات' : 'Prescriptions' },
  ]

  const items = variant === 'admin' ? navAdmin : variant === 'doctor' ? navDoctor : navOrg

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 flex-col border-r border-slate-200 bg-white">
      <div className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {variant === 'admin' && (language === 'ar' ? 'لوحة تحكم المسؤول' : 'Admin Console')}
        {variant === 'doctor' && (language === 'ar' ? 'مساحة عمل الطبيب' : 'Doctor Workspace')}
        {variant === 'org' && (language === 'ar' ? 'بوابة المنشأة' : 'Organization Portal')}
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
