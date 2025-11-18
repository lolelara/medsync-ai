import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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

const prescriptionTemplates: {
  key: string
  labelEn: string
  labelAr: string
  diagnosisEn: string
  diagnosisAr: string
  medications: PrescriptionMedication[]
  instructionsEn: string
  instructionsAr: string
  followUpDays: number
}[] = [
  {
    key: 'htn-standard',
    labelEn: 'Hypertension - standard (ACEi + lifestyle)',
    labelAr: 'ارتفاع ضغط الدم - خطة قياسية (ACEi + نمط حياة)',
    diagnosisEn:
      'Hypertension, suboptimally controlled in this demo scenario. No red-flag symptoms reported.',
    diagnosisAr:
      'ارتفاع ضغط الدم غير مضبوط بشكل كافٍ في هذا السيناريو التجريبي، بدون أعراض إنذار حمراء.',
    medications: [
      { name: 'Lisinopril', dosage: '10 mg', frequency: 'once daily', duration: '3 months' },
    ],
    instructionsEn:
      'Take the tablet at the same time every day. Do not stop suddenly without medical advice. Monitor your blood pressure at home if possible. This is demo text only.',
    instructionsAr:
      'تناول القرص في نفس الوقت يوميًا. لا توقف الدواء بشكل مفاجئ دون استشارة طبية. راقب ضغط الدم في المنزل إن أمكن. هذا نص تجريبي فقط.',
    followUpDays: 30,
  },
  {
    key: 't2dm-metformin',
    labelEn: 'Type 2 diabetes – Metformin start',
    labelAr: 'سكري نمط 2 – بداية ميتفورمين',
    diagnosisEn:
      'Type 2 diabetes mellitus with suboptimal glycemic control in this demo scenario.',
    diagnosisAr: 'داء السكري من النمط الثاني مع ضبط غير مثالي للسكر في هذا العرض التجريبي.',
    medications: [
      {
        name: 'Metformin',
        dosage: '500 mg',
        frequency: 'twice daily with meals',
        duration: '3 months',
      },
    ],
    instructionsEn:
      'Take Metformin with or after food to reduce stomach upset. Drink water regularly. Demo text only.',
    instructionsAr:
      'تناول الميتفورمين مع الطعام أو بعده لتقليل اضطراب المعدة. اشرب ماءً بانتظام. هذا نص تجريبي فقط.',
    followUpDays: 90,
  },
  {
    key: 'uri-amoxicillin',
    labelEn: 'Upper respiratory infection – simple',
    labelAr: 'عدوى تنفسية علوية بسيطة',
    diagnosisEn:
      'Uncomplicated upper respiratory tract infection in this demo scenario, no red flags reported.',
    diagnosisAr:
      'عدوى بسيطة في الجهاز التنفسي العلوي في هذا السيناريو التجريبي، دون وجود علامات خطورة.',
    medications: [
      { name: 'Amoxicillin', dosage: '500 mg', frequency: 'three times daily', duration: '7 days' },
      {
        name: 'Paracetamol',
        dosage: '500 mg',
        frequency: 'every 6–8 hours as needed',
        duration: '5 days',
      },
    ],
    instructionsEn:
      'Complete the full antibiotic course even if you feel better. Use Paracetamol only as needed for fever or pain. Demo instructions only.',
    instructionsAr:
      'أكمل كورس المضاد الحيوي بالكامل حتى لو شعرت بتحسن. استخدم الباراسيتامول فقط عند الحاجة للحمّى أو الألم. هذه تعليمات تجريبية فقط.',
    followUpDays: 7,
  },
  {
    key: 'af-warfarin-aspirin',
    labelEn: 'Atrial fibrillation – Warfarin + Aspirin (high bleeding risk demo)',
    labelAr: 'رجفان أذيني – وارفارين + أسبرين (خطر نزيف مرتفع تجريبياً)',
    diagnosisEn:
      'Atrial fibrillation with dual antithrombotic therapy in this demo scenario. Bleeding risk must be carefully reviewed.',
    diagnosisAr:
      'رجفان أذيني مع علاج مضاد للتخثر مزدوج في هذا السيناريو التجريبي، ويجب مراجعة خطر النزيف بعناية.',
    medications: [
      { name: 'Warfarin', dosage: '5 mg', frequency: 'once daily', duration: '30 days' },
      { name: 'Aspirin', dosage: '81 mg', frequency: 'once daily', duration: '30 days' },
    ],
    instructionsEn:
      'Demo-only: avoid over-the-counter painkillers containing Ibuprofen or similar drugs. Watch for bleeding (black stools, nosebleeds, unusual bruising) and seek urgent care if they occur.',
    instructionsAr:
      'عرض تجريبي: تجنب المسكنات المتاحة بدون وصفة التي تحتوي على إيبوبروفين أو أدوية مشابهة. انتبه لعلامات النزيف مثل البراز الأسود أو نزيف الأنف أو الكدمات غير المعتادة واطلب رعاية عاجلة إذا ظهرت.',
    followUpDays: 14,
  },
  {
    key: 'ckd-ibuprofen-risk',
    labelEn: 'CKD stage 3 – Ibuprofen risk + kidney-friendly advice',
    labelAr: 'مرض كلوي مزمن مرحلة 3 – خطورة الإيبوبروفين + نصائح للكلى',
    diagnosisEn:
      'Chronic kidney disease stage 3 with recent NSAID use in this demo scenario. Renal function may be at risk.',
    diagnosisAr:
      'مرض كلوي مزمن مرحلة 3 مع استخدام حديث لمضادات الالتهاب غير الستيرويدية في هذا السيناريو التجريبي، مع احتمال تأثر وظائف الكلى.',
    medications: [
      { name: 'Ibuprofen', dosage: '400 mg', frequency: 'three times daily', duration: '10 days' },
      { name: 'Metformin', dosage: '500 mg', frequency: 'twice daily with meals', duration: '90 days' },
    ],
    instructionsEn:
      'Demo-only: prefer kidney-friendly pain strategies (paracetamol within safe limits, non-drug measures) and limit salt intake. Drink water regularly unless advised otherwise and report ankle swelling or reduced urine.',
    instructionsAr:
      'عرض تجريبي: يُفضّل استراتيجيات مسكنة أكثر أماناً على الكلى (مثل الباراسيتامول ضمن الحدود الآمنة مع وسائل غير دوائية) وتقليل الملح في الطعام. اشرب الماء بانتظام ما لم يُنصح بغير ذلك، وأبلغ عن تورم الكاحلين أو نقص كمية البول.',
    followUpDays: 7,
  },
]

function DoctorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    users,
    doctors,
    prescriptions,
    updatePrescriptionStatus,
    patients,
    visits,
    appointments,
    addPrescription,
    addVisit,
    addAppointment,
  } = useData()
  const { language } = useLanguage()

  const doctorProfile: Doctor | undefined = useMemo(
    () => doctors.find(d => d.userId === user?.id),
    [doctors, user]
  )

  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('')
  const [draftDiagnosis, setDraftDiagnosis] = useState('')
  const [draftMedications, setDraftMedications] = useState<PrescriptionMedication[]>([
    { name: '', dosage: '', frequency: '', duration: '' },
  ])
  const [hasReviewedDraft, setHasReviewedDraft] = useState(false)
  const [draftInstructions, setDraftInstructions] = useState('')
  const [followUpDays, setFollowUpDays] = useState(30)
  const [aiSymptoms, setAiSymptoms] = useState('')
  const [aiSuggestedDiagnosis, setAiSuggestedDiagnosis] = useState('')
  const [aiSuggestedTemplateKey, setAiSuggestedTemplateKey] = useState<string | null>(null)
  const [aiExplanation, setAiExplanation] = useState('')

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

  const selectedPatient = useMemo(
    () => patients.find(p => p.id === selectedPatientId) ?? null,
    [patients, selectedPatientId]
  )

  const sidebarPatients = useMemo(() => {
    if (!doctorProfile) return patients

    const ids = new Set<string>()
    visits.forEach(v => {
      if (v.doctorId === doctorProfile.id) ids.add(v.patientId)
    })
    appointments.forEach(a => {
      if (a.doctorId === doctorProfile.id) ids.add(a.patientId)
    })

    if (ids.size === 0) return patients
    return patients.filter(p => ids.has(p.id))
  }, [doctorProfile, visits, appointments, patients])

  const getLastVisitForSidebar = (patientId: string) => {
    const related = visits
      .filter(v => v.patientId === patientId && (!doctorProfile || v.doctorId === doctorProfile.id))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
    return related[0]?.date
  }

  const getNextAppointmentForSidebar = (patientId: string) => {
    const upcoming = appointments
      .filter(
        a =>
          a.patientId === patientId &&
          a.status === 'scheduled' &&
          (!doctorProfile || a.doctorId === doctorProfile.id),
      )
      .sort((a, b) => (a.datetime < b.datetime ? 1 : -1))
    return upcoming[0]?.datetime
  }

  useEffect(() => {
    const fromSearch = searchParams.get('patientId')
    if (fromSearch) {
      setSelectedPatientId(fromSearch)
    }
  }, [searchParams])

  useEffect(() => {
    if (!selectedPatientId) return

    const hasAnyContent =
      draftDiagnosis.trim().length > 0 ||
      draftMedications.some(m => m.name || m.dosage || m.frequency || m.duration)

    if (hasAnyContent) return

    let demoTemplateKey: string | null = null
    if (selectedPatientId === 'patient-2') {
      demoTemplateKey = 'af-warfarin-aspirin'
    } else if (selectedPatientId === 'patient-6') {
      demoTemplateKey = 'ckd-ibuprofen-risk'
    } else if (selectedPatientId === 'patient-1') {
      demoTemplateKey = 'htn-standard'
    } else if (selectedPatientId === 'patient-4') {
      demoTemplateKey = 't2dm-metformin'
    }

    if (demoTemplateKey) {
      handleTemplateSelect(demoTemplateKey)
    }
  }, [selectedPatientId, draftDiagnosis, draftMedications])

  const nonEmptyDraftMeds = draftMedications.filter(m => m.name.trim())
  const draftInteractions = nonEmptyDraftMeds.length
    ? checkDrugInteractions(nonEmptyDraftMeds)
    : []
  const draftInteractingNames = nonEmptyDraftMeds.length
    ? getInteractingDrugNames(nonEmptyDraftMeds)
    : []

  const isDraftReady = !!selectedPatient && !!draftDiagnosis.trim() && nonEmptyDraftMeds.length > 0

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

  const handleTemplateSelect = (key: string) => {
    setSelectedTemplateKey(key)
    if (!key) return
    const template = prescriptionTemplates.find(t => t.key === key)
    if (!template) return
    const isAr = language === 'ar'
    setDraftDiagnosis(isAr ? template.diagnosisAr : template.diagnosisEn)
    setDraftMedications(template.medications.map(m => ({ ...m })))
    setDraftInstructions(isAr ? template.instructionsAr : template.instructionsEn)
    setFollowUpDays(template.followUpDays)
    setHasReviewedDraft(false)
  }

  const runDemoAiAssist = () => {
    const text = aiSymptoms.trim().toLowerCase()
    if (!text) {
      setAiSuggestedDiagnosis('')
      setAiSuggestedTemplateKey(null)
      setAiExplanation('')
      return
    }

    let templateKey: string | null = null
    let explanationEn = ''
    let explanationAr = ''

    if (text.includes('pressure') || text.includes('bp') || text.includes('ضغط')) {
      templateKey = 'htn-standard'
      explanationEn =
        'Demo AI suggests a hypertension-focused plan based on blood pressure-related symptoms and risk factors.'
      explanationAr =
        'الذكاء الاصطناعي التجريبي يقترح خطة موجهة لارتفاع ضغط الدم بناءً على الأعراض والعوامل المرتبطة بالضغط.'
    } else if (
      text.includes('diabetes') ||
      text.includes('sugar') ||
      text.includes('thirst') ||
      text.includes('سكر')
    ) {
      templateKey = 't2dm-metformin'
      explanationEn =
        'Demo AI suggests a type 2 diabetes plan with Metformin based on glycemic-control related symptoms.'
      explanationAr =
        'الذكاء الاصطناعي التجريبي يقترح خطة لسكري النمط الثاني مع ميتفورمين بالاستناد إلى الأعراض المرتبطة بارتفاع السكر.'
    } else if (
      text.includes('cough') ||
      text.includes('throat') ||
      text.includes('runny nose') ||
      text.includes('برد') ||
      text.includes('كحة') ||
      text.includes('التهاب الحلق')
    ) {
      templateKey = 'uri-amoxicillin'
      explanationEn =
        'Demo AI suggests an uncomplicated upper respiratory infection pattern based on cough and sore-throat features.'
      explanationAr =
        'الذكاء الاصطناعي التجريبي يقترح نمط عدوى تنفسية علوية بسيطة بناءً على الكحة وأعراض التهاب الحلق.'
    } else {
      explanationEn =
        'Demo AI could not confidently map the symptoms to a single pattern. Use clinical judgment and edit the prescription manually.'
      explanationAr =
        'لم يتمكن الذكاء الاصطناعي التجريبي من ربط الأعراض بنمط واحد بشكل كافٍ. يُرجى الاعتماد على التقييم السريري وتعديل الوصفة يدويًا.'
    }

    let diagnosisEn = 'Non-specific demo diagnosis suggestion based on entered symptoms.'
    let diagnosisAr = 'اقتراح تشخيص تجريبي غير محدد يعتمد على الأعراض المدخلة.'

    if (templateKey) {
      const template = prescriptionTemplates.find(t => t.key === templateKey)
      if (template) {
        diagnosisEn = template.diagnosisEn
        diagnosisAr = template.diagnosisAr
      }
    }

    const isAr = language === 'ar'
    setAiSuggestedDiagnosis(isAr ? diagnosisAr : diagnosisEn)
    setAiExplanation(isAr ? explanationAr : explanationEn)
    setAiSuggestedTemplateKey(templateKey)
  }

  const handleSaveDraftAsDemo = () => {
    if (!doctorProfile || !selectedPatient) return
    const nonEmpty = nonEmptyDraftMeds
    if (nonEmpty.length === 0 || !draftDiagnosis) return

    const now = new Date()
    const nowIso = now.toISOString()
    const newRxId = `rx-${now.getTime()}`
    const doctorUser = users.find(u => u.id === doctorProfile.userId)
    const organizationId = doctorUser?.organizationId ?? 'org-1'

    addPrescription({
      id: newRxId,
      patientName: selectedPatient.name,
      age: selectedPatient.age,
      diagnosis: draftDiagnosis,
      medications: nonEmpty,
      status: 'pending',
      assignedDoctorId: doctorProfile.id,
      organizationId,
      aiReviewSummary:
        language === 'ar'
          ? 'ملخص تجريبي تم إنشاؤه لأغراض العرض فقط.'
          : 'Demo-only AI summary generated for presentation purposes.',
      aiRiskScore: draftInteractions.length > 0 ? 0.7 : 0.2,
      aiFlags:
        draftInteractions.length > 0
          ? draftInteractions.map(i => i.messageEn)
          : [
              language === 'ar'
                ? 'لا توجد علامات خطورة رئيسية في هذه الوصفة وفقاً للقواعد التجريبية.'
                : 'No major risk flags detected by demo rules.',
            ],
      createdAt: nowIso,
      updatedAt: nowIso,
      patientInstructionsEn: language === 'ar' ? undefined : draftInstructions || undefined,
      patientInstructionsAr: language === 'ar' ? draftInstructions || undefined : undefined,
    })

    const newVisitId = `visit-${now.getTime()}`
    addVisit({
      id: newVisitId,
      patientId: selectedPatient.id,
      doctorId: doctorProfile.id,
      organizationId,
      date: nowIso,
      reason:
        language === 'ar'
          ? 'زيارة إنشاء وصفة جديدة (عرض تجريبي).'
          : 'New prescription creation visit (demo).',
      diagnosis: draftDiagnosis,
      prescriptionId: newRxId,
      followUpDate:
        followUpDays > 0
          ? new Date(now.getTime() + followUpDays * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      notes: draftInstructions || undefined,
    })

    if (followUpDays > 0) {
      const followUpDate = new Date(now.getTime() + followUpDays * 24 * 60 * 60 * 1000).toISOString()
      const newAppointmentId = `appt-${now.getTime()}`
      addAppointment({
        id: newAppointmentId,
        patientId: selectedPatient.id,
        doctorId: doctorProfile.id,
        organizationId,
        datetime: followUpDate,
        status: 'scheduled',
        reason:
          language === 'ar'
            ? 'متابعة بعد الوصفة التجريبية.'
            : 'Follow-up after demo prescription.',
      })
    }
  }

  const handlePrintPreview = () => {
    window.print()
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

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,2.05fr)]">
        <Card className="p-4 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {language === 'ar' ? 'لوحة المرضى (تجريبية)' : 'Patient sidebar (demo)'}
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                {language === 'ar'
                  ? 'استعرض مرضاك التجريبيين، اختر مريضاً لملء الروشتة، أو افتح البروفايل الكامل لحالته.'
                  : 'Browse your demo patients, select one to fill the prescription, or open the full profile.'}
              </p>
            </div>
          </div>
          <div className="max-h-80 overflow-auto space-y-2 mt-2">
            {sidebarPatients.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                {language === 'ar'
                  ? 'لا يوجد مرضى مرتبطون بك في بيانات العرض بعد. عند حفظ روشتة تجريبية أو إنشاء موعد، سيظهر المرضى هنا.'
                  : 'No patients linked to you in the demo data yet. When you save demo prescriptions or create appointments, patients will appear here.'}
              </p>
            ) : (
              sidebarPatients.map(p => {
                const lastVisit = getLastVisitForSidebar(p.id)
                const nextAppt = getNextAppointmentForSidebar(p.id)
                const isSelected = p.id === selectedPatientId

                const isHighRiskDemo = p.id === 'patient-2' || p.id === 'patient-6'

                return (
                  <div
                    key={p.id}
                    className={`rounded-md border px-2 py-2 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50'
                        : isHighRiskDemo
                        ? 'border-red-200 bg-red-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-semibold text-slate-900">
                          {p.name}{' '}
                          <span className="font-normal text-slate-600">({p.age})</span>
                        </div>
                        {p.notes && (
                          <div className="text-[11px] text-slate-600 line-clamp-2">{p.notes}</div>
                        )}
                        {p.id === 'patient-2' && (
                          <div className="mt-1 text-[10px] text-red-700">
                            {language === 'ar'
                              ? 'حالة تجريبية بتداخل دوائي (وارفارين + أسبرين) مع تحذير نزيف.'
                              : 'Demo case with a Warfarin + Aspirin interaction and bleeding-risk warning.'}
                          </div>
                        )}
                        {p.id === 'patient-6' && (
                          <div className="mt-1 text-[10px] text-red-700">
                            {language === 'ar'
                              ? 'حالة تجريبية لوظائف كلى ضعيفة مع استخدام إيبوبروفين ونصائح غذائية.'
                              : 'Demo case with CKD, Ibuprofen risk, and kidney-friendly lifestyle advice.'}
                          </div>
                        )}
                        {p.id === 'patient-1' && (
                          <div className="mt-1 text-[10px] text-slate-600">
                            {language === 'ar'
                              ? 'ارتفاع ضغط مع تركيز على تعديل نمط الحياة (الملح، الرياضة).'
                              : 'Hypertension demo with emphasis on lifestyle (salt reduction, exercise).'}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Button
                          size="sm"
                          variant={isSelected ? 'primary' : 'secondary'}
                          onClick={() => setSelectedPatientId(p.id)}
                        >
                          {language === 'ar' ? 'اختيار' : 'Select'}
                        </Button>
                        <Link
                          to={`/doctor/patients/${p.id}`}
                          className="text-[11px] text-teal-700 hover:underline"
                        >
                          {language === 'ar' ? 'بروفايل كامل' : 'Full profile'}
                        </Link>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                      <div>
                        <div className="font-semibold text-slate-700">
                          {language === 'ar' ? 'آخر زيارة' : 'Last visit'}
                        </div>
                        <div>
                          {lastVisit
                            ? new Date(lastVisit).toLocaleDateString()
                            : language === 'ar'
                            ? 'لا يوجد في العرض'
                            : 'None in demo'}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-700">
                          {language === 'ar' ? 'أقرب موعد' : 'Next appointment'}
                        </div>
                        <div>
                          {nextAppt
                            ? `${new Date(nextAppt).toLocaleDateString()} ${new Date(
                                nextAppt,
                              ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : language === 'ar'
                            ? 'لا يوجد في العرض'
                            : 'None in demo'}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>

        <div className="space-y-4">
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
              <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <label className="block space-y-1">
                  <span className="font-medium text-slate-700">
                    {language === 'ar' ? 'المريض' : 'Patient'}
                  </span>
                  <select
                    value={selectedPatientId}
                    onChange={e => setSelectedPatientId(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">
                      {language === 'ar' ? 'اختر مريضاً تجريبياً…' : 'Select a demo patient…'}
                    </option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.age})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="font-medium text-slate-700">
                    {language === 'ar' ? 'متابعة بعد (أيام)' : 'Follow-up in (days)'}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={followUpDays}
                    onChange={e => setFollowUpDays(Number(e.target.value) || 0)}
                    className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </label>
              </div>
              <label className="block space-y-1">
                <span className="font-medium text-slate-700">
                  {language === 'ar' ? 'قالب جاهز' : 'Prescription template'}
                </span>
                <select
                  value={selectedTemplateKey}
                  onChange={e => handleTemplateSelect(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="">
                    {language === 'ar'
                      ? 'بدون قالب Ⴁ ابدأ من الصفر'
                      : 'No template Ⴁ start from scratch'}
                  </option>
                  {prescriptionTemplates.map(t => (
                    <option key={t.key} value={t.key}>
                      {language === 'ar' ? t.labelAr : t.labelEn}
                    </option>
                  ))}
                </select>
              </label>
              <div className="border border-dashed border-slate-300 rounded-md p-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    {language === 'ar' ? 'مساعد الذكاء الاصطناعي (تجريبي)' : 'AI assist (demo)'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {language === 'ar'
                      ? 'لا يُستخدم لاتخاذ قرارات طبية حقيقية، فقط لتوضيح فكرة المساعد.'
                      : 'Not for real medical use Ⴁ illustration of an assistant only.'}
                  </span>
                </div>
                <textarea
                  value={aiSymptoms}
                  onChange={e => setAiSymptoms(e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder={
                    language === 'ar'
                      ? 'اكتب شكوى المريض باختصار (مثال: صداع، دوار، عطش زائد، كحة مستمرة...).'
                      : 'Briefly describe the case (e.g. headaches, dizziness, increased thirst, persistent cough...).'
                  }
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={runDemoAiAssist}>
                      {language === 'ar' ? 'اقتراح تجريبي' : 'Generate demo suggestion'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={() => {
                        setAiSymptoms('')
                        setAiSuggestedDiagnosis('')
                        setAiSuggestedTemplateKey(null)
                        setAiExplanation('')
                      }}
                    >
                      {language === 'ar' ? 'مسح' : 'Clear'}
                    </Button>
                  </div>
                  {aiSuggestedTemplateKey && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleTemplateSelect(aiSuggestedTemplateKey as string)}
                    >
                      {language === 'ar' ? 'تطبيق القالب المقترح' : 'Apply suggested template'}
                    </Button>
                  )}
                </div>
                {(aiSuggestedDiagnosis || aiExplanation) && (
                  <div className="space-y-1 text-[11px] text-slate-700">
                    {aiSuggestedDiagnosis && (
                      <p>
                        <span className="font-semibold">
                          {language === 'ar' ? 'تشخيص مقترح: ' : 'Suggested diagnosis: '}
                        </span>
                        {aiSuggestedDiagnosis}
                      </p>
                    )}
                    {aiExplanation && <p>{aiExplanation}</p>}
                  </div>
                )}
              </div>
              <label className="block space-y-1">
                <span className="font-medium text-slate-700">
                  {language === 'ar' ? 'التشخيص' : 'Diagnosis'}
                </span>
                <input
                  value={draftDiagnosis}
                  onChange={e => setDraftDiagnosis(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-2 py-1 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder={
                    language === 'ar'
                      ? 'مثال: ارتفاع ضغط الدم، التهاب الحلق...'
                      : 'e.g. Hypertension, sore throat...'
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
              <div className="border-t border-slate-100 pt-3 mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    {language === 'ar'
                      ? 'تعليمات للمريض (تظهر على ظهر الروشتة في العرض)'
                      : 'Patient instructions (shown on back of prescription in demo)'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {language === 'ar'
                      ? 'اكتب تعليمات بلغة مبسطة، هذه البيانات لأغراض العرض فقط.'
                      : 'Write simple-language instructions; this data is for demo purposes only.'}
                  </span>
                </div>
                <textarea
                  value={draftInstructions}
                  onChange={e => setDraftInstructions(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder={
                    language === 'ar'
                      ? 'مثال: تناول الدواء بعد الأكل، اشرب ماءً كافياً، راجع الطبيب إذا ساءت الأعراض...'
                      : 'e.g. Take after food, drink enough water, contact your doctor if symptoms worsen...'
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {language === 'ar' ? 'معاينة الروشتة للطباعة' : 'Prescription print preview'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'ar'
                    ? 'هذه معاينة تجريبية موسعة تشبه ورقة روشتة كاملة من الأمام والخلف.'
                    : 'Expanded demo preview that mimics a full front and back prescription sheet.'}
                </p>
              </div>
              <div className="flex gap-2">
                {selectedPatient && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/doctor/patients/${selectedPatient.id}`)}
                  >
                    {language === 'ar' ? 'فتح ملف المريض' : 'Open patient record'}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handlePrintPreview}
                  disabled={!isDraftReady}
                >
                  {language === 'ar' ? 'طباعة (تجريبي)' : 'Print (demo)'}
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleSaveDraftAsDemo}
                  disabled={!isDraftReady}
                >
                  {language === 'ar' ? 'حفظ في سجل التجربة' : 'Save to demo record'}
                </Button>
              </div>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 sm:p-6 text-xs">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-500">
                        {language === 'ar' ? 'الوجه الأمامي (عرض تجريبي)' : 'Front side (demo)'}
                      </div>
                      <div className="mt-1 font-semibold text-slate-900">
                        {language === 'ar' ? 'عيادة MedSync' : 'MedSync Clinic'}
                      </div>
                      <div className="text-[11px] text-slate-500">{doctorProfile?.specialty}</div>
                    </div>
                    <div className="text-[11px] text-slate-500 text-right">
                      <div>
                        {language === 'ar' ? 'التاريخ:' : 'Date:'}{' '}
                        {new Date().toLocaleDateString()}
                      </div>
                      {selectedPatient && (
                        <div>
                          {language === 'ar' ? 'العمر:' : 'Age:'} {selectedPatient.age}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-2 mt-2 space-y-1">
                    <div className="text-[11px] text-slate-700">
                      <span className="font-semibold">
                        {language === 'ar' ? 'الاسم:' : 'Patient:'}{' '}
                      </span>
                      {selectedPatient
                        ? selectedPatient.name
                        : language === 'ar'
                        ? 'لم يتم اختيار مريض'
                        : 'No patient selected'}
                    </div>
                    <div className="text-[11px] text-slate-700">
                      <span className="font-semibold">
                        {language === 'ar' ? 'التشخيص:' : 'Diagnosis:'}{' '}
                      </span>
                      {draftDiagnosis ||
                        (language === 'ar' ? 'لم يُكتب تشخيص بعد' : 'No diagnosis entered yet')}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-2 mt-3">
                    <div className="text-[11px] font-semibold text-slate-700 mb-1">
                      {language === 'ar' ? 'الأدوية الموصوفة' : 'Prescribed medications'}
                    </div>
                    {nonEmptyDraftMeds.length === 0 ? (
                      <div className="text-[11px] text-slate-500">
                        {language === 'ar'
                          ? 'لم تتم إضافة أدوية بعد.'
                          : 'No medications have been added yet.'}
                      </div>
                    ) : (
                      <ul className="space-y-1">
                        {nonEmptyDraftMeds.map(m => (
                          <li key={m.name} className="flex justify-between">
                            <div className="text-[11px] text-slate-900">
                              {m.name} – {m.dosage}
                            </div>
                            <div className="text-[11px] text-slate-600">
                              {m.frequency} · {m.duration}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 sm:p-6 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">
                      {language === 'ar' ? 'الوجه الخلفي (عرض تجريبي)' : 'Back side (demo)'}
                    </div>
                  </div>

                  {draftInteractions.length > 0 && (
                    <div className="mb-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-[11px] text-red-700">
                      <div className="font-semibold">
                        {language === 'ar'
                          ? 'تحذير تداخل دوائي (قواعد تجريبية)'
                          : 'Drug interaction warning (demo rules)'}
                      </div>
                      <ul className="mt-1 list-disc list-inside space-y-0.5">
                        {draftInteractions.map(interaction => (
                          <li key={interaction.id}>
                            {language === 'ar' ? interaction.messageAr : interaction.messageEn}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {draftInstructions && (
                    <div className="mb-3">
                      <div className="text-[11px] font-semibold text-slate-700 mb-1">
                        {language === 'ar' ? 'تعليمات للمريض' : 'Instructions for the patient'}
                      </div>
                      <p className="text-[11px] text-slate-700 whitespace-pre-line">{draftInstructions}</p>
                    </div>
                  )}

                  {nonEmptyDraftMeds.length > 0 && (
                    <div className="mb-3 border-t border-slate-200 pt-2 mt-1">
                      <div className="text-[11px] font-semibold text-slate-700 mb-1">
                        {language === 'ar'
                          ? 'ملخّص مبسّط لكل دواء (عرض تجريبي فقط)'
                          : 'Simplified summary per drug (demo only)'}
                      </div>
                      <ul className="space-y-1">
                        {nonEmptyDraftMeds.map(m => (
                          <li key={`${m.name}-${m.dosage}`} className="text-[11px] text-slate-700">
                            <span className="font-semibold">{m.name}</span>{' '}
                            <span className="text-slate-600">
                              – {m.dosage}, {m.frequency}, {m.duration}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {followUpDays > 0 && (
                    <div className="border-t border-slate-200 pt-2 mt-1 text-[11px] text-slate-700">
                      {language === 'ar'
                        ? `موعد متابعة مقترح بعد ${followUpDays} يوم (عرض تجريبي).`
                        : `Suggested follow-up in ${followUpDays} days (demo).`}
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-2 mt-2 text-[10px] text-slate-400">
                    {language === 'ar'
                      ? 'هذا المستند جزء من عرض تجريبي لمنصّة MedSync AI ولا يُستخدم كوصفة طبية حقيقية أو لاتخاذ قرارات علاجية.'
                      : 'This document is part of a MedSync AI demo and must not be used as a real prescription or for clinical decisions.'}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

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
