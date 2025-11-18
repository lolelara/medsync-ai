import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/ui/Card'
import { StatCard } from '../../components/ui/StatCard'
import { Table } from '../../components/ui/Table'
import { StatusPill } from '../../components/ui/StatusPill'
import { Button } from '../../components/ui/Button'
import { useEffect, useMemo } from 'react'
import { Doctor } from '../../types'

function DoctorDashboard() {
  const { user } = useAuth()
  const { users, doctors, prescriptions, updatePrescriptionStatus } = useData()

  const doctorProfile: Doctor | undefined = useMemo(
    () => doctors.find(d => d.userId === user?.id),
    [doctors, user]
  )

  const myPrescriptions = useMemo(
    () =>
      doctorProfile
        ? prescriptions.filter(p => p.assignedDoctorId === doctorProfile.id)
        : [],
    [prescriptions, doctorProfile]
  )

  useEffect(() => {
    if (!user) return
  }, [user])

  const pending = myPrescriptions.filter(p => p.status === 'pending')
  const flagged = myPrescriptions.filter(p => p.status === 'flagged')
  const approved = myPrescriptions.filter(p => p.status === 'approved')

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">My prescription queue</h1>
        <p className="mt-1 text-xs text-slate-500">
          Review AI-assisted prescribing suggestions and finalize decisions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Pending review" value={pending.length} />
        <StatCard label="Flagged by AI" value={flagged.length} accent="amber" />
        <StatCard label="Approved" value={approved.length} accent="teal" />
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Prescriptions</h2>
            <p className="text-xs text-slate-500">AI risk scoring and flags are mock data for demo purposes.</p>
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
                AI summary
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Risk
              </th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {myPrescriptions.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 text-xs font-medium text-slate-900">{p.patientName}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{p.diagnosis}</td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {p.aiReviewSummary.length > 80
                    ? p.aiReviewSummary.slice(0, 80) + '…'
                    : p.aiReviewSummary}
                </td>
                <td className="px-3 py-2 text-xs">
                  <StatusPill type="prescription" status={p.status} />
                </td>
                <td className="px-3 py-2 text-xs text-slate-600">
                  {(p.aiRiskScore * 100).toFixed(0)}%
                </td>
                <td className="px-3 py-2 text-xs text-right space-x-1 whitespace-nowrap">
                  <Link to={`/doctor/prescriptions/${p.id}`}>
                    <Button variant="secondary" size="sm">
                      Open
                    </Button>
                  </Link>
                  {p.status !== 'approved' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => updatePrescriptionStatus(p.id, 'approved')}
                    >
                      Approve
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}

export default DoctorDashboard
