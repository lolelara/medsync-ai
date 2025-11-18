import { Visit } from '../types'

export const mockVisits: Visit[] = [
  {
    id: 'visit-1',
    patientId: 'patient-1',
    doctorId: 'doc-1',
    organizationId: 'org-1',
    date: new Date().toISOString(),
    reason: 'Follow-up for hypertension',
    diagnosis: 'Hypertension, controlled',
    prescriptionId: 'rx-1',
    followUpDate: null as unknown as string,
    notes: 'Home BP readings acceptable, continue current therapy.',
  },
  {
    id: 'visit-2',
    patientId: 'patient-2',
    doctorId: 'doc-2',
    organizationId: 'org-1',
    date: new Date().toISOString(),
    reason: 'Anticoagulation review',
    diagnosis: 'Atrial fibrillation on Warfarin and Aspirin',
    prescriptionId: 'rx-2',
    followUpDate: null as unknown as string,
    notes: 'Discussed bleeding risk, plan to review aspirin indication.',
  },
]
