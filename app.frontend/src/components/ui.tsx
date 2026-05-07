import type { ReactNode } from 'react'
import { Activity, ArrowUpRight, CircleAlert, HeartPulse } from 'lucide-react'
import type { ChartPoint, VitalStatus } from '../types/domain'

const statusStyles: Record<VitalStatus, string> = {
  stabil: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  atentie: 'bg-amber-50 text-amber-700 ring-amber-200',
  critic: 'bg-rose-50 text-rose-700 ring-rose-200',
}

const statusLabel: Record<VitalStatus, string> = {
  stabil: 'Stabil',
  atentie: 'Atentie',
  critic: 'Critic',
}

export const PageHeader = ({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-sm font-medium text-[#469ba8]">VitalSync</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
    </div>
    {action}
  </div>
)

export const SectionCard = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <section className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>
)

export const StatCard = ({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: string
  hint: string
  tone?: 'default' | 'warning' | 'danger'
}) => {
  const tones = {
    default: 'bg-[#469ba8]/10 text-[#2f7f8b]',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
  }

  return (
    <SectionCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}>
          {tone === 'danger' ? <CircleAlert size={19} /> : tone === 'warning' ? <HeartPulse size={19} /> : <Activity size={19} />}
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{hint}</p>
    </SectionCard>
  )
}

export const StatusBadge = ({ status }: { status: VitalStatus }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[status]}`}>
    {statusLabel[status]}
  </span>
)

export const PrimaryButton = ({ children }: { children: ReactNode }) => (
  <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#469ba8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#397f8a]">
    {children}
    <ArrowUpRight size={16} />
  </button>
)

export const MiniChart = ({ data, color = '#469ba8' }: { data: ChartPoint[]; color?: string }) => {
  if (!data.length) {
    return (
      <div className="flex h-52 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-sm text-slate-500">
        Nu exista date live pentru grafic.
      </div>
    )
  }

  const width = 520
  const height = 180
  const padding = 14
  const values = data.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = Math.max(max - min, 1)
  const step = (width - padding * 2) / Math.max(data.length - 1, 1)
  const points = data
    .map((point, index) => {
      const x = padding + index * step
      const y = height - padding - ((point.value - min) / span) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-52 w-full" role="img" aria-label="Grafic valori vitale">
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.24" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={points} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <polygon points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`} fill="url(#chartFill)" />
        {data.map((point, index) => {
          const x = padding + index * step
          const y = height - padding - ((point.value - min) / span) * (height - padding * 2)
          return <circle key={point.label} cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="3" />
        })}
      </svg>
    </div>
  )
}
