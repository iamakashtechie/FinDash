import TransactionsTable from '../components/TransactionsTable'
import TransactionModal from '../components/TransactionModal'
import { useApp } from '../context/AppContext'
import { fmtINR } from '../utils'

export default function TransactionsPage() {
  const { transactions, isAdmin } = useApp()

  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div>
      {/* Quick stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-6">
        <div className="card-hover card-base flex flex-col">
          <span className="text-[.75rem] text-muted font-medium tracking-[0.4px] uppercase mb-2.5">Total Transactions</span>
          <span className="font-mono text-[1.5rem] font-semibold text-text tracking-[-0.5px]">{transactions.length}</span>
        </div>
        <div className="card-hover card-base flex flex-col">
          <span className="text-[.75rem] text-muted font-medium tracking-[0.4px] uppercase mb-2.5">Total Income</span>
          <span className="font-mono text-[1.5rem] font-semibold text-green tracking-[-0.5px]">{fmtINR(totalIncome)}</span>
        </div>
        <div className="card-hover card-base flex flex-col">
          <span className="text-[.75rem] text-muted font-medium tracking-[0.4px] uppercase mb-2.5">Total Expenses</span>
          <span className="font-mono text-[1.5rem] font-semibold text-red tracking-[-0.5px]">{fmtINR(totalExpense)}</span>
        </div>
      </div>

      {/* Role banner for viewers */}
      {!isAdmin && (
        <div className="bg-[#4D9EFF14] border border-[#4D9EFF40] rounded-[.625rem] px-4 py-2.5 text-[.813rem] text-blue mb-4.5 flex gap-2.5 items-center">
          <span>👁</span>
          <span>You're in <strong>Viewer mode</strong> — read-only access. Switch to Admin to add or edit transactions.</span>
        </div>
      )}

      <TransactionsTable />
      <TransactionModal />
    </div>
  )
}
