export const CATEGORY_COLORS = {
  'Food & Dining': '#F59E0B',
  'Transport': '#4D9EFF',
  'Entertainment': '#A855F7',
  'Utilities': '#2DD4BF',
  'Healthcare': '#F472B6',
  'Shopping': '#22D07A',
  'Subscriptions': '#FF6B6B',
  'Education': '#60A5FA',
  'Salary': '#7CFF6B',
  'Freelance': '#22D07A',
  'Investment': '#4D9EFF',
  'Other Income': '#A855F7',
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining', 'Transport', 'Entertainment', 'Utilities',
  'Healthcare', 'Shopping', 'Subscriptions', 'Education',
]

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Other Income']

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export const CAT_ICONS = {
  'Food & Dining': '🍽️',
  'Transport': '🚗',
  'Entertainment': '🎬',
  'Utilities': '⚡',
  'Healthcare': '💊',
  'Shopping': '🛍️',
  'Subscriptions': '📺',
  'Education': '📚',
  'Salary': '💼',
  'Freelance': '💻',
  'Investment': '📈',
  'Other Income': '💰',
}

let _nextId = 56

export function genId() {
  return 't' + (_nextId++)
}

export const INITIAL_TRANSACTIONS = [
  // Oct 2025
  { id: 't1',  date: '2025-10-01', desc: 'Monthly Salary',       cat: 'Salary',        type: 'income',  amount: 85000.00 },
  { id: 't2',  date: '2025-10-03', desc: 'Whole Foods Market',   cat: 'Food & Dining', type: 'expense', amount: 2400.00  },
  { id: 't3',  date: '2025-10-05', desc: 'Uber Rides',           cat: 'Transport',     type: 'expense', amount: 350.00   },
  { id: 't4',  date: '2025-10-08', desc: 'Netflix + Spotify',    cat: 'Subscriptions', type: 'expense', amount: 649.00   },
  { id: 't5',  date: '2025-10-10', desc: 'Electricity Bill',     cat: 'Utilities',     type: 'expense', amount: 1850.00  },
  { id: 't6',  date: '2025-10-12', desc: 'Restaurant Dinner',    cat: 'Food & Dining', type: 'expense', amount: 1200.00  },
  { id: 't7',  date: '2025-10-15', desc: 'Freelance Project',    cat: 'Freelance',     type: 'income',  amount: 15000.00 },
  { id: 't8',  date: '2025-10-18', desc: 'Amazon Shopping',      cat: 'Shopping',      type: 'expense', amount: 1850.00  },
  { id: 't9',  date: '2025-10-22', desc: 'Movie Tickets',        cat: 'Entertainment', type: 'expense', amount: 600.00   },
  { id: 't10', date: '2025-10-25', desc: 'Grocery Run',          cat: 'Food & Dining', type: 'expense', amount: 1950.00  },
  { id: 't11', date: '2025-10-28', desc: 'Internet Bill',        cat: 'Utilities',     type: 'expense', amount: 999.00   },
  // Nov 2025
  { id: 't12', date: '2025-11-01', desc: 'Monthly Salary',       cat: 'Salary',        type: 'income',  amount: 85000.00 },
  { id: 't13', date: '2025-11-04', desc: 'Coffee Shops',         cat: 'Food & Dining', type: 'expense', amount: 450.00   },
  { id: 't14', date: '2025-11-06', desc: 'Gas Station',          cat: 'Transport',     type: 'expense', amount: 2000.00  },
  { id: 't15', date: '2025-11-09', desc: 'Diwali Shopping',      cat: 'Shopping',      type: 'expense', amount: 6500.00  },
  { id: 't16', date: '2025-11-12', desc: 'Doctor Visit',         cat: 'Healthcare',    type: 'expense', amount: 800.00   },
  { id: 't17', date: '2025-11-15', desc: 'Freelance Design',     cat: 'Freelance',     type: 'income',  amount: 12000.00 },
  { id: 't18', date: '2025-11-18', desc: 'Restaurant Lunch',     cat: 'Food & Dining', type: 'expense', amount: 550.00   },
  { id: 't19', date: '2025-11-22', desc: 'Electricity Bill',     cat: 'Utilities',     type: 'expense', amount: 1750.00  },
  { id: 't20', date: '2025-11-25', desc: 'Online Course',        cat: 'Education',     type: 'expense', amount: 1999.00  },
  { id: 't21', date: '2025-11-28', desc: 'Grocery Store',        cat: 'Food & Dining', type: 'expense', amount: 2200.00  },
  // Dec 2025
  { id: 't22', date: '2025-12-01', desc: 'Monthly Salary',       cat: 'Salary',        type: 'income',  amount: 85000.00 },
  { id: 't23', date: '2025-12-03', desc: 'Year-end Bonus',       cat: 'Salary',        type: 'income',  amount: 50000.00 },
  { id: 't24', date: '2025-12-05', desc: 'Christmas Shopping',   cat: 'Shopping',      type: 'expense', amount: 4500.00  },
  { id: 't25', date: '2025-12-10', desc: 'Restaurant Dinner',    cat: 'Food & Dining', type: 'expense', amount: 1800.00  },
  { id: 't26', date: '2025-12-14', desc: 'Movie + Popcorn',      cat: 'Entertainment', type: 'expense', amount: 950.00   },
  { id: 't27', date: '2025-12-18', desc: 'Internet Bill',        cat: 'Utilities',     type: 'expense', amount: 999.00   },
  { id: 't28', date: '2025-12-20', desc: 'Pharmacy',             cat: 'Healthcare',    type: 'expense', amount: 450.00   },
  { id: 't29', date: '2025-12-25', desc: 'Holiday Dinner',       cat: 'Food & Dining', type: 'expense', amount: 2500.00  },
  { id: 't30', date: '2025-12-28', desc: 'Gym Membership',       cat: 'Subscriptions', type: 'expense', amount: 1500.00  },
  // Jan 2026
  { id: 't31', date: '2026-01-01', desc: 'Monthly Salary',       cat: 'Salary',        type: 'income',  amount: 85000.00 },
  { id: 't32', date: '2026-01-05', desc: 'New Year Groceries',   cat: 'Food & Dining', type: 'expense', amount: 2800.00  },
  { id: 't33', date: '2026-01-08', desc: 'Transport Card',       cat: 'Transport',     type: 'expense', amount: 1000.00  },
  { id: 't34', date: '2026-01-12', desc: 'Electricity Bill',     cat: 'Utilities',     type: 'expense', amount: 1650.00  },
  { id: 't35', date: '2026-01-15', desc: 'Freelance Web Dev',    cat: 'Freelance',     type: 'income',  amount: 18000.00 },
  { id: 't36', date: '2026-01-18', desc: 'Clothing Store',       cat: 'Shopping',      type: 'expense', amount: 3500.00  },
  { id: 't37', date: '2026-01-22', desc: 'Netflix + Adobe CC',   cat: 'Subscriptions', type: 'expense', amount: 1250.00  },
  { id: 't38', date: '2026-01-25', desc: 'Restaurant Weekend',   cat: 'Food & Dining', type: 'expense', amount: 1400.00  },
  // Feb 2026
  { id: 't39', date: '2026-02-01', desc: 'Monthly Salary',       cat: 'Salary',        type: 'income',  amount: 85000.00 },
  { id: 't40', date: '2026-02-05', desc: "Valentine's Dinner",   cat: 'Food & Dining', type: 'expense', amount: 3200.00  },
  { id: 't41', date: '2026-02-08', desc: 'Pharmacy',             cat: 'Healthcare',    type: 'expense', amount: 550.00   },
  { id: 't42', date: '2026-02-12', desc: 'Grocery Store',        cat: 'Food & Dining', type: 'expense', amount: 2100.00  },
  { id: 't43', date: '2026-02-15', desc: 'Internet Bill',        cat: 'Utilities',     type: 'expense', amount: 999.00   },
  { id: 't44', date: '2026-02-18', desc: 'Concert Tickets',      cat: 'Entertainment', type: 'expense', amount: 2500.00  },
  { id: 't45', date: '2026-02-22', desc: 'Freelance Consulting', cat: 'Freelance',     type: 'income',  amount: 8500.00  },
  { id: 't46', date: '2026-02-25', desc: 'Online Shopping',      cat: 'Shopping',      type: 'expense', amount: 1800.00  },
  // Mar 2026
  { id: 't47', date: '2026-03-01', desc: 'Monthly Salary',       cat: 'Salary',        type: 'income',  amount: 85000.00 },
  { id: 't48', date: '2026-03-05', desc: 'Grocery Run',          cat: 'Food & Dining', type: 'expense', amount: 2450.00  },
  { id: 't49', date: '2026-03-08', desc: 'Uber & Lyft',          cat: 'Transport',     type: 'expense', amount: 800.00   },
  { id: 't50', date: '2026-03-12', desc: 'Electricity Bill',     cat: 'Utilities',     type: 'expense', amount: 2150.00  },
  { id: 't51', date: '2026-03-15', desc: 'Freelance Project',    cat: 'Freelance',     type: 'income',  amount: 25000.00 },
  { id: 't52', date: '2026-03-18', desc: 'Spring Shopping',      cat: 'Shopping',      type: 'expense', amount: 4500.00  },
  { id: 't53', date: '2026-03-22', desc: 'Coffee & Dining',      cat: 'Food & Dining', type: 'expense', amount: 850.00   },
  { id: 't54', date: '2026-03-25', desc: 'Gym + Streaming',      cat: 'Subscriptions', type: 'expense', amount: 1800.00  },
  { id: 't55', date: '2026-03-28', desc: 'Doctor Checkup',       cat: 'Healthcare',    type: 'expense', amount: 1200.00  },
]

export const MONTH_LABELS = {
  '2025-10': 'Oct 25', '2025-11': 'Nov 25', '2025-12': 'Dec 25',
  '2026-01': 'Jan 26', '2026-02': 'Feb 26', '2026-03': 'Mar 26',
}
