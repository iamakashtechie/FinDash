# FinDash

A responsive finance dashboard interface built for the frontend screening assignment. The goal was to create a clean, intuitive UI that will allow users to track financial activity, view data visualizations, and manage transactions without a backend.

## Features

- **Dashboard Overview:** Quick summary cards (Balance, Income, Expenses), a balance trend chart, and a categorical spending breakdown.
- **Transactions Management:** A central table where you can search, sort, and filter through all your transactions by category or type.
- **Simulated Roles:** I added a quick toggle in the header to switch between 'Admin' and 'Viewer' modes. Viewers just see the data, while Admins get the UI controls to actually add or remove transactions.
- **Data Insights:** An automated insights section that pulls data from your transactions to calculate top spending categories, best savings months, and monthly expense trends.
- **Dark/Light Mode:** Full support for dark and light modes, and it remembers your choice via local storage.

## Tech Stack & Approach

- **Framework:** React + Vite
- **Styling:** Tailwind CSS. I went with Tailwind because it allows for rapid UI building and makes it incredibly easy to keep the layout responsive across different screen sizes.
- **Context API + `useReducer`:** Instead of bringing in Redux or Zustand for a project of this scope, I just went with native React state. One global reducer handles the mock data, active filters, and UI states elegantly.
- **Charts:** Recharts. Selected for its straightforward React API and easy customization.

## Assumptions & Trade-offs

Since the assignment emphasized focusing on UI/UX and demonstrating frontend architecture rather than building a production-ready full-stack app, I made a few practical assumptions to keep things streamlined:

- **In-Memory Data:** Because there's no real backend, all the transaction data is seeded locally. Any new transactions you add will show up instantly, but a hard page refresh will reset them.
- **Faking the Auth:** Rather than building an actual login flow or RBAC system, I used the 'Admin/Viewer' toggle in the header as a stand-in. It was a quick way to demonstrate how the UI adapts (hiding action buttons) based on permission levels.

## Running it locally

1. Clone the repository and navigate into the project folder.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the local development server:

   ```bash
   npm run dev
   ```
