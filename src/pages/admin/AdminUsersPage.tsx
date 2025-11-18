import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useLanguage } from '../../context/LanguageContext'
import { Role } from '../../types'

function AdminUsersPage() {
  const { users, organizations, doctors, prescriptions, updateUser } = useData()
  const { language } = useLanguage()

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState<Role>('doctor')
  const [editOrgId, setEditOrgId] = useState('')

  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null

  const handleStartEdit = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (!user) return
    setSelectedUserId(user.id)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditRole(user.role)
    setEditOrgId(user.organizationId ?? '')
  }

  const handleSave = () => {
    if (!selectedUserId) return
    updateUser(selectedUserId, {
      name: editName,
      email: editEmail,
      role: editRole,
      organizationId: editOrgId || undefined,
    })
  }

  const getUserActivitySummary = () => {
    if (!selectedUser) return null

    if (selectedUser.role === 'doctor') {
      const doctorProfile = doctors.find(d => d.userId === selectedUser.id)
      if (!doctorProfile) return null
      const myPrescriptions = prescriptions.filter(p => p.assignedDoctorId === doctorProfile.id)
      const pending = myPrescriptions.filter(p => p.status === 'pending').length
      const flagged = myPrescriptions.filter(p => p.status === 'flagged').length
      const approved = myPrescriptions.filter(p => p.status === 'approved').length

      return (
        <ul className="mt-2 text-xs text-slate-600 list-disc list-inside">
          <li>
            {language === 'ar'
              ? `إجمالي الوصفات في هذا الديمو: ${myPrescriptions.length}`
              : `Total prescriptions in this demo: ${myPrescriptions.length}`}
          </li>
          <li>
            {language === 'ar'
              ? `في الانتظار: ${pending} · معلمة من الذكاء الاصطناعي: ${flagged} · معتمدة: ${approved}`
              : `Pending: ${pending} · Flagged by AI: ${flagged} · Approved: ${approved}`}
          </li>
        </ul>
      )
    }

    if (selectedUser.role === 'org') {
      const orgPrescriptions = prescriptions.filter(p => p.organizationId === selectedUser.organizationId)
      const total = orgPrescriptions.length
      const flagged = orgPrescriptions.filter(p => p.status === 'flagged').length

      return (
        <ul className="mt-2 text-xs text-slate-600 list-disc list-inside">
          <li>
            {language === 'ar'
              ? `إجمالي الوصفات المرتبطة بهذه المنشأة في الديمو: ${total}`
              : `Total prescriptions for this organization in the demo: ${total}`}
          </li>
          <li>
            {language === 'ar'
              ? `وصفات معلمة من الذكاء الاصطناعي: ${flagged}`
              : `Prescriptions flagged by AI: ${flagged}`}
          </li>
        </ul>
      )
    }

    return (
      <p className="mt-2 text-xs text-slate-600">
        {language === 'ar'
          ? 'لا توجد إحصائيات نشاط مخصصة لهذا الدور في بيانات الديمو.'
          : 'No specific activity metrics for this role in the demo dataset.'}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {language === 'ar' ? 'المستخدمون' : 'Users'}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {language === 'ar'
            ? 'دليل تجريبي لكل مستخدمي المنصّة عبر الأدوار والمنشآت، مع إمكانية تعديل البيانات للأغراض التوضيحية.'
            : 'Demo directory of all platform users across roles and organizations, with inline editing for showcase purposes.'}
        </p>
      </div>

      {selectedUser && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {language === 'ar' ? 'تعديل بيانات المستخدم' : 'Edit user profile'}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {language === 'ar'
                  ? 'أي تعديلات هنا تجريبية داخل المتصفح فقط ولا يتم حفظها في خادم حقيقي.'
                  : 'Changes here are demo-only and live only in the browser state (no real backend).'}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 text-xs">
            <label className="space-y-1">
              <span className="font-medium text-slate-700">
                {language === 'ar' ? 'الاسم' : 'Name'}
              </span>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </label>

            <label className="space-y-1">
              <span className="font-medium text-slate-700">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </span>
              <input
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </label>

            <label className="space-y-1">
              <span className="font-medium text-slate-700">
                {language === 'ar' ? 'الدور' : 'Role'}
              </span>
              <select
                value={editRole}
                onChange={e => setEditRole(e.target.value as Role)}
                className="w-full rounded-md border border-slate-300 px-2 py-1 bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="admin">Admin</option>
                <option value="org">Organization</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="supervisor">Supervisor</option>
                <option value="pharmacy_admin">Pharmacy admin</option>
              </select>
            </label>

            <label className="space-y-1">
              <span className="font-medium text-slate-700">
                {language === 'ar' ? 'المنشأة' : 'Organization'}
              </span>
              <select
                value={editOrgId}
                onChange={e => setEditOrgId(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1 bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">
                  {language === 'ar' ? 'بدون منشأة' : 'No organization'}
                </option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-900">
                {language === 'ar' ? 'ملخص النشاط في بيانات العرض' : 'Activity summary in demo data'}
              </div>
              {getUserActivitySummary()}
            </div>
            <Button size="sm" onClick={handleSave}>
              {language === 'ar' ? 'حفظ التغييرات' : 'Save changes'}
            </Button>
          </div>
        </Card>
      )}

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
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Actions
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
                  <td className="px-3 py-2 text-xs text-slate-600">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStartEdit(user.id)}
                    >
                      {language === 'ar' ? 'إدارة' : 'Manage'}
                    </Button>
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

export default AdminUsersPage
