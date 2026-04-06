import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/mockData'

export default function TransactionModal() {
  const { modal, dispatch } = useApp()

  const isEdit = modal?.mode === 'edit'
  const existing = modal?.data

  const createInitialForm = (tx) => ({
    date: tx?.date || new Date().toISOString().slice(0, 10),
    desc: tx?.desc || '',
    cat: tx?.cat || 'Food & Dining',
    type: tx?.type || 'expense',
    amount: tx?.amount || '',
  })

  const [form, setForm] = useState(() => createInitialForm(existing))
  const [error, setError] = useState('')
  const [prevExisting, setPrevExisting] = useState(existing)
  const [prevMode, setPrevMode] = useState(modal?.mode)

  if (existing !== prevExisting || modal?.mode !== prevMode) {
    setPrevExisting(existing)
    setPrevMode(modal?.mode)
    setForm(createInitialForm(existing))
    setError('')
  }

  const cats = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleTypeChange = (newType) => {
    setForm((prev) => {
      const validCats = newType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
      const newCat = validCats.includes(prev.cat) ? prev.cat : validCats[0]
      return { ...prev, type: newType, cat: newCat }
    })
  }

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = () => {
    const desc = form.desc.trim()
    const amountNum = Number(form.amount)
    const today = new Date().toISOString().slice(0, 10)
    const validCats = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

    if (!desc) return setError('Description is required.')
    if (desc.length > 100) return setError('Description must be 100 characters or fewer.')
    if (!form.amount || Number.isNaN(amountNum) || amountNum <= 0)
      return setError('Enter a valid positive amount.')
    if (amountNum > 9999999) return setError('Amount is too large.')
    if (!form.date || form.date > today) return setError('Date cannot be in the future.')
    if (!validCats.includes(form.cat)) return setError('Category does not match selected type.')

    setError('')

    const tx = { ...form, desc, amount: parseFloat(amountNum.toFixed(2)) }

    if (isEdit) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { ...existing, ...tx } })
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: tx })
    }
  }

  const close = () => dispatch({ type: 'CLOSE_MODAL' })

  // Overlay click to close
  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) close()
  }

  if (!modal) return null;

  return (
    <div
      onClick={onOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-modal-title"
      className="fixed inset-0 bg-[#070C18CC] flex items-center justify-center z-100 p-6"
    >
      <div className="bg-card border border-border rounded-2xl p-7 w-full max-w-115 max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 id="transaction-modal-title" className="text-[18px] font-bold text-text">
            {isEdit ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button
            onClick={close}
            aria-label="Close dialog"
            className="bg-elevated border-none rounded-lg w-8 h-8 text-[18px] text-muted cursor-pointer flex items-center justify-center"
          >
            x
          </button>
        </div>

        {/* Type toggle */}
        <div className="mb-5">
          <label className="text-[.75rem] text-muted block mb-2 font-medium uppercase tracking-[0.4px]">
            Type
          </label>
          <div className="flex bg-elevated border border-border rounded-[10px] p-0.75 gap-0.75">
            {['expense', 'income'].map(t => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`flex-1 p-2 text-[13px] font-semibold font-[inherit] rounded-lg border-none capitalize cursor-pointer transition-all duration-150 ${form.type === t ? (t === 'income' ? 'bg-green text-[#070C18]' : 'bg-red text-[#070C18]') : 'bg-transparent text-muted'}`}
              >
                {t === 'income' ? '↑ Income' : '↓ Expense'}
              </button>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="tx-desc" className="text-[.75rem] text-muted block mb-1.5 font-medium uppercase tracking-[0.4px]">
              Description
            </label>
            <input 
              id="tx-desc"
              type="text" value={form.desc} onChange={set('desc')} 
              placeholder="e.g. Coffee at Starbucks" 
              className="bg-elevated border border-border rounded-lg py-2.25 px-3 text-[.875rem] text-text w-full font-[inherit]" 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="tx-amount" className="text-[.75rem] text-muted block mb-1.5 font-medium uppercase tracking-[0.4px]">
                Amount (INR)
              </label>
              <input
                id="tx-amount"
                type="number" value={form.amount} onChange={set('amount')}
                placeholder="0.00" min="0" step="0.01"
                className="bg-elevated border border-border rounded-lg py-2.25 px-3 text-[.875rem] text-text w-full font-mono"
              />
            </div>
            <div>
              <label htmlFor="tx-date" className="text-[.75rem] text-muted block mb-1.5 font-medium uppercase tracking-[0.4px]">
                Date
              </label>
              <input 
                id="tx-date"
                type="date" value={form.date} onChange={set('date')} 
                className="bg-elevated border border-border rounded-lg py-2.25 px-3 text-[.875rem] text-text w-full font-[inherit]" 
              />
            </div>
          </div>

          <div>
            <label htmlFor="tx-cat" className="text-[.75rem] text-muted block mb-1.5 font-medium uppercase tracking-[0.4px]">
              Category
            </label>
            <select 
              id="tx-cat"
              value={form.cat} onChange={set('cat')} 
              className="bg-elevated border border-border rounded-lg py-2.25 px-3 text-[.875rem] text-text w-full font-[inherit]"
            >
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-3 text-[.813rem] text-red bg-redBg py-2 px-3 rounded-lg">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 mt-6">
          <button
            onClick={close}
            className="flex-1 py-2.5 text-[.875rem] font-semibold font-[inherit] border border-border rounded-[10px] bg-transparent text-muted cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-2 py-2.5 text-[.875rem] font-bold font-[inherit] border-none rounded-[.625rem] bg-accent text-[#070C18] cursor-pointer"
          >
            {isEdit ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}
