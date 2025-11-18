import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import { Doctor, Organization, Prescription, PrescriptionStatus, User } from '../types'
import { mockUsers } from '../mock/users'
import { mockOrganizations } from '../mock/organizations'
import { mockDoctors } from '../mock/doctors'
import { mockPrescriptions } from '../mock/prescriptions'

interface DataContextValue {
  users: User[]
  organizations: Organization[]
  doctors: Doctor[]
  prescriptions: Prescription[]
  updatePrescriptionStatus: (id: string, status: PrescriptionStatus) => void
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [users] = useState<User[]>(mockUsers)
  const [organizations] = useState<Organization[]>(mockOrganizations)
  const [doctors] = useState<Doctor[]>(mockDoctors)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions)

  const updatePrescriptionStatus = (id: string, status: PrescriptionStatus) => {
    setPrescriptions(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status, updatedAt: new Date().toISOString() }
          : p
      )
    )
  }

  const value = useMemo(
    () => ({
      users,
      organizations,
      doctors,
      prescriptions,
      updatePrescriptionStatus,
    }),
    [users, organizations, doctors, prescriptions]
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
