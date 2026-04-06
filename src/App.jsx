import { AppProvider, useApp } from './context/AppContext'
import Header from './components/Header'
import OverviewPage from './pages/OverviewPage'
import TransactionsPage from './pages/TransactionsPage'
import InsightsPage from './pages/InsightsPage'
import { monthKey } from './utils'

function PageTitle({ title, sub }) {
  return (
    <div className="mb-7">
      <h1 className="text-[1.625rem] font-bold text-text tracking-[-0.5px] mb-1">
        {title}
      </h1>
      <p className="text-[0.875rem] text-muted">{sub}</p>
    </div>
  )
}

function DashboardContent() {
  const { activeTab, role, transactions } = useApp()

  const latestMonthKey = transactions.reduce((latest, tx) => {
    const txMonth = monthKey(tx.date)
    return txMonth > latest ? txMonth : latest
  }, '0000-00')

  const overviewMonthLabel = latestMonthKey !== '0000-00'
    ? new Date(latestMonthKey + '-01T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'current period'

  const pages = {
    overview: {
      title: 'Overview',
      sub: `Your financial snapshot for ${overviewMonthLabel}`,
      component: <OverviewPage />,
    },
    transactions: {
      title: 'Transactions',
      sub: 'All transactions — search, filter, and manage',
      component: <TransactionsPage />,
    },
    insights: {
      title: 'Insights',
      sub: 'Data-driven observations about your spending',
      component: <InsightsPage />,
    },
  }

  const page = pages[activeTab]

  return (
    <main className="px-5 py-6 md:px-8 md:py-8 lg:pb-16 page-fade mx-auto max-w-7xl">
      <div className="flex justify-between items-start mb-7 flex-wrap gap-3">
        <PageTitle title={page.title} sub={page.sub} />
        <div className="flex items-center gap-2 text-[12px] text-muted bg-card border border-border rounded-lg py-1.5 px-3.5">
          <span className={`w-1.75 h-1.75 rounded-full shrink-0 ${role === 'admin' ? 'bg-accent' : 'bg-blue'}`} />
          <span className="capitalize">{role} access</span>
        </div>
      </div>
      {page.component}
    </main>
  )

}

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <AppProvider>
        <Header />
        <DashboardContent />
      </AppProvider>
    </div>
  )
}