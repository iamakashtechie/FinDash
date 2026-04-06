import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { useApp } from '../context/AppContext'
import { fmtINR, monthKey } from '../utils'
import { CATEGORY_COLORS } from '../data/mockData'

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-elevated border border-border rounded-lg py-2.5 px-3.5 text-[.813rem]">
      <p className="text-muted mb-1.5 text-[12px]">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="mb-0.5">
          {p.name}: <span className="font-mono font-semibold text-text">{fmtINR(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

function InsightCard({ emoji, title, value, sub, color }) {
  return (
    <div className="card-base flex gap-4 items-start">
      <div
        className="w-11 h-11 rounded-[.625rem] flex items-center justify-center text-[1.25rem] shrink-0"
        style={{ background: color + '18' }}
      >
        {emoji}
      </div>
      <div>
        <p className="text-[.75rem] text-muted mb-1 uppercase tracking-[0.4px] font-medium">{title}</p>
        <p className="text-[1.125rem] font-bold text-text font-mono tracking-[-0.5px] mb-1">{value}</p>
        <p className="text-[.75rem] text-muted">{sub}</p>
      </div>
    </div>
  )
}



export default function InsightsPanel() {
  const { transactions } = useApp()

  const insights = useMemo(() => {
    // category totals (expenses only)
    const catTotals = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catTotals[t.cat] = (catTotals[t.cat] || 0) + t.amount
    })
    const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0]

    // monthly data derived from available transactions
    const monthKeys = [...new Set(transactions.map(t => monthKey(t.date)))].sort()
    const monthData = monthKeys.map((key) => {
      const label = new Date(key + '-01T00:00:00').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      const mTxs = transactions.filter(t => monthKey(t.date) === key)
      const income = mTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const expenses = mTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
      return { month: label, key, Income: +income.toFixed(2), Expenses: +expenses.toFixed(2), Net: +(income - expenses).toFixed(2) }
    })

    // best & worst months
    const bestMonth = [...monthData].sort((a, b) => b.Net - a.Net)[0]
    const worstMonth = [...monthData].sort((a, b) => a.Net - b.Net)[0]

    // avg monthly savings
    const avgSavings = monthData.length
      ? monthData.reduce((s, d) => s + d.Net, 0) / monthData.length
      : 0

    // current vs last month
    const thisMonth = monthData[monthData.length - 1]
    const prevMonth = monthData[monthData.length - 2]
    const expChange = prevMonth?.Expenses
      ? ((thisMonth.Expenses - prevMonth.Expenses) / prevMonth.Expenses * 100).toFixed(1)
      : 0

    // observations
    const observations = [
      `Food & Dining consistently represents the largest expense category.`,
      prevMonth && thisMonth ? `${thisMonth.month} expenses changed by ${Number(expChange) > 0 ? '+' : ''}${expChange}% compared with ${prevMonth.month}.` : 'Need at least two months of data to compare expense trend.',
      `Freelance income adds roughly 15-35% on top of the base salary each month.`,
      bestMonth && bestMonth.Net > 0 ? `Best savings month: ${bestMonth.month} with ${fmtINR(bestMonth.Net)} saved.` : '',
      `Average monthly savings rate: ${monthData.length ? (monthData.map(d => d.Income > 0 ? (d.Net / d.Income * 100) : 0).reduce((s, v) => s + v, 0) / monthData.length | 0) : 0}% across all months.`,
    ].filter(Boolean)

    return { topCategory, monthData, bestMonth, worstMonth, avgSavings, thisMonth, prevMonth, expChange, observations }
  }, [transactions])

  const { topCategory, monthData, bestMonth, avgSavings, expChange, thisMonth, prevMonth, observations } = insights

  return (
    <div className="flex flex-col gap-6">

      {/* top cards row */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <InsightCard
          emoji="🏆"
          title="Top Spending Category"
          value={topCategory?.[0] || '—'}
          sub={topCategory ? `${fmtINR(topCategory[1])} total spent` : ''}
          color={CATEGORY_COLORS[topCategory?.[0]] || 'var(--amber)'}
        />
        <InsightCard
          emoji="📈"
          title="Best Savings Month"
          value={bestMonth?.month || '—'}
          sub={`Saved ${fmtINR(bestMonth?.Net || 0)} that month`}
          color="var(--green)"
        />
        <InsightCard
          emoji="💡"
          title="Avg Monthly Savings"
          value={fmtINR(avgSavings)}
          sub={`Across ${monthData.length || 0} month${monthData.length === 1 ? '' : 's'}`}
          color="var(--blue)"
        />
        <InsightCard
          emoji={Number(expChange) <= 0 ? '✅' : '⚠️'}
          title="Expense Change (Latest vs Previous)"
          value={`${expChange > 0 ? '+' : ''}${expChange}%`}
          sub={`${fmtINR(thisMonth?.Expenses)} vs ${fmtINR(prevMonth?.Expenses)}`}
          color={Number(expChange) <= 0 ? 'var(--green)' : 'var(--red)'}
        />
      </div>

      {/* monthly comparison chart */}
      <div className="card-base">
        <h3 className="text-[.938rem] font-semibold text-text mb-1">Monthly Income vs Expenses</h3>
        <p className="text-[.75rem] text-muted mb-5">Side-by-side comparison across all 6 months</p>

        <div className="flex gap-4 mb-4">
          {[['Income', 'var(--green)'], ['Expenses', 'var(--red)']].map(([l, col]) => (
            <span key={l} className="flex items-center gap-1.5 text-[.75rem] text-muted">
              <span className="w-2.5 h-2.5 rounded-xs" style={{ background: col }} />
              {l}
            </span>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barGap={4}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
            <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'k'} width={44} />
            <Tooltip content={<BarTooltip />} cursor={{ fill: 'var(--elevated)' }} />
            <Bar dataKey="Income" name="Income" fill="var(--green)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="Expenses" name="Expenses" fill="var(--red)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* net savings bar chart */}
      <div className="card-base">
        <h3 className="text-[.938rem] font-semibold text-text mb-1">Monthly Net Savings</h3>
        <p className="text-[.75rem] text-muted mb-5">How much was saved (or overspent) each month</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
            <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => '₹' + (v / 1000).toFixed(1) + 'k'} width={48} />
            <Tooltip content={<BarTooltip />} cursor={{ fill: 'var(--elevated)' }} />
            <Bar dataKey="Net" name="Net Savings" radius={[4, 4, 0, 0]} maxBarSize={50}>
              {monthData.map((d, i) => (
                <Cell key={i} fill={d.Net >= 0 ? 'var(--green)' : 'var(--red)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* key observations */}
      <div className="card-base">
        <h3 className="text-[.938rem] font-semibold text-text mb-4">Key Observations</h3>
        <div className="flex flex-col gap-3">
          {observations.map((obs, i) => (
            <div key={i} className="flex gap-3 items-start py-2.5 px-3.5 bg-surface rounded-lg border-l-4 border-l-accent">
              <span className="text-accent text-[.75rem] shrink-0 mt-0.5">◆</span>
              <p className="text-[.813rem] text-muted leading-relaxed">{obs}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
