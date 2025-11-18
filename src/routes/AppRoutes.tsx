import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminOrganizationsPage from '../pages/admin/AdminOrganizationsPage'
import AdminApiKeysPage from '../pages/admin/AdminApiKeysPage'
import AdminSettingsPage from '../pages/admin/AdminSettingsPage'
import DoctorDashboard from '../pages/doctor/DoctorDashboard'
import DoctorPrescriptionDetailPage from '../pages/doctor/DoctorPrescriptionDetailPage'
import OrgDashboard from '../pages/org/OrgDashboard'
import OrgDoctorsPage from '../pages/org/OrgDoctorsPage'
import OrgPrescriptionsPage from '../pages/org/OrgPrescriptionsPage'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminLayout } from '../layouts/AdminLayout'
import { DoctorLayout } from '../layouts/DoctorLayout'
import { OrgLayout } from '../layouts/OrgLayout'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element=
          {
            <ProtectedRoute roles={['admin']}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
      />
      <Route
        path="/admin/users"
        element=
          {
            <ProtectedRoute roles={['admin']}>
              <AdminLayout>
                <AdminUsersPage />
              </AdminLayout>
            </ProtectedRoute>
          }
      />
      <Route
        path="/admin/organizations"
        element=
          {
            <ProtectedRoute roles={['admin']}>
              <AdminLayout>
                <AdminOrganizationsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
      />
      <Route
        path="/admin/api-keys"
        element=
          {
            <ProtectedRoute roles={['admin']}>
              <AdminLayout>
                <AdminApiKeysPage />
              </AdminLayout>
            </ProtectedRoute>
          }
      />
      <Route
        path="/admin/settings"
        element=
          {
            <ProtectedRoute roles={['admin']}>
              <AdminLayout>
                <AdminSettingsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
      />

      <Route
        path="/doctor"
        element=
          {
            <ProtectedRoute roles={['doctor']}>
              <DoctorLayout>
                <DoctorDashboard />
              </DoctorLayout>
            </ProtectedRoute>
          }
      />
      <Route
        path="/doctor/prescriptions/:id"
        element=
          {
            <ProtectedRoute roles={['doctor']}>
              <DoctorLayout>
                <DoctorPrescriptionDetailPage />
              </DoctorLayout>
            </ProtectedRoute>
          }
      />

      <Route
        path="/org"
        element=
          {
            <ProtectedRoute roles={['org']}>
              <OrgLayout>
                <OrgDashboard />
              </OrgLayout>
            </ProtectedRoute>
          }
      />
      <Route
        path="/org/doctors"
        element=
          {
            <ProtectedRoute roles={['org']}>
              <OrgLayout>
                <OrgDoctorsPage />
              </OrgLayout>
            </ProtectedRoute>
          }
      />
      <Route
        path="/org/prescriptions"
        element=
          {
            <ProtectedRoute roles={['org']}>
              <OrgLayout>
                <OrgPrescriptionsPage />
              </OrgLayout>
            </ProtectedRoute>
          }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
