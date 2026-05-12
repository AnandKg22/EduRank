Role: Senior Full-Stack Developer & Cloud Architect.
Goal: Build a real-time EduRank application using Vite + React (Frontend), Supabase (Backend/Realtime), and GitHub/Vercel (CI/CD).
Technical Requirements:

1.  Frontend: Use React (Vite) with Tailwind CSS. Implement a real-time leaderboard and live ranking dashboard that listens to live data changes using the @supabase/supabase-js library.
2.  Real-time Engine: Use Supabase Realtime. Configure a supabase.channel() to listen for INSERT, UPDATE, and DELETE events on a database table named edurank_scores.
3.  Local Environment: Ensure the code uses .env.local for environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).
4.  Deployment Path: Provide instructions to connect the GitHub repository to Vercel, including setting up the production environment variables.

Code Specifications:

- Create a custom React hook called useRealtimeData to manage the Supabase subscription lifecycle for EduRank.
- Include basic Supabase client initialization logic.
- Implement a clean UI component to display the ranking updates instantly as scores or student positions change.

Output Needed:

- Complete directory structure.
- Step-by-step setup commands for local development (npm install, etc.).
- App.jsx and supabaseClient.js source code.
- A SQL snippet to create the edurank_scores table and enable Realtime in the Supabase dashboard.
