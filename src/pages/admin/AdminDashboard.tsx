import { useData } from '../../context/DataContext'
import { useApiKeys } from '../../context/ApiKeyContext'
import { Card } from '../../components/ui/Card'
import { StatCard } from '../../components/ui/StatCard'
import { StatusPill } from '../../components/ui/StatusPill'
import { Table } from '../../components/ui/Table'
import { MiniLineChart } from '../../charts/MiniLineChart'
import { getDailyMetrics } from '../../services/analyticsService'

function AdminDashboard() {
  const { users, organizations, prescriptions } = useData()
  const { apiKeys } = useApiKeys()

  const totalPrescriptions = prescriptions.length
  const flaggedPrescriptions = prescriptions.filter(p => p.status === 'flagged').length
  const approvalRate = totalPrescriptions
    ? Math.round(((totalPrescriptions - flaggedPrescriptions) / totalPrescriptions) * 100)
    : 0

  const totalDoctors = users.filter(u => u.role === 'doctor').length
  const totalOrgs = organizations.length

  const dailyMetrics = getDailyMetrics(prescriptions)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Admin overview</h1>
          <p className="mt-1 text-xs text-slate-500">
            High-level view of prescribing activity, organizations and AI engine status.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total prescriptions" value={totalPrescriptions} helper="Last 7 days" />
        <StatCard
          label="Flagged by AI"
          value={flaggedPrescriptions}
          helper={`${approvalRate}% cleared`}
          accent={flaggedPrescriptions > 0 ? 'amber' : 'teal'}
        />
        <StatCard
          label="Active doctors"
          value={totalDoctors}
          helper={`${totalOrgs} organizations`}
        />
        <StatCard
          label="Configured API keys"
          value={apiKeys.length}
          helper={`${apiKeys.filter(k => k.status === 'active').length} healthy`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Daily prescribing trend</h2>
              <p className="text-xs text-slate-500">Mock data across all organizations</p>
            </div>
          </div>
          <MiniLineChart data={dailyMetrics} />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">AI engine keys</h2>
              <p className="text-xs text-slate-500">Status, provider and last health check</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            {apiKeys.map(key => (
              <div
                key={key.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{key.label}</span>
                    {key.isPrimary && (
                      <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span className="uppercase tracking-wide">{key.provider}</span>
                    <span>{key.keyMasked}</span>
                    {key.lastCheckedAt && (
                      <span>
                        Last check {new Date(key.lastCheckedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusPill type="apikey" status={key.status} />
                  <div className="text-[10px] text-slate-500">
                    {Math.round(key.successRate * 100)}% success · {Math.round(key.errorRate * 100)}% errors
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Recent prescriptions</h2>
            <p className="text-xs text-slate-500">Cross-organization snapshot with AI decisions.</p>
          </div>
        </div>
        <Table>
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Patient
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Diagnosis
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Doctor
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Organization
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Risk
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {prescriptions.slice(0, 8).map(p => {
              const doctorUser = users.find(u => u.id ===
                (p.assignedDoctorId === 'doc-1'
                  ? 'user-doc-1'
                  : p.assignedDoctorId === 'doc-2'
                  ? 'user-doc-2'
                  : 'user-doc-3')
              )
              const org = organizations.find(o => o.id === p.organizationId)
              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-xs font-medium text-slate-900">{p.patientName}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">{p.diagnosis}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">{doctorUser?.name}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">{org?.name}</td>
                  <td className="px-3 py-2 text-xs">
                    <StatusPill type="prescription" status={p.status} />
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600">
                    {(p.aiRiskScore * 100).toFixed(0)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}

export default AdminDashboard
