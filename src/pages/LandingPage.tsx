import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-teal-500 text-white flex items-center justify-center font-semibold">
              MS
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              MedSync AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="secondary" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Launch demo</Button>
            </Link>
          </div>
        </header>

        <main className="mt-12 grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-start">
          <section>
            <div className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
              AI-powered prescription safety platform
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
              Safer prescribing for doctors, clinics, and hospitals.
            </h1>
            <p className="mt-4 max-w-xl text-sm md:text-base text-slate-600">
              MedSync AI reviews every prescription with a clinical-grade AI layer, highlighting risk,
              interactions and guideline gaps before medication reaches the patient.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/login">
                <Button>Explore live demo</Button>
              </Link>
              <span className="text-xs text-slate-500">
                No real patient data. Fully mocked analytics for investor presentations.
              </span>
            </div>
          </section>

          <section className="grid gap-4">
            <Card className="p-4 border-teal-100">
              <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">For Doctors</div>
              <p className="mt-2 text-sm text-slate-600">
                Instant AI review of each prescription with clear flags, interaction checks and risk scores.
                Approve, adjust or escalate in a clean point-of-care workspace.
              </p>
            </Card>
            <Card className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary-700">
                For Clinics & Hospitals
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Organization-wide dashboards, trend analytics and quality metrics across all prescribing
                activity.
              </p>
            </Card>
            <Card className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-700">For Admins</div>
              <p className="mt-2 text-sm text-slate-600">
                Central control of users, organizations and AI engine keys with automatic failover and
                health monitoring.
              </p>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}

export default LandingPage
