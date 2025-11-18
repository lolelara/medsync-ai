import { useMemo, useState } from 'react'
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
  const [search, setSearch] = useState('')

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

  const filteredPatients = useMemo(() => {
    const term = search.trim().toLowerCase()
    let list = myPatients
    if (term) {
      list = list.filter(p => p.name.toLowerCase().includes(term))
    }

    return [...list].sort((a, b) => {
      const aLast = getLastVisitDate(a.id)
      const bLast = getLastVisitDate(b.id)
      if (!aLast && !bLast) return a.name.localeCompare(b.name)
      if (!aLast) return 1
      if (!bLast) return -1
      return aLast < bLast ? 1 : -1
    })
  }, [myPatients, search, visits, doctorProfile])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
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
        <div className="mt-1 md:mt-0">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-56 rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder={
              language === 'ar' ? 'بحث بالاسم...' : 'Search by name...'
            }
          />
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
            {filteredPatients.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-center text-xs text-slate-500"
                >
                  {search
                    ? language === 'ar'
                      ? 'لا يوجد مرضى مطابقون لبحثك.'
                      : 'No patients match your search.'
                    : language === 'ar'
                    ? 'لا توجد سجلات مرضى مرتبطة بهذا الطبيب في بيانات العرض بعد. عند حفظ روشتة تجريبية أو إنشاء موعد، سيظهر المرضى هنا.'
                    : 'There are no demo patient records linked to this doctor yet. When you save a demo prescription or create an appointment, patients will appear here.'}
                </td>
              </tr>
            ) : (
              filteredPatients.map(p => {
                const lastVisit = getLastVisitDate(p.id)
                const nextAppt = getNextAppointmentDate(p.id)

                return (
                  <tr key={p.id} className="hover:bg-slate-50 text-xs">
                    <td className="px-3 py-2 font-medium text-slate-900">{p.name}</td>
                    <td className="px-3 py-2 text-slate-600">{p.age}</td>
                    <td className="px-3 py-2 text-slate-600">
                      {lastVisit
                        ? new Date(lastVisit).toLocaleDateString()
                        : language === 'ar'
                        ? 'لا يوجد'
                        : 'None'}
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
              })
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}

export default DoctorPatientsPage
