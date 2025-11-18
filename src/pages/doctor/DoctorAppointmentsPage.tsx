import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useLanguage } from '../../context/LanguageContext'
import { Card } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'
import { Button } from '../../components/ui/Button'

function DoctorAppointmentsPage() {
  const { user } = useAuth()
  const { doctors, patients, appointments, updateAppointmentStatus, addNotification } = useData()
  const { language } = useLanguage()
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all')

  const doctorProfile = useMemo(
    () => doctors.find(d => d.userId === user?.id),
    [doctors, user],
  )

  const myAppointments = useMemo(
    () => {
      if (!doctorProfile) return []
      const base = appointments.filter(a => a.doctorId === doctorProfile.id)
      const filtered =
        statusFilter === 'all' ? base : base.filter(a => a.status === statusFilter)
      return filtered.sort((a, b) => (a.datetime < b.datetime ? -1 : 1))
    },
    [appointments, doctorProfile, statusFilter],
  )

  const getPatientName = (patientId: string) => patients.find(p => p.id === patientId)?.name ?? 'Unknown'

  const formatStatus = (status: string) => {
    if (language === 'ar') {
      if (status === 'scheduled') return 'مجدول'
      if (status === 'completed') return 'مكتمل'
      if (status === 'cancelled') return 'ملغى'
    }
    return status
  }

  const handleMarkCompleted = (id: string) => {
    updateAppointmentStatus(id, 'completed')
  }

  const handleCancel = (id: string) => {
    updateAppointmentStatus(id, 'cancelled')
  }

  const handleSendReminder = (appointmentId: string) => {
    if (!user) return
    const appointment = appointments.find(a => a.id === appointmentId)
    if (!appointment) return

    addNotification({
      id: `notif-${Date.now()}`,
      userId: user.id,
      title: language === 'ar' ? 'تذكير بالموعد (تجريبي)' : 'Appointment reminder (demo)',
      body:
        language === 'ar'
          ? `تذكير داخلي: موعد مع المريض ${getPatientName(appointment.patientId)} في ${new Date(
              appointment.datetime,
            ).toLocaleString()}.`
          : `Internal reminder: appointment with ${getPatientName(appointment.patientId)} at ${new Date(
              appointment.datetime,
            ).toLocaleString()}.`,
      createdAt: new Date().toISOString(),
      read: false,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {language === 'ar' ? 'مواعيدي' : 'My appointments'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'ar'
              ? 'إدارة المواعيد التجريبية للمرضى، مع إمكانية وضع حالة الموعد وإرسال تذكير داخلي.'
              : 'Manage demo patient appointments, set their status and trigger internal reminders.'}
          </p>
        </div>
        <div className="mt-1 md:mt-0">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | 'scheduled' | 'completed' | 'cancelled')}
            className="w-full md:w-48 rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">
              {language === 'ar' ? 'كل الحالات' : 'All statuses'}
            </option>
            <option value="scheduled">
              {language === 'ar' ? 'مجدول' : 'Scheduled'}
            </option>
            <option value="completed">
              {language === 'ar' ? 'مكتمل' : 'Completed'}
            </option>
            <option value="cancelled">
              {language === 'ar' ? 'ملغى' : 'Cancelled'}
            </option>
          </select>
        </div>
      </div>

      <Card className="p-4">
        <Table>
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {language === 'ar' ? 'المريض' : 'Patient'}
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {language === 'ar' ? 'التاريخ والوقت' : 'Date & time'}
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {language === 'ar' ? 'السبب' : 'Reason'}
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {language === 'ar' ? 'الحالة' : 'Status'}
              </th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-xs">
            {myAppointments.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-center text-xs text-slate-500"
                >
                  {statusFilter === 'all'
                    ? language === 'ar'
                      ? 'لا توجد مواعيد في بيانات العرض لهذا الطبيب بعد. عند حفظ روشتة تجريبية مع متابعة، يتم إنشاء موعد متابعة هنا تلقائيًا.'
                      : 'There are no demo appointments for this doctor yet. When you save a demo prescription with a follow-up, a follow-up appointment will appear here automatically.'
                    : language === 'ar'
                    ? 'لا توجد مواعيد بهذه الحالة حاليًا.'
                    : 'There are no appointments with this status at the moment.'}
                </td>
              </tr>
            ) : (
              myAppointments.map(a => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium text-slate-900">{getPatientName(a.patientId)}</td>
                  <td className="px-3 py-2 text-slate-600">{new Date(a.datetime).toLocaleString()}</td>
                  <td className="px-3 py-2 text-slate-600">{a.reason}</td>
                  <td className="px-3 py-2 text-slate-600 capitalize">{formatStatus(a.status)}</td>
                  <td className="px-3 py-2 text-right space-x-1 whitespace-nowrap">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSendReminder(a.id)}
                    >
                      {language === 'ar' ? 'تذكير' : 'Remind'}
                    </Button>
                    {a.status === 'scheduled' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleMarkCompleted(a.id)}
                        >
                          {language === 'ar' ? 'إنهاء' : 'Complete'}
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleCancel(a.id)}>
                          {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}

export default DoctorAppointmentsPage
