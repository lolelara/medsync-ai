import { useState, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useLanguage } from '../context/LanguageContext'

function LoginPage() {
  const { users } = useData()
  const { loginAsUserId } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: Location } }
   const { language } = useLanguage()

  const [selectedUserId, setSelectedUserId] = useState('')

  const admins = users.filter(u => u.role === 'admin')
  const orgUsers = users.filter(u => u.role === 'org')
  const doctors = users.filter(u => u.role === 'doctor')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!selectedUserId) return

    const user = users.find(u => u.id === selectedUserId)
    if (!user) return

    loginAsUserId(user.id)

    const from = location.state?.from as any
    if (from?.pathname) {
      navigate(from.pathname, { replace: true })
      return
    }

    if (user.role === 'admin') navigate('/admin')
    else if (user.role === 'org') navigate('/org')
    else if (user.role === 'doctor') navigate('/doctor')
    else navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <Card className="p-6">
          <div className="mb-6 text-center">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white font-semibold">
              MS
            </div>
            <h1 className="mt-3 text-lg font-semibold text-slate-900">
              {language === 'ar' ? 'تسجيل الدخول إلى عرض MedSync AI' : 'MedSync AI Demo Login'}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {language === 'ar'
                ? 'اختر حساباً تجريبياً لاستكشاف تجربة المسؤول أو المنشأة أو الطبيب.'
                : 'Choose a demo account to explore the Admin, Organization or Doctor experience.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {language === 'ar' ? 'اختر مستخدماً تجريبياً' : 'Select a demo user'}
            </label>
            <select
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">
                {language === 'ar' ? 'اختر حساباً…' : 'Choose an account…'}
              </option>
              <optgroup label={language === 'ar' ? 'المسؤول' : 'Admin'}>
                {admins.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </optgroup>
              <optgroup label={language === 'ar' ? 'المنشآت' : 'Organizations'}>
                {orgUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </optgroup>
              <optgroup label={language === 'ar' ? 'الأطباء' : 'Doctors'}>
                {doctors.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </optgroup>
            </select>

            <Button type="submit" className="w-full mt-2">
              {language === 'ar' ? 'دخول المنصّة' : 'Enter platform'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
