import { DailyMetricPoint, Doctor, DoctorStat, Prescription } from '../types'

export function getDailyMetrics(
  prescriptions: Prescription[],
  organizationId?: string
): DailyMetricPoint[] {
  const filtered = organizationId
    ? prescriptions.filter(p => p.organizationId === organizationId)
    : prescriptions

  const byDate: Record<string, { total: number; flagged: number }> = {}

  for (const p of filtered) {
    const day = p.createdAt.slice(0, 10)
    if (!byDate[day]) {
      byDate[day] = { total: 0, flagged: 0 }
    }
    byDate[day].total += 1
    if (p.status === 'flagged') {
      byDate[day].flagged += 1
    }
  }

  const dates = Object.keys(byDate).sort()

  return dates.map(date => ({
    date,
    totalPrescriptions: byDate[date].total,
    flaggedPrescriptions: byDate[date].flagged,
  }))
}

export function getDoctorStats(
  prescriptions: Prescription[],
  doctors: Doctor[],
  organizationId?: string
): DoctorStat[] {
  const doctorById = new Map(doctors.map(d => [d.id, d]))

  const counts: Record<string, { total: number; flagged: number }> = {}

  for (const p of prescriptions) {
    if (organizationId && p.organizationId !== organizationId) continue
    const id = p.assignedDoctorId
    if (!counts[id]) {
      counts[id] = { total: 0, flagged: 0 }
    }
    counts[id].total += 1
    if (p.status === 'flagged') counts[id].flagged += 1
  }

  return Object.entries(counts).map(([doctorId, value]) => ({
    doctorId,
    totalPrescriptions: value.total,
    flaggedPrescriptions: value.flagged,
  }))
}
