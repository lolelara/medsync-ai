import { Appointment } from '../types'

export const mockAppointments: Appointment[] = [
  {
    id: 'appt-1',
    patientId: 'patient-1',
    doctorId: 'doc-1',
    organizationId: 'org-1',
    datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    reason: 'Routine blood pressure check',
  },
  {
    id: 'appt-2',
    patientId: 'patient-2',
    doctorId: 'doc-2',
    organizationId: 'org-1',
    datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    reason: 'Review anticoagulation therapy',
  },
]
