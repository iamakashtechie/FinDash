import {useMemo} from 'react';
import {AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext'
import { fmtINR, monthKey } from '../utils'
import { MONTH_LABELS } from '../data/mockData'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-elevated border border-border rounded-[.625rem] py-3 px-4 text-[.813rem]">
      <p className="text-muted mb-2 text-[.75rem] font-semibold">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="mb-1 flex items-center gap-2">
          <span style={{ background: p.color }} className="w-2 h-2 rounded-xs shrink-0" />
          <span className="text-muted min-w-17.5">{p.name}</span>
          <span className="font-mono font-semibold text-text">
            {fmtINR(p.value)}
          </span>
        </p>
      ))}
    </div>
  )
}

export default function BalanceTrendChart() {
  const { transactions } = useApp()

  const data = useMemo(() => {
    let running = 0
    return Object.entries(MONTH_LABELS).map(([key, label]) => {
      const monthTxs = transactions.filter(t => monthKey(t.date) === key)
      const income   = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const expenses = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
      running += income - expenses
      return { month: label, Income: +income.toFixed(2), Expenses: +expenses.toFixed(2), Balance: +running.toFixed(2) }
    })
  }, [transactions])

  const legend = [
    { key: 'Income',   color: 'var(--green)' },
    { key: 'Expenses', color: 'var(--red)'   },
    { key: 'Balance',  color: 'var(--accent)' },
  ]

  return (
    <div className="card-base flex-1 min-w-0">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-[.938rem] font-semibold text-text mb-0.75">Balance Trend</h3>
          <p className="text-[.75rem] text-muted">Oct 2025 - Mar 2026</p>
        </div>
        <div className="flex gap-4">
          {legend.map(l => (
            <span key={l.key} className="flex items-center gap-1.5 text-[.75rem] text-muted">
              <span style={{ background: l.color }} className="w-2.5 h-2.5 rounded-xs shrink-0" />
              {l.key}
            </span>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {[['balGrad', 'var(--accent)'], ['incGrad', 'var(--green)'], ['expGrad', 'var(--red)']].map(([id, color]) => (
              <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.18} />
                <stop offset="95%" stopColor={color} stopOpacity={0}    />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'k'}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="Income"   name="Income"   stroke="var(--green)"  fill="url(#incGrad)" strokeWidth={1.5} dot={false} />
          <Area type="monotone" dataKey="Expenses" name="Expenses" stroke="var(--red)"    fill="url(#expGrad)" strokeWidth={1.5} dot={false} />
          <Area
            type="monotone" dataKey="Balance" name="Balance" stroke="var(--accent)"
            fill="url(#balGrad)" strokeWidth={2.5}
            dot={{ fill: 'var(--accent)', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: 'var(--accent)', strokeWidth: 2, stroke: 'var(--card)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
