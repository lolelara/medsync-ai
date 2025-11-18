import { DailyMetricPoint } from '../types'

interface MiniLineChartProps {
  data: DailyMetricPoint[]
}

export function MiniLineChart({ data }: MiniLineChartProps) {
  if (!data.length) {
    return <div className="text-xs text-slate-500">No recent activity</div>
  }

  const width = 260
  const height = 80
  const max = Math.max(...data.map(d => d.totalPrescriptions), 1)
  const stepX = data.length > 1 ? width / (data.length - 1) : width

  const path = data
    .map((point, index) => {
      const x = index * stepX
      const y = height - (point.totalPrescriptions / max) * (height - 16) - 8
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 text-teal-500">
      <defs>
        <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke="#14b8a6" strokeWidth={2} />
    </svg>
  )
}
