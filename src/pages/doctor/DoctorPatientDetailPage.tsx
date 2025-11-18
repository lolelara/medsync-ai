import { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useLanguage } from '../../context/LanguageContext'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

function DoctorPatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { doctors, patients, visits, appointments, prescriptions, messages } = useData()
  const { language } = useLanguage()

  const doctorProfile = useMemo(
    () => doctors.find(d => d.userId === user?.id),
    [doctors, user],
  )

  const patient = useMemo(() => patients.find(p => p.id === id), [patients, id])

  const patientVisits = useMemo(
    () =>
      visits
        .filter(v => v.patientId === id && (!doctorProfile || v.doctorId === doctorProfile.id))
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [visits, id, doctorProfile],
  )

  const patientAppointments = useMemo(
    () =>
      appointments
        .filter(a => a.patientId === id && (!doctorProfile || a.doctorId === doctorProfile.id))
        .sort((a, b) => (a.datetime < b.datetime ? 1 : -1)),
    [appointments, id, doctorProfile],
  )

  const patientPrescriptions = useMemo(
    () =>
      patient
        ? prescriptions.filter(p => p.patientName.toLowerCase() === patient.name.toLowerCase())
        : [],
    [prescriptions, patient],
  )

  const patientMessages = useMemo(
    () =>
      messages
        .filter(m => m.patientId === id && (!doctorProfile || m.doctorId === doctorProfile.id))
        .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1)),
    [messages, id, doctorProfile],
  )

  if (!patient) {
    return (
      <div className="space-y-4">
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          {language === 'ar' ? 'رجوع' : 'Back'}
        </Button>
        <div className="text-sm text-slate-600">
          {language === 'ar' ? 'لم يتم العثور على المريض في بيانات العرض.' : 'Patient not found in demo dataset.'}
        </div>
      </div>
    )
  }

  const lastDiagnosis = patientVisits[0]?.diagnosis ?? patientPrescriptions[0]?.diagnosis

  const aiSummary = useMemo(() => {
    if (!patient) return ''
    const visitCount = patientVisits.length
    const rxCount = patientPrescriptions.length
    const apptCount = patientAppointments.length
    const lastVisitDate = patientVisits[0]?.date
    const upcomingAppt = patientAppointments.find(a => a.status === 'scheduled')?.datetime

    if (language === 'ar') {
      const parts: string[] = []
      parts.push('هذا ملخص تجريبي تم توليده آليًا من بيانات العرض لهذا المريض.')
      parts.push(`الاسم: ${patient.name}.`)
      parts.push(`عدد الزيارات المسجلة: ${visitCount}.`)
      parts.push(`عدد الوصفات: ${rxCount}.`)
      parts.push(`عدد المواعيد الكلي: ${apptCount}.`)
      if (lastDiagnosis) {
        parts.push(`آخر تشخيص مسجل: ${lastDiagnosis}.`)
      }
      if (lastVisitDate) {
        parts.push(`آخر زيارة تقريبية في: ${new Date(lastVisitDate).toLocaleDateString()}.`)
      }
      if (upcomingAppt) {
        parts.push(
          `أقرب موعد متابعة مجدول تقريبًا في: ${new Date(upcomingAppt).toLocaleString()}.`,
        )
      }
      parts.push('هذا النص لأغراض العرض فقط ولا يمثل استشارة طبية حقيقية أو توصية علاجية.')
      return parts.join(' ')
    }

    const parts: string[] = []
    parts.push('This is a demo-only AI-style summary generated from the mock record for this patient.')
    parts.push(`Name: ${patient.name}.`)
    parts.push(`Number of recorded visits: ${visitCount}.`)
    parts.push(`Number of prescriptions: ${rxCount}.`)
    parts.push(`Total appointments: ${apptCount}.`)
    if (lastDiagnosis) {
      parts.push(`Most recent recorded diagnosis: ${lastDiagnosis}.`)
    }
    if (lastVisitDate) {
      parts.push(`Most recent visit around: ${new Date(lastVisitDate).toLocaleDateString()}.`)
    }
    if (upcomingAppt) {
      parts.push(
        `Nearest scheduled follow-up is around: ${new Date(upcomingAppt).toLocaleString()}.`,
      )
    }
    parts.push(
      'This narrative is for demonstration purposes only and does not constitute real medical advice.',
    )
    return parts.join(' ')
  }, [language, patient, patientVisits, patientPrescriptions, patientAppointments, lastDiagnosis])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {language === 'ar' ? `الملف الطبي لـ ${patient.name}` : `Record for ${patient.name}`}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'ar'
              ? 'هذا عرض تجريبي لملف المريض يشمل الزيارات والوصفات والمواعيد والدردشة.'
              : 'Demo view of the patient record including visits, prescriptions, appointments and messaging.'}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          {language === 'ar' ? 'رجوع إلى القائمة' : 'Back to list'}
        </Button>
      </div>

      {aiSummary && (
        <Card className="p-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {language === 'ar' ? 'ملخص AI (تجريبي)' : 'AI-style summary (demo)'}
          </div>
          <p className="text-xs text-slate-700 whitespace-pre-line">{aiSummary}</p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">
        <Card className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {language === 'ar' ? 'بيانات المريض' : 'Patient details'}
              </div>
              <div className="mt-1 text-sm text-slate-900">{patient.name}</div>
              <div className="text-xs text-slate-600">
                {language === 'ar' ? 'العمر: ' : 'Age: '}
                {patient.age}
              </div>
              {patient.notes && <div className="mt-1 text-xs text-slate-600">{patient.notes}</div>}
            </div>
            <div className="text-xs text-slate-500 text-right space-y-1">
              {patient.phone && <div>{patient.phone}</div>}
              {patient.email && <div>{patient.email}</div>}
              {lastDiagnosis && (
                <div>
                  <span className="font-semibold">
                    {language === 'ar' ? 'آخر تشخيص: ' : 'Last diagnosis: '}
                  </span>
                  {lastDiagnosis}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              {language === 'ar' ? 'الزيارات' : 'Visits'}
            </div>
            {patientVisits.length === 0 ? (
              <div className="text-xs text-slate-500">
                {language === 'ar' ? 'لا توجد زيارات في بيانات العرض.' : 'No visits found in demo data.'}
              </div>
            ) : (
              <ul className="space-y-2 text-xs text-slate-700">
                {patientVisits.map(v => (
                  <li key={v.id} className="border border-slate-200 rounded-md p-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-slate-900">
                        {new Date(v.date).toLocaleString()}
                      </div>
                      {v.prescriptionId && (
                        <Link
                          to={`/doctor/prescriptions/${v.prescriptionId}`}
                          className="text-teal-600 hover:text-teal-700 text-[11px] font-medium"
                        >
                          {language === 'ar' ? 'فتح الوصفة' : 'Open prescription'}
                        </Link>
                      )}
                    </div>
                    <div className="mt-1 text-slate-700">
                      {language === 'ar' ? 'السبب: ' : 'Reason: '}
                      {v.reason}
                    </div>
                    <div className="text-slate-700">
                      {language === 'ar' ? 'التشخيص: ' : 'Diagnosis: '}
                      {v.diagnosis}
                    </div>
                    {v.notes && <div className="text-slate-600 mt-1">{v.notes}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              {language === 'ar' ? 'المواعيد' : 'Appointments'}
            </div>
            {patientAppointments.length === 0 ? (
              <div className="text-xs text-slate-500">
                {language === 'ar' ? 'لا توجد مواعيد مسجلة.' : 'No appointments scheduled.'}
              </div>
            ) : (
              <ul className="space-y-2 text-xs text-slate-700">
                {patientAppointments.map(a => (
                  <li key={a.id} className="border border-slate-200 rounded-md p-2 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900">
                        {new Date(a.datetime).toLocaleString()}
                      </div>
                      <div className="text-slate-700">{a.reason}</div>
                    </div>
                    <div className="text-[11px] text-slate-500 capitalize">{a.status}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              {language === 'ar' ? 'الوصفات' : 'Prescriptions'}
            </div>
            {patientPrescriptions.length === 0 ? (
              <div className="text-xs text-slate-500">
                {language === 'ar'
                  ? 'لا توجد وصفات مرتبطة بالاسم في بيانات العرض.'
                  : 'No prescriptions linked by name in demo data.'}
              </div>
            ) : (
              <ul className="space-y-2 text-xs text-slate-700">
                {patientPrescriptions.map(p => (
                  <li key={p.id} className="border border-slate-200 rounded-md p-2 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900">{p.diagnosis}</div>
                      <div className="text-slate-600">
                        {new Date(p.createdAt).toLocaleDateString()} · {p.medications.length}{' '}
                        {language === 'ar' ? 'دواء' : 'meds'}
                      </div>
                    </div>
                    <Link
                      to={`/doctor/prescriptions/${p.id}`}
                      className="text-teal-600 hover:text-teal-700 text-[11px] font-medium"
                    >
                      {language === 'ar' ? 'عرض التفاصيل' : 'View details'}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              {language === 'ar' ? 'الدردشة (تجريبية)' : 'Messaging (demo)'}
            </div>
            {patientMessages.length === 0 ? (
              <div className="text-xs text-slate-500">
                {language === 'ar'
                  ? 'لا توجد رسائل في هذا العرض، لكن يمكن استخدام هذا القسم كنموذج لدردشة آمنة.'
                  : 'No messages in this demo, but this section illustrates a secure chat concept.'}
              </div>
            ) : (
              <ul className="space-y-1 text-[11px] text-slate-700 max-h-40 overflow-auto">
                {patientMessages.map(m => (
                  <li key={m.id} className="flex gap-2">
                    <span className="font-semibold text-slate-600">
                      {m.from === 'doctor'
                        ? language === 'ar'
                          ? 'الطبيب:'
                          : 'Doctor:'
                        : language === 'ar'
                        ? 'المريض:'
                        : 'Patient:'}
                    </span>
                    <span>{m.content}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DoctorPatientDetailPage
