import { useMemo } from 'react'
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

  const doctorProfile = useMemo(
    () => doctors.find(d => d.userId === user?.id),
    [doctors, user],
  )

  const myAppointments = useMemo(
    () =>
      appointments
        .filter(a => (!doctorProfile ? false : a.doctorId === doctorProfile.id))
        .sort((a, b) => (a.datetime < b.datetime ? -1 : 1)),
    [appointments, doctorProfile],
  )

  const getPatientName = (patientId: string) => patients.find(p => p.id === patientId)?.name ?? 'Unknown'

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
            {myAppointments.map(a => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 font-medium text-slate-900">{getPatientName(a.patientId)}</td>
                <td className="px-3 py-2 text-slate-600">{new Date(a.datetime).toLocaleString()}</td>
                <td className="px-3 py-2 text-slate-600">{a.reason}</td>
                <td className="px-3 py-2 text-slate-600 capitalize">{a.status}</td>
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
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}

export default DoctorAppointmentsPage
