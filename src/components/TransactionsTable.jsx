import { useApp } from '../context/AppContext'
import { fmtINR, fmtDate } from '../utils'
import { ALL_CATEGORIES, CATEGORY_COLORS, CAT_ICONS } from '../data/mockData'

export default function TransactionsTable() {
  const { filteredTransactions, filters, isAdmin, dispatch } = useApp()

  const setFilter = (key, val) => {
    dispatch({ type: 'SET_FILTER', payload: { [key]: val } })
  }

  const toggleSort = (col) => {
    if (filters.sortBy === col) {
      setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      dispatch({ type: 'SET_FILTER', payload: { sortBy: col, sortOrder: 'desc' } })
    }
  }

  const sortIcon = (col) => {
    if (filters.sortBy !== col) return <span className="text-dim">↕</span>
    return <span className="text-accent">{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id })
    }
  }

  const COLS = [
    { key: 'date', label: 'Date',        sortable: true,  w: '110px' },
    { key: 'desc', label: 'Description', sortable: true,  w: 'auto'  },
    { key: 'cat',  label: 'Category',    sortable: false, w: '160px' },
    { key: 'type', label: 'Type',        sortable: false, w: '90px'  },
    { key: 'amount',label: 'Amount',     sortable: true,  w: '130px' },
    ...(isAdmin ? [{ key: 'actions', label: '', sortable: false, w: '90px' }] : []),
  ]

  return (
    <div>
      {/* Filter bar */}
      <div className="flex gap-3 flex-wrap mb-4 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-50">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted text-[14px]">🔍</span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            className="w-full bg-card border border-border rounded-lg py-1.75 pr-3 pl-8 text-[.813rem] text-text font-[inherit]"
          />
        </div>

        {/* Category filter */}
        <select
          value={filters.category}
          onChange={e => setFilter('category', e.target.value)}
          className="bg-card border border-border rounded-lg py-1.75 px-3 text-[.813rem] text-text font-[inherit]"
        >
          <option value="all">All Categories</option>
          {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Type filter */}
        <select
          value={filters.type}
          onChange={e => setFilter('type', e.target.value)}
          className="bg-card border border-border rounded-lg py-1.75 px-3 text-[.813rem] text-text font-[inherit]"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Reset */}
        <button
          onClick={() => dispatch({ type: 'RESET_FILTERS' })}
          className="bg-card border border-border rounded-lg py-1.75 px-3 text-[.813rem] text-muted cursor-pointer font-[inherit]"
        >
          Reset
        </button>

        {/* Admin: Add transaction */}
        {isAdmin && (
          <button
            onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { mode: 'add' } })}
            className="bg-accent border-none rounded-lg py-1.75 px-3 text-[.813rem] font-bold text-[#070C18] cursor-pointer font-[inherit] shrink-0"
          >
            + Add Transaction
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-[12px] text-muted mb-3">
        Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
      </p>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="card-base text-center py-12">
          <p className="text-[2rem] mb-3">🔍</p>
          <p className="text-text font-medium">No transactions found</p>
          <p className="text-muted text-[.813rem] mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-150">
            <thead>
              <tr className="border-b border-border">
                {COLS.map(col => (
                  <th
                    key={col.key}
                    onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                    className={
                      `py-2.5 px-4 text-[.75rem] font-semibold text-muted tracking-[0.4px] uppercase sticky top-0 bg-surface z-10 whitespace-nowrap
                      ${col.key === 'amount' ? 'text-right' : 'text-left'}
                      ${col.sortable ? 'cursor-pointer' : 'cursor-default'} 
                      select-none`
                    }
                    style={{ width: col.w }}
                  >
                    {col.label} {col.sortable && sortIcon(col.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, i) => (
                <tr
                  key={tx.id}
                  className={`border-b border-border transition-colors duration-100 ${i % 2 === 0 ? 'bg-transparent hover:bg-elevated' : 'bg-white/5 hover:bg-elevated'}`}
                >
                  <td className="py-3 px-4 text-[.813rem] text-muted font-mono whitespace-nowrap">
                    {fmtDate(tx.date)}
                  </td>
                  <td className="py-3 px-4 text-[.813rem] text-text font-medium">
                    {tx.desc}
                  </td>
                  <td className="py-3 px-4">
                    <span 
                      className="inline-flex items-center gap-1.5 text-[.75rem] py-0.75 px-2.5 rounded-[1.25rem] whitespace-nowrap"
                      style={{ 
                        background: (CATEGORY_COLORS[tx.cat] || '#666') + '18',
                        color: CATEGORY_COLORS[tx.cat] || 'var(--muted)'
                      }}
                    >
                      <span className="text-[12px]">{CAT_ICONS[tx.cat]}</span>
                      {tx.cat}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[.75rem] font-semibold py-0.75 px-2.5 rounded-[1.25rem] capitalize ${tx.type === 'income' ? 'bg-greenBg text-green' : 'bg-redBg text-red'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right text-[.875rem] font-semibold font-mono whitespace-nowrap ${tx.type === 'income' ? 'text-green' : 'text-red'}`}>
                    {tx.type === 'income' ? '+' : '−'}{fmtINR(tx.amount)}
                  </td>
                  {isAdmin && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => dispatch({ type: 'OPEN_MODAL', payload: { mode: 'edit', data: tx } })}
                          title="Edit"
                          className="bg-dim border-none rounded-md py-1 px-2.5 text-[.75rem] text-muted cursor-pointer font-[inherit]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          title="Delete"
                          className="bg-redBg border-none rounded-md py-1 px-2.5 text-[.75rem] text-red cursor-pointer font-[inherit]"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
