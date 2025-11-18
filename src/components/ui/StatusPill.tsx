import { Badge } from './Badge'
import { ApiKeyStatus, PrescriptionStatus } from '../../types'

interface StatusPillProps {
  type: 'prescription' | 'apikey'
  status: PrescriptionStatus | ApiKeyStatus
}

export function StatusPill({ type, status }: StatusPillProps) {
  if (type === 'prescription') {
    const s = status as PrescriptionStatus
    if (s === 'approved') return <Badge color="green">Approved</Badge>
    if (s === 'pending') return <Badge color="blue">Pending review</Badge>
    if (s === 'rejected') return <Badge color="red">Rejected</Badge>
    if (s === 'flagged') return <Badge color="amber">Flagged</Badge>
  }

  const keyStatus = status as ApiKeyStatus
  if (keyStatus === 'active') return <Badge color="green">Active</Badge>
  if (keyStatus === 'degraded') return <Badge color="amber">Degraded</Badge>
  if (keyStatus === 'down') return <Badge color="red">Down</Badge>
  return <Badge>Untested</Badge>
}
