import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useLanguage } from '../../context/LanguageContext'
import { Card } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'

function DoctorPatientsPage() {
  const { user } = useAuth()
  const { doctors, patients, visits, appointments } = useData()
  const { language } = useLanguage()

  const doctorProfile = useMemo(
    () => doctors.find(d => d.userId === user?.id),
    [doctors, user],
  )

  const myPatients = useMemo(() => {
    if (!doctorProfile) return []
    const ids = new Set<string>()

    visits.forEach(v => {
      if (v.doctorId === doctorProfile.id) ids.add(v.patientId)
    })
    appointments.forEach(a => {
      if (a.doctorId === doctorProfile.id) ids.add(a.patientId)
    })

    return patients.filter(p => ids.has(p.id))
  }, [doctorProfile, visits, appointments, patients])

  const getLastVisitDate = (patientId: string) => {
    const related = visits
      .filter(v => v.patientId === patientId && v.doctorId === doctorProfile?.id)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
    return related[0]?.date
  }

  const getNextAppointmentDate = (patientId: string) => {
    const upcoming = appointments
      .filter(a => a.patientId === patientId && a.doctorId === doctorProfile?.id && a.status === 'scheduled')
      .sort((a, b) => (a.datetime < b.datetime ? 1 : -1))
    return upcoming[0]?.datetime
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {language === 'ar' ? 'مرضاي' : 'My patients'}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {language === 'ar'
            ? 'استعرض ملفات المرضى المرتبطين بك من خلال الزيارات أو المواعيد التجريبية.'
            : 'Browse patient records linked to your demo visits and appointments.'}
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
                {language === 'ar' ? 'العمر' : 'Age'}
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {language === 'ar' ? 'آخر زيارة' : 'Last visit'}
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {language === 'ar' ? 'أقرب موعد' : 'Next appointment'}
              </th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {myPatients.map(p => {
              const lastVisit = getLastVisitDate(p.id)
              const nextAppt = getNextAppointmentDate(p.id)

              return (
                <tr key={p.id} className="hover:bg-slate-50 text-xs">
                  <td className="px-3 py-2 font-medium text-slate-900">{p.name}</td>
                  <td className="px-3 py-2 text-slate-600">{p.age}</td>
                  <td className="px-3 py-2 text-slate-600">
                    {lastVisit ? new Date(lastVisit).toLocaleDateString() : language === 'ar' ? 'لا يوجد' : 'None'}
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    {nextAppt
                      ? `${new Date(nextAppt).toLocaleDateString()} ${new Date(nextAppt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}`
                      : language === 'ar'
                      ? 'لا يوجد'
                      : 'None'}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      to={`/doctor/patients/${p.id}`}
                      className="text-teal-600 hover:text-teal-700 text-xs font-medium"
                    >
                      {language === 'ar' ? 'فتح الملف' : 'Open record'}
                    </Link>
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

export default DoctorPatientsPage
