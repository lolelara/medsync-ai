import { Card } from '../../components/ui/Card'

function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Platform settings</h1>
        <p className="mt-1 text-xs text-slate-500">
          High-level configuration toggles for the MedSync AI demo environment.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-slate-900">Alerting</h2>
          <p className="mt-1 text-xs text-slate-500">
            Configure how the platform would notify admins when all AI keys are degraded or down.
          </p>
          <div className="mt-3 space-y-2 text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-3 w-3 rounded border-slate-300" defaultChecked />
              <span>Email platform admins when all keys are down</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-3 w-3 rounded border-slate-300" />
              <span>Send weekly prescribing quality summary</span>
            </label>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold text-slate-900">Audit and logging</h2>
          <p className="mt-1 text-xs text-slate-500">
            Demo-only toggles showing how a real deployment could capture prescribing events.
          </p>
          <div className="mt-3 space-y-2 text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-3 w-3 rounded border-slate-300" defaultChecked />
              <span>Track AI review decisions (approved, rejected, flagged)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-3 w-3 rounded border-slate-300" defaultChecked />
              <span>Enable per-organization prescribing analytics</span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminSettingsPage
