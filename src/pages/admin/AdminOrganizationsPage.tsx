import { useData } from '../../context/DataContext'
import { Card } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'
import { StatCard } from '../../components/ui/StatCard'
import { getDailyMetrics, getDoctorStats } from '../../services/analyticsService'

function AdminOrganizationsPage() {
  const { organizations, users, doctors, prescriptions } = useData()

  const totalPrescriptions = prescriptions.length
  const totalOrgs = organizations.length

  const metrics = organizations.map(org => {
    const orgPrescriptions = prescriptions.filter(p => p.organizationId === org.id)
    const flagged = orgPrescriptions.filter(p => p.status === 'flagged').length
    const orgDoctors = doctors.filter(d =>
      users.find(u => u.id === d.userId && u.organizationId === org.id)
    )

    return {
      org,
      total: orgPrescriptions.length,
      flagged,
      doctorsCount: orgDoctors.length,
      daily: getDailyMetrics(prescriptions, org.id),
      doctorStats: getDoctorStats(prescriptions, doctors, org.id),
    }
  })

  const highestFlaggedOrg = metrics.reduce<null | (typeof metrics)[number]>((acc, m) => {
    if (!acc) return m
    const accRate = acc.total ? acc.flagged / acc.total : 0
    const mRate = m.total ? m.flagged / m.total : 0
    return mRate > accRate ? m : acc
  }, null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Organizations</h1>
          <p className="mt-1 text-xs text-slate-500">
            Clinics and hospitals connected to the MedSync AI platform.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total organizations" value={totalOrgs} />
        <StatCard label="Total prescriptions" value={totalPrescriptions} />
        <StatCard
          label="Highest flagged rate"
          value={highestFlaggedOrg ? `${Math.round((highestFlaggedOrg.flagged / Math.max(highestFlaggedOrg.total, 1)) * 100)}%` : '—'}
          helper={highestFlaggedOrg ? highestFlaggedOrg.org.name : 'All within range'}
          accent="amber"
        />
      </div>

      <Card className="p-4">
        <Table>
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Organization
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Type
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Doctors
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Prescriptions
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Flagged
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {metrics.map(m => (
              <tr key={m.org.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 text-xs font-medium text-slate-900">{m.org.name}</td>
                <td className="px-3 py-2 text-xs text-slate-600 capitalize">{m.org.type}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{m.doctorsCount}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{m.total}</td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {m.flagged} ({m.total ? Math.round((m.flagged / m.total) * 100) : 0}%)
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}

export default AdminOrganizationsPage
