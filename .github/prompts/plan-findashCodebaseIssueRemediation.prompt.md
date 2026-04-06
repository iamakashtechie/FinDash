## Plan: Findash Codebase Issue Remediation

Prioritize fixing state-safety and runtime resilience first (sorting determinism and localStorage safety), then address UX/data-consistency gaps (hardcoded insight assumptions and modal validation/accessibility), and finally add regression tests around reducer/utils/modal behavior.

**Steps**
1. Phase 1 - Runtime Safety Foundations
2. Update sorting comparator in `AppContext` to always return `-1 | 0 | 1` for deterministic ordering and stable behavior across engines.
3. Harden theme persistence by wrapping both `localStorage.getItem` and `localStorage.setItem` in safe helpers with fallbacks; ensure app still renders when storage is unavailable. *depends on step 2*
4. Add defensive date formatting guard in `fmtDate` for null/invalid inputs to avoid `Invalid Date` leaking into UI. *parallel with step 3*
5. Phase 2 - Data/UX Correctness
6. Replace hardcoded copy in dashboard/insights (month names, month-count assumptions, fixed array indexing) with values derived from available month keys and transaction range.
7. Improve transaction modal validation: date bounds, description max length, amount sanity ceiling, and category/type consistency checks before dispatching.
8. Add baseline dialog accessibility semantics in modal (`role=dialog`, `aria-modal`, label associations, close button label).
9. Phase 3 - Quality Guardrails
10. Add reducer/unit tests for filter sorting and transaction mutations, plus utils tests for date/currency helpers; include at least one modal validation test. *depends on phase 1+2*
11. Run lint and build; perform focused manual QA on sorting, theme switching, add/edit/delete flows, and insights rendering with altered data ranges.

**Relevant files**
- `e:/2.0/Tech/Coding/Projects/MY PROJECTS/findash/src/context/AppContext.jsx` — reducer logic, theme persistence, filtered/sorted transactions
- `e:/2.0/Tech/Coding/Projects/MY PROJECTS/findash/src/utils.js` — date/currency formatting guards
- `e:/2.0/Tech/Coding/Projects/MY PROJECTS/findash/src/components/TransactionModal.jsx` — modal input validation and accessibility attributes
- `e:/2.0/Tech/Coding/Projects/MY PROJECTS/findash/src/components/InsightsPanel.jsx` — brittle month assumptions and index-based observations
- `e:/2.0/Tech/Coding/Projects/MY PROJECTS/findash/src/App.jsx` — hardcoded subtitle period text
- `e:/2.0/Tech/Coding/Projects/MY PROJECTS/findash/src/data/mockData.js` — month label source shape used by insights
- `e:/2.0/Tech/Coding/Projects/MY PROJECTS/findash/package.json` — available verification scripts (`lint`, `build`)

**Verification**
1. Run `npm run lint` and `npm run build`.
2. In Transactions view, verify sorting by Date/Description/Amount is deterministic when equal values exist.
3. Force restricted storage conditions (or simulate storage exception) and verify app still initializes with default theme.
4. In modal, validate rejected future dates, overlong descriptions, invalid/oversized amounts, and type/category mismatches.
5. Validate Insights and page subtitle adapt correctly when month range changes (e.g., add/remove months).
6. Run added tests and confirm reducer/utils/modal edge cases are covered.

**Decisions**
- Included scope: correctness, resilience, accessibility baseline, and missing verification coverage.
- Excluded scope: visual redesign, backend/API integration, and internationalization.
- Priority order: correctness and crash-prevention before refactors or cosmetic improvements.

**Further Considerations**
1. Validation policy: keep future-dated transactions disallowed (strict) or allow with explicit “scheduled transaction” UX.
2. Type safety strategy: add PropTypes incrementally now or plan TypeScript migration in a separate tranche.
3. Data model hardening: optionally enforce category/type invariant in reducer for defense-in-depth even if UI validates first.
