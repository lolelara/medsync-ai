import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'
import { StatusPill } from '../../components/ui/StatusPill'

function OrgPrescriptionsPage() {
  const { user } = useAuth()
  const { organizations, users, doctors, prescriptions } = useData()

  const org = organizations.find(o => o.id === user?.organizationId)

  if (!org) {
    return <div className="text-sm text-slate-600">No organization attached to this account.</div>
  }

  const orgPrescriptions = prescriptions.filter(p => p.organizationId === org.id)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Prescriptions for {org.name}</h1>
        <p className="mt-1 text-xs text-slate-500">
          Organization-wide view of prescriptions with AI status and risk score.
        </p>
      </div>

      <Card className="p-4">
        <Table>
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Patient
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Doctor
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Diagnosis
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
            {orgPrescriptions.map(p => {
              const doctor = doctors.find(d => d.id === p.assignedDoctorId)
              const userDoc = users.find(u => u.id === doctor?.userId)
              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-xs font-medium text-slate-900">{p.patientName}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">{userDoc?.name}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">{p.diagnosis}</td>
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

export default OrgPrescriptionsPage
