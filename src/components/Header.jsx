import { useState } from "react";
import { useApp } from "../context/AppContext";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "transactions", label: "Transactions" },
  { id: "insights", label: "Insights" },
];

export default function Header() {
  const { role, activeTab, transactions, theme, dispatch } = useApp()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-surface border-b border-border px-7 flex items-center h-15 sticky top-0 z-40">
      {/* logo */}
      <div className="flex items-center gap-2.5 mr-9 shrink-0">
        <div className="w-8 h-8 rounded-[0.563rem] bg-accent flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1.5L14.5 5V11L8 14.5L1.5 11V5L8 1.5Z"
              className="stroke-accentContrast"
              strokeWidth="1.6"
              fill="none"
              strokeLinejoin="round"
            />
            <circle cx="8" cy="8" r="2.5" className="fill-accentContrast" />
          </svg>
        </div>
        <span className="font-bold text-[1.125rem] text-text tracking-[-0.5px]">
          FinDash
        </span>
      </div>

      {/* nav tabs */}
      <nav className="hidden md:flex gap-1 flex-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => dispatch({ type: "SET_TAB", payload: tab.id })}
              className={
                `rounded-lg px-4 py-1.25 text-[.813rem] font-medium font-[inherit] transition-all duration-150 cursor-pointer 
                ${isActive
                  ? "bg-accentBg border-accentBorder border text-accent"
                  : "bg-transparent border-transparent border text-muted"
                }`
              }
            >
              {tab.label}
              {tab.id === "transactions" && (
                <span className="ml-1.5 text-[.688rem] bg-dim text-muted py-px px-1.5 rounded-[.625rem]">
                  {transactions.length}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* theme & role switcher */}
      <div className="hidden md:flex items-center gap-4 shrink-0">
        <div className="flex bg-elevated border border-border rounded-lg p-0.5 gap-0.5">
          {["light", "dark", "system"].map((t) => {
            const isTheme = theme === t;
            return (
              <button
                key={t}
                onClick={() => dispatch({ type: "SET_THEME", payload: t })}
                title={`Theme: ${t}`}
                className={
                  `py-1.5 px-2.5 text-[.875rem] cursor-pointer rounded-md border-none transition-all duration-150
                  ${isTheme
                    ? "bg-surface text-text shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                    : "bg-transparent text-muted shadow-none"
                  }`
                }
              >
                {t === "light" ? "☀️" : t === "dark" ? "🌙" : "⚙️"}
              </button>
            );
          })}
        </div>

        <div className="w-px h-6 bg-border" />

        <div className="flex items-center gap-[.635rem]">
          <span className="text-[.75rem] text-muted font-medium">Role</span>
          <div className="flex bg-elevated border border-border rounded-lg p-0.5 gap-0.5">
            {["viewer", "admin"].map((r) => {
              const isRole = role === r;
              return (
                <button
                  key={r}
                  onClick={() => dispatch({ type: "SET_ROLE", payload: r })}
                  title={
                    r === "viewer"
                      ? "Read-only access"
                      : "Full access: add & edit transactions"
                  }
                  className={
                    `py-1 px-3.5 text-[.75rem] font-medium font-[inherit] cursor-pointer rounded-md border-none capitalize transition-all duration-150
                    ${isRole
                      ? r === "admin"
                        ? "bg-accent text-accentContrast"
                        : "bg-surface text-text"
                      : "bg-transparent text-muted"
                    }`
                  }
                >
                  {r === "admin" ? "⚙ Admin" : "👁 Viewer"}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* hamburger button */}
      <button
        className="md:hidden ml-auto bg-transparent border-none text-text p-2 cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path
            d={isMenuOpen ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-15 bg-surface border-b border-border py-4 px-7 flex flex-col gap-5 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
          <nav className="flex flex-col gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    dispatch({ type: "SET_TAB", payload: tab.id });
                    setIsMenuOpen(false);
                  }}
                  className={
                    `text-left border-none py-3 px-4 rounded-lg text-[.938rem] font-medium font-[inherit]
                    ${
                    isActive
                      ? "bg-accentBg text-accent"
                      : "bg-transparent text-text"
                    }`
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
          <div className="h-px bg-border" />
          <div className="flex justify-between items-center">
            <div className="flex bg-elevated border border-border rounded-lg p-0.5 gap-0.5">
              {["light", "dark", "system"].map((t) => {
                const isTheme = theme === t;
                return (
                  <button
                    key={t}
                    onClick={() => dispatch({ type: "SET_THEME", payload: t })}
                    className={
                      `py-1.5 px-2.5 text-[.875rem] cursor-pointer rounded-md border-none
                      ${
                      isTheme
                        ? "bg-surface text-text"
                        : "bg-transparent text-muted"
                      }`
                    }
                  >
                    {t === "light" ? "☀️" : t === "dark" ? "🌙" : "⚙️"}
                  </button>
                );
              })}
            </div>
            <div className="flex bg-elevated border border-border rounded-lg p-0.5 gap-0.5">
              {["viewer", "admin"].map((r) => {
                const isRole = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => dispatch({ type: "SET_ROLE", payload: r })}
                    className={
                      `py-1 px-3.5 text-[.75rem] font-medium font-[inherit] cursor-pointer rounded-[.325rem] border-none capitalize
                      ${
                      isRole
                        ? r === "admin"
                          ? "bg-accent text-accentContrast"
                          : "bg-surface text-text"
                        : "bg-transparent text-muted"
                      }`
                    }
                  >
                    {r === "admin" ? "⚙ Admin" : "👁 Viewer"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}