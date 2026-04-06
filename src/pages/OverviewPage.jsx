import SummaryCards from '../components/SummaryCards'
import BalanceTrendChart from '../components/BalanceTrendChart'
import SpendingBreakdown from '../components/SpendingBreakdown'
import { useApp } from '../context/AppContext'
import { fmtINR, fmtDate } from '../utils'
import { CATEGORY_COLORS, CAT_ICONS } from '../data/mockData'

function RecentTransactions() {
  const { transactions, dispatch } = useApp()
  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return (
    <div className="card-base mt-6">
      <div className="flex justify-between items-center mb-4.5">
        <h3 className="text-[1rem] font-semibold text-text">Recent Transactions</h3>
        <button
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'transactions' })}
          className="bg-transparent border border-border rounded-[7px] px-3 py-1.25 text-[.75rem] text-muted cursor-pointer transition-transform active:scale-95"
        >
          View all →
        </button>
      </div>
      <div className="flex flex-col gap-0">
        {recent.map((tx, i) => (
          <div
            key={tx.id}
            className={`flex items-center gap-3.5 py-2.75 ${i < recent.length - 1 ? 'border-b border-border' : ''}`}
          >
            <div 
              className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center text-[16px]"
              style={{ background: (CATEGORY_COLORS[tx.cat] || '#666') + '18' }}
            >
              {CAT_ICONS[tx.cat]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-text whitespace-nowrap overflow-hidden text-ellipsis">
                {tx.desc}
              </p>
              <p className="text-[11px] text-muted mt-0.5">{fmtDate(tx.date)}</p>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-[14px] font-semibold font-mono ${tx.type === 'income' ? 'text-green' : 'text-red'}`}>
                {tx.type === 'income' ? '+' : '−'}{fmtINR(tx.amount)}
              </p>
              <p className="text-[11px] text-muted mt-0.5">{tx.cat}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function OverviewPage() {
  return (
    <div>
      <SummaryCards />
      <div className="flex gap-5 flex-wrap">
        <BalanceTrendChart />
        <SpendingBreakdown />
      </div>
      <RecentTransactions />
    </div>
  )
}
