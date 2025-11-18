import { useData } from '../../context/DataContext'
import { Card } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'

function AdminUsersPage() {
  const { users, organizations } = useData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Users</h1>
        <p className="mt-1 text-xs text-slate-500">
          Demo directory of all platform users across roles and organizations.
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
                Email
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Role
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Organization
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {users.map(user => {
              const org = organizations.find(o => o.id === user.organizationId)
              return (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-xs font-medium text-slate-900">{user.name}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">{user.email}</td>
                  <td className="px-3 py-2 text-xs">
                    <Badge color={user.role === 'admin' ? 'blue' : user.role === 'doctor' ? 'green' : 'amber'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600">{org?.name ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}

export default AdminUsersPage
