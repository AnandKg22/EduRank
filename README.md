# ⚡ EduRank — Real-Time PvP Academic Combat Arena

EduRank is a synchronous, real-time PvP trivia platform where students compete head-to-head in academic duels. Built with **React (Vite)**, **Supabase** (Realtime, Auth, PostgreSQL), **Zustand**, **TailwindCSS v4**, and deployed on **Vercel**.

## 🎮 Features

- **Live Duels**: Synchronous PvP — same question, same time, 20-second pressure timer
- **Smart Matchmaking**: Priority matching by department + ELO proximity, bot fallback after 30s
- **ELO Rating System**: 5 engineering-themed tiers (Resistor → Superconductor)
- **Real-Time Leaderboard**: Live rankings via Supabase Postgres Changes
- **Online Presence**: See who's online, searching, or battling
- **Anti-Cheat**: Forfeit detection via Presence, forced-progression timer
- **Dark Cyberpunk UI**: Glassmorphism, neon glows, smooth animations

---

## 🚀 Local Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd EduRank
npm install
```

### 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → Run `supabase/schema.sql`
3. Go to **Database → Replication** → Ensure `profiles`, `matchmaking_queue`, `battles` have Realtime enabled
4. Go to **Authentication → Settings** → Enable email/password signup
5. Copy your **Project URL** and **Anon Key** from **Settings → API**

### 3. Environment Variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`.

---

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| `profiles` | Player data: username, ELO, tier, W/L/D |
| `questions` | Academic question bank with subjects & difficulty |
| `matchmaking_queue` | Temporary queue for players searching for duels |
| `battles` | Active/completed matches with scores and questions |
| `match_history` | Individual player match records with ELO changes |

---

## 🏗️ Architecture

```
src/
├── lib/              # Supabase client, constants, utilities
├── stores/           # Zustand stores (auth, game, matchmaking, presence)
├── hooks/            # Custom hooks (useRealtimeData, usePresence, useBattleChannel, useCountdown)
├── components/       # UI components organized by feature
│   ├── auth/         # Login, Register, ProtectedRoute
│   ├── battle/       # BattleArena, QuestionCard, TimerBar, ScoreBoard, Results
│   ├── dashboard/    # StatsCards, RankBadge, RecentMatches, EloChart
│   ├── layout/       # AppShell, Navbar, Sidebar
│   ├── leaderboard/  # LeaderboardTable, DepartmentFilter
│   ├── matchmaking/  # FindMatchButton, MatchmakingOverlay, BotFallback
│   ├── presence/     # OnlineSidebar, UserStatusBadge, OnlineCount
│   └── ui/           # Button, Card, Modal, Spinner, Toast, AnimatedNumber
└── pages/            # Route-level page components
```

---

## 🌐 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Import Project** → Select your repo
3. **Framework Preset**: Vite
4. **Environment Variables**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**

---

## 🧩 Tech Stack

| Technology | Usage |
|---|---|
| React 19 + Vite | Frontend framework + build tool |
| Tailwind CSS v4 | Styling with CSS-first configuration |
| Zustand | Lightweight global state management |
| Supabase | Auth, PostgreSQL, Realtime (Broadcast + Presence + Postgres Changes) |
| Framer Motion | Animations and transitions |
| Recharts | ELO progression charts |
| React Router v7 | Client-side routing |

---

## 📜 License

MIT
