import { Prescription } from '../types'

const now = new Date()

function daysAgo(days: number) {
  const d = new Date(now)
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export const mockPrescriptions: Prescription[] = [
  {
    id: 'rx-1',
    patientName: 'John Doe',
    age: 54,
    diagnosis: 'Hypertension',
    medications: [
      { name: 'Lisinopril', dosage: '10 mg', frequency: 'once daily', duration: '30 days' },
    ],
    status: 'pending',
    assignedDoctorId: 'doc-1',
    organizationId: 'org-1',
    aiReviewSummary:
      'No major interactions detected. Monitor blood pressure weekly. Consider renal function testing in 2 weeks.',
    aiRiskScore: 0.18,
    aiFlags: ['Recommend baseline renal function tests'],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    patientInstructionsEn:
      'Take Lisinopril once daily at the same time each morning. Monitor your blood pressure at home twice per week and report dizziness or fainting.',
    patientInstructionsAr:
      'تناول عقار ليسينوبريل مرة واحدة يومياً في نفس التوقيت صباحاً. راقب ضغط الدم في المنزل مرتين أسبوعياً وأبلغ الطبيب عند حدوث دوخة أو إغماء.',
  },
  {
    id: 'rx-2',
    patientName: 'Maria Rodriguez',
    age: 67,
    diagnosis: 'Atrial fibrillation',
    medications: [
      { name: 'Warfarin', dosage: '5 mg', frequency: 'once daily', duration: '30 days' },
      { name: 'Aspirin', dosage: '81 mg', frequency: 'once daily', duration: '30 days' },
    ],
    status: 'flagged',
    assignedDoctorId: 'doc-2',
    organizationId: 'org-1',
    aiReviewSummary:
      'Potential increased bleeding risk with concurrent Warfarin and Aspirin. Review indication for dual therapy.',
    aiRiskScore: 0.82,
    aiFlags: ['High bleeding risk', 'Check INR and review concurrent aspirin use'],
    createdAt: daysAgo(2),
    updatedAt: daysAgo(0),
    patientInstructionsEn:
      'Take Warfarin and Aspirin exactly as prescribed. Watch for signs of bleeding such as black stools, nosebleeds, or unusual bruising and seek urgent care if they occur.',
    patientInstructionsAr:
      'تناول الوارفارين والأسبرين تماماً كما وصف الطبيب. انتبه لعلامات النزيف مثل البراز الأسود أو نزيف الأنف أو الكدمات غير العادية، واطلب الرعاية الطبية فوراً إذا ظهرت.',
  },
  {
    id: 'rx-3',
    patientName: 'Liam Smith',
    age: 8,
    diagnosis: 'Acute otitis media',
    medications: [
      { name: 'Amoxicillin', dosage: '45 mg/kg/day', frequency: 'twice daily', duration: '7 days' },
    ],
    status: 'approved',
    assignedDoctorId: 'doc-3',
    organizationId: 'org-2',
    aiReviewSummary:
      'Weight-based dosing within recommended pediatric range. Ensure adherence and schedule follow-up if no improvement.',
    aiRiskScore: 0.12,
    aiFlags: ['Confirm weight and allergy history'],
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
    patientInstructionsEn:
      'Give Amoxicillin twice daily after food for 7 days. Complete the full course even if symptoms improve and contact your doctor if fever persists more than 48 hours.',
    patientInstructionsAr:
      'أعطِ الأموكسيسيلين مرتين يومياً بعد الطعام لمدة 7 أيام. أكمل الجرعة كاملة حتى لو تحسنت الأعراض، وتواصل مع الطبيب إذا استمرت الحرارة لأكثر من 48 ساعة.',
  },
  {
    id: 'rx-4',
    patientName: 'Evelyn Johnson',
    age: 45,
    diagnosis: 'Type 2 diabetes',
    medications: [
      { name: 'Metformin', dosage: '500 mg', frequency: 'twice daily', duration: '90 days' },
      { name: 'Empagliflozin', dosage: '10 mg', frequency: 'once daily', duration: '90 days' },
    ],
    status: 'pending',
    assignedDoctorId: 'doc-1',
    organizationId: 'org-1',
    aiReviewSummary:
      'Combination appropriate for glycemic control and cardiovascular risk reduction. Monitor renal function and volume status.',
    aiRiskScore: 0.3,
    aiFlags: ['Monitor eGFR every 3-6 months'],
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
    patientInstructionsEn:
      'Take Metformin with meals and Empagliflozin once daily. Drink adequate fluids and contact your doctor if you develop nausea, vomiting, or reduced urine output.',
    patientInstructionsAr:
      'تناول الميتفورمين مع الطعام والإمباغليفلوزين مرة واحدة يومياً. اشرب كمية كافية من السوائل، وتواصل مع طبيبك عند حدوث غثيان أو قيء أو نقص في كمية البول.',
  },
  {
    id: 'rx-5',
    patientName: 'Noah Wilson',
    age: 36,
    diagnosis: 'Major depressive disorder',
    medications: [
      { name: 'Sertraline', dosage: '50 mg', frequency: 'once daily', duration: '60 days' },
    ],
    status: 'approved',
    assignedDoctorId: 'doc-2',
    organizationId: 'org-1',
    aiReviewSummary:
      'Initial SSRI dosing is within standard range. Assess for suicidality at follow-up and monitor for side effects.',
    aiRiskScore: 0.25,
    aiFlags: ['Schedule follow-up within 2 weeks'],
    createdAt: daysAgo(4),
    updatedAt: daysAgo(3),
    patientInstructionsEn:
      'Take Sertraline once daily, preferably in the morning. Do not stop suddenly and contact your doctor urgently if you notice worsening mood or suicidal thoughts.',
    patientInstructionsAr:
      'تناول السيرترالين مرة واحدة يومياً ويفضل صباحاً. لا توقف الدواء بشكل مفاجئ، واتصل بطبيبك فوراً إذا لاحظت تدهوراً في المزاج أو أفكاراً انتحارية.',
  },
  {
    id: 'rx-6',
    patientName: 'Olivia Martinez',
    age: 72,
    diagnosis: 'Chronic kidney disease stage 3',
    medications: [
      { name: 'Ibuprofen', dosage: '400 mg', frequency: 'three times daily', duration: '10 days' },
    ],
    status: 'flagged',
    assignedDoctorId: 'doc-3',
    organizationId: 'org-2',
    aiReviewSummary:
      'NSAID use in CKD stage 3 may worsen renal function. Consider alternative analgesia and review indication.',
    aiRiskScore: 0.9,
    aiFlags: ['Avoid NSAIDs in CKD', 'Review alternative pain management options'],
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    patientInstructionsEn:
      'Avoid other painkillers containing ibuprofen or similar drugs. Contact your doctor if you notice ankle swelling, shortness of breath, or decreased urine.',
    patientInstructionsAr:
      'تجنب تناول مسكنات أخرى تحتوي على الإيبوبروفين أو أدوية مشابهة. تواصل مع طبيبك إذا لاحظت تورم الكاحلين أو ضيقاً في التنفس أو نقصاً في كمية البول.',
  },
]
