import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/ui/Card'
import { StatCard } from '../../components/ui/StatCard'
import { Table } from '../../components/ui/Table'
import { StatusPill } from '../../components/ui/StatusPill'
import { Button } from '../../components/ui/Button'
import { useEffect, useMemo, useState } from 'react'
import { Doctor, PrescriptionMedication } from '../../types'
import { useLanguage } from '../../context/LanguageContext'
import { checkDrugInteractions, getInteractingDrugNames } from '../../services/drugInteractionService'

function DoctorDashboard() {
  const { user } = useAuth()
  const { users, doctors, prescriptions, updatePrescriptionStatus } = useData()
  const { language } = useLanguage()

  const doctorProfile: Doctor | undefined = useMemo(
    () => doctors.find(d => d.userId === user?.id),
    [doctors, user]
  )

  const [draftDiagnosis, setDraftDiagnosis] = useState('')
  const [draftMedications, setDraftMedications] = useState<PrescriptionMedication[]>([
    { name: '', dosage: '', frequency: '', duration: '' },
  ])
  const [hasReviewedDraft, setHasReviewedDraft] = useState(false)

  const commonMedications = [
    'Lisinopril',
    'Aspirin',
    'Warfarin',
    'Amoxicillin',
    'Metformin',
    'Empagliflozin',
    'Sertraline',
    'Ibuprofen',
    'Paracetamol',
  ]

  const nonEmptyDraftMeds = draftMedications.filter(m => m.name.trim())
  const draftInteractions = nonEmptyDraftMeds.length
    ? checkDrugInteractions(nonEmptyDraftMeds)
    : []
  const draftInteractingNames = nonEmptyDraftMeds.length
    ? getInteractingDrugNames(nonEmptyDraftMeds)
    : []

  const handleDraftMedicationChange = (
    index: number,
    field: keyof PrescriptionMedication,
    value: string,
  ) => {
    setDraftMedications(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleAddDraftMedicationRow = () => {
    setDraftMedications(prev => [...prev, { name: '', dosage: '', frequency: '', duration: '' }])
  }

  const handleReviewDraft = () => {
    setHasReviewedDraft(true)
  }

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
        <h1 className="text-xl font-semibold text-slate-900">
          {language === 'ar' ? 'الوصفات الخاصة بي' : 'My prescription workspace'}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          {language === 'ar'
            ? 'أنشئ وصفة جديدة، راجع التداخلات الدوائية، ثم اطّلع على الوصفات الموجودة في قائمة الانتظار.'
            : 'Compose a new prescription, review potential interactions, then manage items in your queue.'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label={language === 'ar' ? 'بانتظار المراجعة' : 'Pending review'}
          value={pending.length}
        />
        <StatCard
          label={language === 'ar' ? 'معلّمة من الذكاء الاصطناعي' : 'Flagged by AI'}
          value={flagged.length}
          accent="amber"
        />
        <StatCard
          label={language === 'ar' ? 'معتمدة' : 'Approved'}
          value={approved.length}
          accent="teal"
        />
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              {language === 'ar' ? 'إنشاء وصفة جديدة' : 'Compose new prescription'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'ar'
                ? 'أدخل التشخيص ثم ابدأ بكتابة اسم الدواء لعرض اقتراحات تلقائية، ثم راجع التداخلات قبل الاعتماد.'
                : 'Enter a diagnosis, then start typing medication names to see suggestions and review interactions before finalizing.'}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <label className="block space-y-1">
            <span className="font-medium text-slate-700">
              {language === 'ar' ? 'التشخيص' : 'Diagnosis'}
            </span>
            <input
              value={draftDiagnosis}
              onChange={e => setDraftDiagnosis(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-2 py-1 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder={
                language === 'ar' ? 'مثال: ارتفاع ضغط الدم، التهاب الحلق...' : 'e.g. Hypertension, sore throat...'
              }
            />
          </label>

          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                {language === 'ar' ? 'الأدوية' : 'Medications'}
              </span>
              <Button variant="secondary" size="sm" onClick={handleAddDraftMedicationRow}>
                {language === 'ar' ? 'إضافة دواء' : 'Add medication'}
              </Button>
            </div>

            <div className="space-y-2">
              {draftMedications.map((m, index) => {
                const suggestions = m.name
                  ? commonMedications.filter(drug =>
                      drug.toLowerCase().startsWith(m.name.toLowerCase()),
                    )
                  : []

                const isInteracting =
                  m.name && draftInteractingNames.includes(m.name.toLowerCase())

                return (
                  <div key={index} className="border border-slate-200 rounded-md p-2 space-y-1">
                    <div className="grid gap-2 md:grid-cols-4">
                      <div className="relative md:col-span-2">
                        <input
                          value={m.name}
                          onChange={e => handleDraftMedicationChange(index, 'name', e.target.value)}
                          className={`w-full rounded-md border px-2 py-1 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                            isInteracting ? 'border-red-400 text-red-700' : 'border-slate-300'
                          }`}
                          placeholder={
                            language === 'ar'
                              ? 'اسم الدواء (ابدأ بالكتابة لعرض الاقتراحات)'
                              : 'Drug name (type to see suggestions)'
                          }
                        />
                        {suggestions.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-sm max-h-32 overflow-auto">
                            {suggestions.map(s => (
                              <button
                                key={s}
                                type="button"
                                className="block w-full px-2 py-1 text-left text-xs hover:bg-slate-50"
                                onClick={() => handleDraftMedicationChange(index, 'name', s)}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        value={m.dosage}
                        onChange={e => handleDraftMedicationChange(index, 'dosage', e.target.value)}
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder={language === 'ar' ? 'الجرعة' : 'Dosage'}
                      />
                      <input
                        value={m.frequency}
                        onChange={e => handleDraftMedicationChange(index, 'frequency', e.target.value)}
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder={language === 'ar' ? 'التكرار' : 'Frequency'}
                      />
                      <input
                        value={m.duration}
                        onChange={e => handleDraftMedicationChange(index, 'duration', e.target.value)}
                        className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        placeholder={language === 'ar' ? 'المدة' : 'Duration'}
                      />
                    </div>

                    {isInteracting && (
                      <p className="text-[11px] text-red-600">
                        {language === 'ar'
                          ? 'هذا الدواء جزء من تداخل دوائي محتمل وفقاً للقواعد التجريبية.'
                          : 'This medication participates in a potential interaction based on demo rules.'}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between mt-3">
              <Button size="sm" onClick={handleReviewDraft}>
                {language === 'ar' ? 'مراجعة التداخلات' : 'Review interactions'}
              </Button>
              {hasReviewedDraft && (
                <div className="text-xs">
                  {draftInteractions.length > 0 ? (
                    <p className="text-red-600">
                      {language === 'ar'
                        ? 'توجد تداخلات دوائية يجب مراجعتها قبل الاعتماد.'
                        : 'One or more potential drug interactions require review before signing.'}
                    </p>
                  ) : (
                    <p className="text-teal-700">
                      {language === 'ar'
                        ? 'لا توجد تداخلات دوائية كبيرة معروفة بين الأدوية المدرجة.'
                        : 'No major drug interactions detected between the listed medications.'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

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
                {language === 'ar' ? 'المريض' : 'Patient'}
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {language === 'ar' ? 'التشخيص' : 'Diagnosis'}
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {language === 'ar' ? 'ملخص الذكاء الاصطناعي' : 'AI summary'}
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {language === 'ar' ? 'الحالة' : 'Status'}
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {language === 'ar' ? 'الخطورة' : 'Risk'}
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
