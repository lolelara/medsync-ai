import { Notification } from '../types'

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-doc-1',
    title: 'Upcoming appointment',
    body: 'John Doe has an appointment tomorrow at 10:00.',
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: 'notif-2',
    userId: 'user-doc-2',
    title: 'Follow-up due',
    body: 'Maria Rodriguez is due for a follow-up on her anticoagulation plan.',
    createdAt: new Date().toISOString(),
    read: false,
  },
]
