import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'

function OrgDoctorsPage() {
  const { user } = useAuth()
  const { organizations, users, doctors } = useData()

  const org = organizations.find(o => o.id === user?.organizationId)

  if (!org) {
    return <div className="text-sm text-slate-600">No organization attached to this account.</div>
  }

  const orgDoctors = doctors.filter(d =>
    users.find(u => u.id === d.userId && u.organizationId === org.id)
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Doctors at {org.name}</h1>
        <p className="mt-1 text-xs text-slate-500">
          Demo roster of clinicians associated with this clinic or hospital.
        </p>
      </div>

      <Card className="p-4">
        <Table>
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Name
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Specialty
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                License
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {orgDoctors.map(doc => {
              const userDoc = users.find(u => u.id === doc.userId)
              return (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-xs font-medium text-slate-900">{userDoc?.name}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">{doc.specialty}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">{doc.licenseNumber}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}

export default OrgDoctorsPage
