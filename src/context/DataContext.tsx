import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import {
  Doctor,
  Organization,
  Prescription,
  PrescriptionStatus,
  User,
  Patient,
  Visit,
  Appointment,
  Notification,
  ChatMessage,
  SubscriptionPlan,
} from '../types'
import { mockUsers } from '../mock/users'
import { mockOrganizations } from '../mock/organizations'
import { mockDoctors } from '../mock/doctors'
import { mockPrescriptions } from '../mock/prescriptions'
import { mockPatients } from '../mock/patients'
import { mockVisits } from '../mock/visits'
import { mockAppointments } from '../mock/appointments'
import { mockNotifications } from '../mock/notifications'
import { mockMessages } from '../mock/messages'
import { mockPlans } from '../mock/plans'

interface DataContextValue {
  users: User[]
  organizations: Organization[]
  doctors: Doctor[]
  prescriptions: Prescription[]
  patients: Patient[]
  visits: Visit[]
  appointments: Appointment[]
  notifications: Notification[]
  messages: ChatMessage[]
  plans: SubscriptionPlan[]
  updatePrescriptionStatus: (id: string, status: PrescriptionStatus) => void
  updateUser: (id: string, updates: Partial<User>) => void
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  addMessage: (message: ChatMessage) => void
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void
  addVisit: (visit: Visit) => void
  addAppointment: (appointment: Appointment) => void
  addPrescription: (prescription: Prescription) => void
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [organizations] = useState<Organization[]>(mockOrganizations)
  const [doctors] = useState<Doctor[]>(mockDoctors)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions)
  const [patients] = useState<Patient[]>(mockPatients)
  const [visits, setVisits] = useState<Visit[]>(mockVisits)
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [plans] = useState<SubscriptionPlan[]>(mockPlans)

  const updatePrescriptionStatus = (id: string, status: PrescriptionStatus) => {
    setPrescriptions(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status, updatedAt: new Date().toISOString() }
          : p
      )
    )
  }

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)))
  }

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev])
  }

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
  }

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message])
  }

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)))
  }

  const addVisit = (visit: Visit) => {
    setVisits(prev => [...prev, visit])
  }

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment])
  }

  const addPrescription = (prescription: Prescription) => {
    setPrescriptions(prev => [...prev, prescription])
  }

  const value = useMemo(
    () => ({
      users,
      organizations,
      doctors,
      prescriptions,
      patients,
      visits,
      appointments,
      notifications,
      messages,
      plans,
      updatePrescriptionStatus,
      updateUser,
      addNotification,
      markNotificationRead,
      addMessage,
      updateAppointmentStatus,
      addVisit,
      addAppointment,
      addPrescription,
    }),
    [
      users,
      organizations,
      doctors,
      prescriptions,
      patients,
      visits,
      appointments,
      notifications,
      messages,
      plans,
    ]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) {
    throw new Error('useData must be used within a DataProvider')
  }
  return ctx
}
