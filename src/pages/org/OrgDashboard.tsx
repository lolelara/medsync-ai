import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/ui/Card'
import { StatCard } from '../../components/ui/StatCard'
import { Table } from '../../components/ui/Table'
import { MiniLineChart } from '../../charts/MiniLineChart'
import { getDailyMetrics, getDoctorStats } from '../../services/analyticsService'

function OrgDashboard() {
  const { user } = useAuth()
  const { organizations, doctors, users, prescriptions } = useData()

  const org = organizations.find(o => o.id === user?.organizationId)

  if (!org) {
    return <div className="text-sm text-slate-600">No organization attached to this account.</div>
  }

  const orgDoctors = doctors.filter(d =>
    users.find(u => u.id === d.userId && u.organizationId === org.id)
  )
  const orgPrescriptions = prescriptions.filter(p => p.organizationId === org.id)
  const flagged = orgPrescriptions.filter(p => p.status === 'flagged').length

  const dailyMetrics = getDailyMetrics(prescriptions, org.id)
  const doctorStats = getDoctorStats(prescriptions, doctors, org.id)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{org.name}</h1>
        <p className="mt-1 text-xs text-slate-500">
          Organization-wide prescribing overview powered by MedSync AI (mock data).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Doctors" value={orgDoctors.length} />
        <StatCard label="Total prescriptions" value={orgPrescriptions.length} />
        <StatCard
          label="Flagged by AI"
          value={flagged}
          helper={
            orgPrescriptions.length
              ? `${Math.round((flagged / orgPrescriptions.length) * 100)}% of org volume`
              : 'No data'
          }
          accent="amber"
        />
        <StatCard label="Location" value={org.type} helper={org.address} accent="blue" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Daily prescribing trend</h2>
              <p className="text-xs text-slate-500">Mocked 7-day time series for this organization.</p>
            </div>
          </div>
          <MiniLineChart data={dailyMetrics} />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Activity by doctor</h2>
              <p className="text-xs text-slate-500">Total and flagged prescriptions by clinician.</p>
            </div>
          </div>
          <Table>
            <tbody className="divide-y divide-slate-100 bg-white text-xs">
              {doctorStats.map(stat => {
                const doctor = doctors.find(d => d.id === stat.doctorId)
                const userDoc = users.find(u => u.id === doctor?.userId)
                const rate = stat.totalPrescriptions
                  ? Math.round((stat.flaggedPrescriptions / stat.totalPrescriptions) * 100)
                  : 0
                return (
                  <tr key={stat.doctorId}>
                    <td className="px-3 py-2 font-medium text-slate-900">{userDoc?.name}</td>
                    <td className="px-3 py-2 text-slate-600">{doctor?.specialty}</td>
                    <td className="px-3 py-2 text-slate-600">{stat.totalPrescriptions}</td>
                    <td className="px-3 py-2 text-slate-600">
                      {stat.flaggedPrescriptions} ({rate}%)
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

export default OrgDashboard
