import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { fmtINR, monthKey } from '../utils'

function Trend({ value }) {
  if (value === null || value === undefined) return null
  const up = value >= 0
  return (
    <span className={`text-[.75rem] font-medium px-2 py-0.5 rounded-[1.25rem] ${up ? 'bg-greenBg text-green' : 'bg-redBg text-red'}`}>
      {up ? '▲' : '▼'} {Math.abs(value).toFixed(1)}%
    </span>
  )
}

export default function SummaryCards() {
  const { transactions } = useApp()

  const stats = useMemo(() => {
    const now = '2026-03', prev = '2026-02'

    const totalBalance = transactions.reduce((s, t) =>
      s + (t.type === 'income' ? t.amount : -t.amount), 0
    )

    const sum = (month, type) =>
      transactions
        .filter(t => monthKey(t.date) === month && t.type === type)
        .reduce((s, t) => s + t.amount, 0)

    const thisInc  = sum(now, 'income')
    const thisExp  = sum(now, 'expense')
    const prevInc  = sum(prev, 'income')
    const prevExp  = sum(prev, 'expense')

    const savingsRate = thisInc > 0 ? (thisInc - thisExp) / thisInc * 100 : 0
    const prevSavings = prevInc > 0 ? (prevInc - prevExp) / prevInc * 100 : 0

    return {
      totalBalance,
      thisInc, prevInc,
      thisExp, prevExp,
      savingsRate, prevSavings,
    }
  }, [transactions])

  const cards = [
    {
      label: 'Total Balance',
      value: fmtINR(stats.totalBalance),
      sub: 'Net worth across all time',
      trend: null,
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="4" width="16" height="11" rx="2" className="stroke-accent" strokeWidth="1.4"/>
          <path d="M1 8h16" className="stroke-accent" strokeWidth="1.4"/>
          <circle cx="4.5" cy="12" r="1" className="fill-accent"/>
        </svg>
      ),
    },
    {
      label: 'Income (Mar)',
      value: fmtINR(stats.thisInc),
      sub: `Feb was ${fmtINR(stats.prevInc)}`,
      trend: stats.prevInc ? (stats.thisInc - stats.prevInc) / stats.prevInc * 100 : null,
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 14V4M5 8l4-4 4 4" className="stroke-green" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: 'Expenses (Mar)',
      value: fmtINR(stats.thisExp),
      sub: `Feb was ${fmtINR(stats.prevExp)}`,
      trend: stats.prevExp ? -(stats.thisExp - stats.prevExp) / stats.prevExp * 100 : null,
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 4v10M5 10l4 4 4-4" className="stroke-red" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: 'Savings Rate',
      value: stats.savingsRate.toFixed(1) + '%',
      sub: `Prev month ${stats.prevSavings.toFixed(1)}%`,
      trend: stats.savingsRate - stats.prevSavings,
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7" className="stroke-blue" strokeWidth="1.4"/>
          <path d="M6 9l2 2 4-4" className="stroke-blue" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6">
      {cards.map((c, i) => (
        <div key={i} className="card-hover card-base">
          <div className="flex justify-between items-start mb-3.5">
            <span className="text-[.75rem] text-muted font-medium tracking-[0.4px] uppercase">
              {c.label}
            </span>
            {c.icon}
          </div>
          <div className="font-mono text-[1.5rem] font-semibold text-text tracking-[-0.5px] mb-2.5">
            {c.value}
          </div>
          <div className="flex items-center gap-2 flex-wrap min-h-5.5">
            <span className="text-[.75rem] text-muted">{c.sub}</span>
            {c.trend !== null && <Trend value={c.trend} />}
          </div>
        </div>
      ))}
    </div>
  )
}
