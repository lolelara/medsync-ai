import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string | number
  helper?: string
  accent?: 'teal' | 'blue' | 'red' | 'amber'
}

export function StatCard({ label, value, helper, accent = 'teal' }: StatCardProps) {
  const accentClasses: Record<string, string> = {
    teal: 'bg-teal-50 text-teal-700',
    blue: 'bg-primary-50 text-primary-700',
    red: 'bg-red-50 text-red-700',
    amber: 'bg-amber-50 text-amber-700',
  }

  return (
    <Card className="p-4 flex flex-col gap-2">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-semibold text-slate-900">{value}</div>
        {helper && (
          <div className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${accentClasses[accent]}`}>
            {helper}
          </div>
        )}
      </div>
    </Card>
  )
}
