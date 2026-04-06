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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5 mb-6">
        <div className="card-base flex flex-col gap-1.5">
          <span className="text-[0.688rem] text-muted uppercase tracking-[0.4px] font-medium">Total Transactions</span>
          <span className="text-[1.5rem] font-bold text-text font-mono">{transactions.length}</span>
        </div>
        <div className="card-base flex flex-col gap-1.5">
          <span className="text-[.688rem] text-muted uppercase tracking-[0.4px] font-medium">Total Income</span>
          <span className="text-[1.5rem] font-bold text-green font-mono">{fmtINR(totalIncome)}</span>
        </div>
        <div className="card-base flex flex-col gap-1.5">
          <span className="text-[.688rem] text-muted uppercase tracking-[0.4px] font-medium">Total Expenses</span>
          <span className="text-[1.5rem] font-bold text-red font-mono">{fmtINR(totalExpense)}</span>
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
