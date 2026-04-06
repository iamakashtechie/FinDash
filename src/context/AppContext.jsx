/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useMemo, useEffect } from 'react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, INITIAL_TRANSACTIONS, genId } from "../data/mockData";

function getSavedTheme() {
  try {
    return localStorage.getItem('theme') || 'light'
  } catch {
    return 'light'
  }
}

function persistTheme(theme) {
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // Ignore storage failures (private mode/restricted environments)
  }
}

const savedTheme = getSavedTheme()

export function sortTransactions(list, filters) {
  const sorted = [...list]
  sorted.sort((a, b) => {
    const { sortBy, sortOrder } = filters
    let aVal = a[sortBy === 'amount' ? 'amount' : sortBy === 'desc' ? 'desc' : 'date']
    let bVal = b[sortBy === 'amount' ? 'amount' : sortBy === 'desc' ? 'desc' : 'date']
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

const initialState = {
  transactions: INITIAL_TRANSACTIONS,
  role: 'admin',               // 'viewer' | 'admin'
  activeTab: 'overview',       // 'overview' | 'transactions' | 'insights'
  modal: null,                 // null | { mode: 'add' | 'edit', data?: tx }
  theme: savedTheme,
  filters: {
    search: '',
    category: 'all',
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  },
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload }

    case 'SET_THEME':
      persistTheme(action.payload)
      return { ...state, theme: action.payload }

    case 'SET_TAB':
      return { ...state, activeTab: action.payload }

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } }

    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters }

    case 'OPEN_MODAL':
      return { ...state, modal: action.payload }

    case 'CLOSE_MODAL':
      return { ...state, modal: null }

    case 'ADD_TRANSACTION': {
      const tx = { ...action.payload, id: genId() }
      return { ...state, transactions: [...state.transactions, tx], modal: null }
    }

    case 'UPDATE_TRANSACTION': {
      const validCats = action.payload.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
      if (!validCats.includes(action.payload.cat)) {
        return state
      }

      const updated = state.transactions.map(t =>
        t.id === action.payload.id ? action.payload : t
      )
      return { ...state, transactions: updated, modal: null }
    }

    case 'DELETE_TRANSACTION': {
      const filtered = state.transactions.filter(t => t.id !== action.payload)
      return { ...state, transactions: filtered }
    }

    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (state.theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(isDark ? 'dark' : 'light')

      const listener = (e) => {
        if (state.theme === 'system') {
          root.classList.remove('light', 'dark')
          root.classList.add(e.matches ? 'dark' : 'light')
        }
      }

      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      mql.addEventListener('change', listener)
      return () => mql.removeEventListener('change', listener)
    } else {
      root.classList.add(state.theme === 'dark' ? 'dark' : 'light')
    }

  }, [state.theme])

  const filteredTransactions = useMemo(() => {
    let list = [...state.transactions]

    if (state.filters.search) {
      const q = state.filters.search.toLowerCase()
      list = list.filter(t => t.desc.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q))
    }

    if (state.filters.category !== 'all') {
      list = list.filter(t => t.cat === state.filters.category)
    }

    if (state.filters.type !== 'all') {
      list = list.filter(t => t.type === state.filters.type)
    }

    list = sortTransactions(list, state.filters)

    return list
  }, [state.transactions, state.filters])

  const value = {
    ...state,
    filteredTransactions,
    dispatch,
    isAdmin: state.role === 'admin',
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}