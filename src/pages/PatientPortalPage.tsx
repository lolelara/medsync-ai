import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext'
import { useLanguage } from '../context/LanguageContext'
import { Card } from '../components/ui/Card'
import { Table } from '../components/ui/Table'
import { Button } from '../components/ui/Button'

function PatientPortalPage() {
  const { patients, visits, appointments, prescriptions, messages, addMessage } = useData()
  const { language } = useLanguage()

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id ?? '')
  const [newMessage, setNewMessage] = useState('')

  const selectedPatient = useMemo(
    () => patients.find(p => p.id === selectedPatientId) ?? null,
    [patients, selectedPatientId],
  )

  const patientVisits = useMemo(
    () =>
      visits
        .filter(v => v.patientId === selectedPatientId)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [visits, selectedPatientId],
  )

  const patientAppointments = useMemo(
    () =>
      appointments
        .filter(a => a.patientId === selectedPatientId)
        .sort((a, b) => (a.datetime < b.datetime ? 1 : -1)),
    [appointments, selectedPatientId],
  )

  const patientPrescriptions = useMemo(
    () => {
      if (!selectedPatient) return []
      return prescriptions
        .filter(p => p.patientName.toLowerCase() === selectedPatient.name.toLowerCase())
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    },
    [prescriptions, selectedPatient],
  )

  const patientMessages = useMemo(
    () =>
      messages
        .filter(m => m.patientId === selectedPatientId)
        .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1)),
    [messages, selectedPatientId],
  )

  const primaryDoctorId = useMemo(() => {
    if (patientVisits[0]?.doctorId) return patientVisits[0].doctorId
    const upcoming = patientAppointments.find(a => a.status === 'scheduled')
    if (upcoming?.doctorId) return upcoming.doctorId
    return 'doc-1'
  }, [patientVisits, patientAppointments])

  const handleSendMessage = () => {
    if (!selectedPatientId || !newMessage.trim()) return

    const now = new Date().toISOString()
    addMessage({
      id: `msg-${Date.now()}`,
      patientId: selectedPatientId,
      doctorId: primaryDoctorId,
      from: 'patient',
      content: newMessage.trim(),
      createdAt: now,
    })
    setNewMessage('')
  }

  const lastVisit = patientVisits[0]
  const nextAppointment = patientAppointments.find(a => a.status === 'scheduled')
  const latestPrescription = patientPrescriptions[0]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {language === 'ar' ? 'بوابة المريض (عرض تجريبي)' : 'Patient portal (demo)'}
            </h1>
            <p className="mt-1 text-xs text-slate-500 max-w-xl">
              {language === 'ar'
                ? 'هذه واجهة تجريبية فقط توضح كيف يمكن للمريض الاطلاع على مواعيده ووصفاته وتعليماته ورسائله. لا توجد بيانات حقيقية، وكل شيء يعمل من المتصفح فقط.'
                : 'Demo-only view showing how a patient could see appointments, prescriptions, instructions and messages. No real data, everything lives in the browser for the demo.'}
            </p>
          </div>
        </header>

        <Card className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs">
            <label className="flex-1 space-y-1">
              <span className="font-medium text-slate-700">
                {language === 'ar' ? 'اختر مريضاً تجريبياً' : 'Select a demo patient'}
              </span>
              <select
                value={selectedPatientId}
                onChange={e => setSelectedPatientId(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1 bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">
                  {language === 'ar' ? 'اختر مريضاً…' : 'Choose a patient…'}
                </option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.age})
                  </option>
                ))}
              </select>
            </label>
            <p className="md:w-64 text-[11px] text-slate-500">
              {language === 'ar'
                ? 'عند اختيار مريض، سيتم ملء هذه الصفحة ببيانات الزيارات والوصفات والمواعيد التجريبية الخاصة به.'
                : 'Once you pick a patient, this page will populate with their demo visits, prescriptions and appointments.'}
            </p>
          </div>
        </Card>

        {!selectedPatient ? (
          <div className="text-xs text-slate-600">
            {language === 'ar'
              ? 'لم يتم اختيار مريض بعد.'
              : 'No patient selected yet.'}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
            <div className="space-y-4">
              <Card className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {language === 'ar' ? 'الملخص' : 'Summary'}
                    </div>
                    <div className="mt-1 text-sm font-medium text-slate-900">{selectedPatient.name}</div>
                    <div className="text-xs text-slate-600">
                      {language === 'ar' ? 'العمر: ' : 'Age: '}
                      {selectedPatient.age}
                    </div>
                    {selectedPatient.notes && (
                      <div className="mt-1 text-[11px] text-slate-600">{selectedPatient.notes}</div>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 text-[11px] mt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      {language === 'ar' ? 'آخر زيارة:' : 'Last visit:'}
                    </span>
                    <span className="text-slate-700">
                      {lastVisit
                        ? new Date(lastVisit.date).toLocaleString()
                        : language === 'ar'
                        ? 'لا يوجد في بيانات العرض'
                        : 'None in demo data'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      {language === 'ar' ? 'أقرب موعد قادم:' : 'Next upcoming appointment:'}
                    </span>
                    <span className="text-slate-700">
                      {nextAppointment
                        ? new Date(nextAppointment.datetime).toLocaleString()
                        : language === 'ar'
                        ? 'لا يوجد موعد مجدول في العرض'
                        : 'No scheduled appointment in demo'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      {language === 'ar' ? 'آخر تشخيص مسجّل:' : 'Latest recorded diagnosis:'}
                    </span>
                    <span className="text-slate-700">
                      {latestPrescription?.diagnosis
                        ? latestPrescription.diagnosis
                        : language === 'ar'
                        ? 'لا يوجد تشخيص مسجّل في بيانات العرض'
                        : 'No diagnosis recorded in demo data'}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-[10px] text-slate-400">
                  {language === 'ar'
                    ? 'هذه صفحة عرض فقط لتوضيح تجربة المريض، ولا تُستخدم لاتخاذ قرارات طبية حقيقية.'
                    : 'This page is for demonstration only and must not be used for real medical decisions.'}
                </p>
              </Card>

              <Card className="p-4">
                <div className="mb-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {language === 'ar' ? 'المواعيد' : 'Appointments'}
                  </div>
                </div>
                <Table>
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {language === 'ar' ? 'التاريخ والوقت' : 'Date & time'}
                      </th>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {language === 'ar' ? 'الحالة' : 'Status'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-[11px]">
                    {patientAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-3 py-4 text-center text-slate-500">
                          {language === 'ar'
                            ? 'لا توجد مواعيد مسجلة لهذا المريض في بيانات العرض.'
                            : 'No appointments recorded for this patient in the demo data.'}
                        </td>
                      </tr>
                    ) : (
                      patientAppointments.map(a => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2 text-slate-700">
                            {new Date(a.datetime).toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-slate-600 capitalize">{a.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {language === 'ar' ? 'الوصفات الطبية' : 'Prescriptions'}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {language === 'ar'
                        ? 'عرض تجريبي للوصفات المرتبطة باسم المريض، مع تعليمات مبسطة إن وُجدت.'
                        : 'Demo view of prescriptions linked to this patient name, with simplified instructions where available.'}
                    </p>
                  </div>
                </div>
                <Table>
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {language === 'ar' ? 'التاريخ' : 'Date'}
                      </th>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {language === 'ar' ? 'التشخيص' : 'Diagnosis'}
                      </th>
                      <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {language === 'ar' ? 'عدد الأدوية' : 'Meds'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-[11px]">
                    {patientPrescriptions.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-3 py-4 text-center text-slate-500">
                          {language === 'ar'
                            ? 'لا توجد وصفات مرتبطة باسم هذا المريض في بيانات العرض.'
                            : 'No prescriptions linked to this patient name in the demo data.'}
                        </td>
                      </tr>
                    ) : (
                      patientPrescriptions.map(p => {
                        const instructions =
                          language === 'ar'
                            ? p.patientInstructionsAr || p.patientInstructionsEn
                            : p.patientInstructionsEn || p.patientInstructionsAr
                        return (
                          <tr key={p.id} className="hover:bg-slate-50 align-top">
                            <td className="px-3 py-2 text-slate-700">
                              {new Date(p.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-2 text-slate-700">
                              <div className="font-medium text-slate-900">{p.diagnosis}</div>
                              {instructions && (
                                <div className="mt-1 text-[10px] text-slate-600 line-clamp-3">
                                  {instructions}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2 text-slate-600">
                              {p.medications.length}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </Table>
              </Card>

              <Card className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {language === 'ar' ? 'الرسائل (تجريبية)' : 'Messages (demo)'}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {language === 'ar'
                        ? 'يمكنك إرسال رسالة تجريبية إلى طبيبك، ولن يتم إرسال أي بيانات حقيقية.'
                        : 'You can send a demo message to your doctor; nothing is sent outside this browser.'}
                    </p>
                  </div>
                </div>
                <div className="max-h-40 overflow-auto space-y-1 text-[11px] text-slate-700 border border-slate-100 rounded-md p-2">
                  {patientMessages.length === 0 ? (
                    <div className="text-slate-500">
                      {language === 'ar'
                        ? 'لا توجد رسائل في هذا العرض. أرسل رسالة لتجربة السلوك.'
                        : 'No messages yet in this demo. Send a message to see how it behaves.'}
                    </div>
                  ) : (
                    patientMessages.map(m => (
                      <div key={m.id} className="flex gap-2">
                        <span className="font-semibold text-slate-600">
                          {m.from === 'doctor'
                            ? language === 'ar'
                              ? 'الطبيب:'
                              : 'Doctor:'
                            : language === 'ar'
                            ? 'أنا:'
                            : 'Me:'}
                        </span>
                        <span>{m.content}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="space-y-2 text-[11px]">
                  <textarea
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    rows={2}
                    className="w-full rounded-md border border-slate-300 px-2 py-1 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder={
                      language === 'ar'
                        ? 'اكتب رسالة قصيرة لطبيبك (تجريبي فقط)...'
                        : 'Write a short message to your doctor (demo only)...'
                    }
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      {language === 'ar' ? 'إرسال رسالة تجريبية' : 'Send demo message'}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientPortalPage
