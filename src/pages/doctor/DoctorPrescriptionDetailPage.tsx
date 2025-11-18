import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusPill } from '../../components/ui/StatusPill'

function DoctorPrescriptionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { prescriptions, updatePrescriptionStatus } = useData()

  const prescription = prescriptions.find(p => p.id === id)

  if (!prescription) {
    return (
      <div className="space-y-4">
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
        <div className="text-sm text-slate-600">Prescription not found in demo dataset.</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Prescription for {prescription.patientName}</h1>
          <p className="mt-1 text-xs text-slate-500">
            AI-generated review and risk scoring are mocked for clinical demo only.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          Back to queue
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Clinical details
              </div>
              <div className="mt-1 text-sm text-slate-900">Diagnosis: {prescription.diagnosis}</div>
            </div>
            <StatusPill type="prescription" status={prescription.status} />
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              Medications
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {prescription.medications.map(m => (
                <li key={m.name} className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{m.name}</div>
                    <div className="text-slate-600">
                      {m.dosage} · {m.frequency}
                    </div>
                  </div>
                  <div className="text-slate-500">{m.duration}</div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">AI review summary</div>
            <p className="mt-1 text-xs text-slate-700 whitespace-pre-line">
              {prescription.aiReviewSummary}
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Risk score
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    prescription.aiRiskScore > 0.75
                      ? 'bg-red-500'
                      : prescription.aiRiskScore > 0.4
                      ? 'bg-amber-500'
                      : 'bg-teal-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, prescription.aiRiskScore * 100))}%` }}
                />
              </div>
              <div className="text-xs font-medium text-slate-900">
                {(prescription.aiRiskScore * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">AI flags</div>
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {prescription.aiFlags.map(flag => (
                <li key={flag} className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-2 text-xs">
            <Button
              size="sm"
              variant="primary"
              onClick={() => updatePrescriptionStatus(prescription.id, 'approved')}
            >
              Approve and sign
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => updatePrescriptionStatus(prescription.id, 'rejected')}
            >
              Reject
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => updatePrescriptionStatus(prescription.id, 'flagged')}
            >
              Flag for review
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DoctorPrescriptionDetailPage
