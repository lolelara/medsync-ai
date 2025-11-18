import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApiKeys } from '../context/ApiKeyContext'
import { Button } from '../components/ui/Button'
import { useLanguage } from '../context/LanguageContext'
import { useData } from '../context/DataContext'

export function TopBar() {
  const { user, logout } = useAuth()
  const { activeKey } = useApiKeys()
  const { language, toggleLanguage } = useLanguage()
  const { notifications, markNotificationRead } = useData()
  const [showNotifications, setShowNotifications] = useState(false)

  const myNotifications = user ? notifications.filter(n => n.userId === user.id) : []
  const unreadCount = myNotifications.filter(n => !n.read).length

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-teal-500 text-white flex items-center justify-center font-semibold">
          MS
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">MedSync AI Platform</div>
          <div className="text-xs text-slate-500">Clinical-grade AI prescription review</div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button
          variant="secondary"
          size="sm"
          className="text-xs px-2 py-1"
          onClick={toggleLanguage}
        >
          {language === 'ar' ? 'EN' : 'عربي'}
        </Button>
        {activeKey && (
          <div className="hidden md:flex flex-col items-end text-xs">
            <span className="text-slate-500">Active AI engine</span>
            <span className="font-medium text-teal-700">{activeKey.label}</span>
          </div>
        )}

        {user && (
          <div className="relative hidden md:block">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs px-2 py-1"
              onClick={() => setShowNotifications(prev => !prev)}
            >
              {language === 'ar' ? 'الإشعارات' : 'Notifications'}
              {unreadCount > 0 && (
                <span className="ml-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border border-slate-200 bg-white shadow-lg z-20 p-2 text-xs">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    {language === 'ar' ? 'الإشعارات (تجريبية)' : 'Notifications (demo)'}
                  </span>
                  <button
                    type="button"
                    className="text-[11px] text-slate-500 hover:text-slate-700"
                    onClick={() => setShowNotifications(false)}
                  >
                    {language === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>
                {myNotifications.length === 0 ? (
                  <div className="py-2 text-slate-500">
                    {language === 'ar'
                      ? 'لا توجد إشعارات في بيانات العرض الحالية.'
                      : 'No notifications in the current demo data.'}
                  </div>
                ) : (
                  <ul className="max-h-56 space-y-1 overflow-auto">
                    {myNotifications.map(n => (
                      <li
                        key={n.id}
                        className={`rounded-md px-2 py-1 ${n.read ? 'bg-slate-50' : 'bg-teal-50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-900">{n.title}</span>
                          {!n.read && (
                            <button
                              type="button"
                              className="text-[10px] text-teal-700 hover:underline"
                              onClick={() => markNotificationRead(n.id)}
                            >
                              {language === 'ar' ? 'تعليم كمقروء' : 'Mark read'}
                            </button>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-600">{n.body}</p>
                        <div className="mt-0.5 text-[10px] text-slate-400">
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <div className="font-medium text-slate-900">{user.name}</div>
              <div className="text-slate-500 capitalize">{user.role}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
