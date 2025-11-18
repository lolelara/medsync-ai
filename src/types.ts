export type Role = 'admin' | 'doctor' | 'org' | 'nurse' | 'supervisor' | 'pharmacy_admin'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  organizationId?: string
}

export interface Organization {
  id: string
  name: string
  type: 'clinic' | 'hospital'
  address: string
  contactEmail: string
}

export interface Doctor {
  id: string
  userId: string
  specialty: string
  licenseNumber: string
}

export type PrescriptionStatus = 'pending' | 'approved' | 'rejected' | 'flagged'

export interface PrescriptionMedication {
  name: string
  dosage: string
  frequency: string
  duration: string
}

export interface Prescription {
  id: string
  patientName: string
  age: number
  diagnosis: string
  medications: PrescriptionMedication[]
  status: PrescriptionStatus
  assignedDoctorId: string
  organizationId: string
  aiReviewSummary: string
  aiRiskScore: number
  aiFlags: string[]
  createdAt: string
  updatedAt: string
  patientInstructionsEn?: string
  patientInstructionsAr?: string
}

export type ApiKeyStatus = 'untested' | 'active' | 'degraded' | 'down'

export interface ApiKey {
  id: string
  label: string
  provider: 'openai' | 'azure' | 'other'
  keyMasked: string
  status: ApiKeyStatus
  successRate: number
  errorRate: number
  lastCheckedAt: string | null
  isPrimary: boolean
}

export interface DailyMetricPoint {
  date: string
  totalPrescriptions: number
  flaggedPrescriptions: number
}

export interface DoctorStat {
  doctorId: string
  totalPrescriptions: number
  flaggedPrescriptions: number
}
