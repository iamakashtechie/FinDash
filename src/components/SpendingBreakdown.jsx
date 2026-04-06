import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../context/AppContext'
import { fmtINR } from '../utils'
import { CATEGORY_COLORS } from '../data/mockData'

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-elevated border border-border rounded-lg py-2 px-3 text-[.813rem]">
      <span className="text-muted">{name}: </span>
      <strong className="text-text font-mono font-bold">{fmtINR(value)}</strong>
    </div>
  )
}

export default function SpendingBreakdown() {
  const { transactions } = useApp()

  const data = useMemo(() => {
    const totals = {}
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => { totals[t.cat] = (totals[t.cat] || 0) + t.amount })
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value: +value.toFixed(2), color: CATEGORY_COLORS[name] || '#666' }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const total = data.reduce((s, d) => s + d.value, 0)
  const top6  = data.slice(0, 6)

  return (
    <div className="card-base w-full md:w-[320px] shrink-0">
      <h3 className="text-[15px] font-semibold text-text mb-0.5">Spending Breakdown</h3>
      <p className="text-[12px] text-muted mb-5">By category - all time</p>

      {/* donut chart */}
      <div className="relative h-45 mb-5">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={top6} cx="50%" cy="50%"
              innerRadius={58} outerRadius={82}
              dataKey="value" paddingAngle={3} strokeWidth={0}
            >
              {top6.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* centre label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-[.625rem] text-muted tracking-[0.5px] uppercase">Total</div>
          <div className="text-[1rem] font-bold text-text font-mono">
            ₹{(total / 1000).toFixed(1)}k
          </div>
        </div>
      </div>

      {/* horizontal mini-bars legend */}
      <div className="flex flex-col gap-2.5">
        {top6.map((d, i) => {
          const pct = (d.value / total * 100).toFixed(0)
          return (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <div className="flex items-center gap-1.75">
                  <span className="w-2 h-2 rounded-xs shrink-0" style={{ background: d.color }} />
                  <span className="text-[12px] text-muted">{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-dim">{pct}%</span>
                  <span className="text-[12px] text-text font-mono">
                    {fmtINR(d.value)}
                  </span>
                </div>
              </div>
              {/* progress bar */}
              <div className="h-0.75 bg-dim rounded-xs overflow-hidden">
                <div className="h-full rounded-xs transition-all duration-400 ease-in-out" style={{ width: pct + '%', background: d.color }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
