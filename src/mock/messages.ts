import { ChatMessage } from '../types'

export const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    patientId: 'patient-1',
    doctorId: 'doc-1',
    from: 'patient',
    content: 'Doctor, my blood pressure readings have been slightly higher this week.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'msg-2',
    patientId: 'patient-1',
    doctorId: 'doc-1',
    from: 'doctor',
    content: 'Please continue measuring twice daily and bring the log to your next visit.',
    createdAt: new Date().toISOString(),
  },
]
