import { useAuth } from '../context/AuthContext'
import { useApiKeys } from '../context/ApiKeyContext'
import { Button } from '../components/ui/Button'

export function TopBar() {
  const { user, logout } = useAuth()
  const { activeKey } = useApiKeys()

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
        {activeKey && (
          <div className="hidden md:flex flex-col items-end text-xs">
            <span className="text-slate-500">Active AI engine</span>
            <span className="font-medium text-teal-700">{activeKey.label}</span>
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
