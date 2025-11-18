import { User } from '../types'

export const mockUsers: User[] = [
  {
    id: 'user-admin-1',
    name: 'Platform Admin',
    email: 'admin@medsync.ai',
    role: 'admin',
  },
  {
    id: 'user-org-1',
    name: 'CityCare Admin',
    email: 'org-admin@citycareclinic.com',
    role: 'org',
    organizationId: 'org-1',
  },
  {
    id: 'user-org-2',
    name: 'Metro General Admin',
    email: 'org-admin@metrogeneral.org',
    role: 'org',
    organizationId: 'org-2',
  },
  {
    id: 'user-doc-1',
    name: 'Dr. Emily Carter',
    email: 'emily.carter@citycareclinic.com',
    role: 'doctor',
    organizationId: 'org-1',
  },
  {
    id: 'user-doc-2',
    name: 'Dr. Miguel Alvarez',
    email: 'miguel.alvarez@citycareclinic.com',
    role: 'doctor',
    organizationId: 'org-1',
  },
  {
    id: 'user-doc-3',
    name: 'Dr. Sophia Nguyen',
    email: 'sophia.nguyen@metrogeneral.org',
    role: 'doctor',
    organizationId: 'org-2',
  },
]
