Based on our extensive work and the entire project history, here is a comprehensive breakdown of EduDuel—your high-stakes, real-time academic combat system.

🎮 Core Gameplay Experience
EduDuel is a Synchronous PvP Trivia Platform designed for students to compete in academic subjects. Unlike "ghost" multiplayer games where you just play against a recording, EduDuel is a Live Duel.

Real-Time Duels: You and your opponent see the exact same question at the exact same time.
Turn-Based Sync: The game waits for both players to answer before moving to the next question. This creates a tense, "head-to-head" atmosphere.
20-Second Pressure: Every question has a 20-second timer. Points are awarded for correctness, with a Speed Bonus for answering in the first 10 seconds.
Match Victory: Matches consist of 15 questions (or as configured). The player with the highest total score at the end wins ELO points.
🚀 Key Features

1. Smart Matchmaking
   Live Queue: Uses a Supabase-backed queue to find opponents.
   Priority Matching: The system tries to match you with someone from your same Department (e.g., EEE vs EEE) and a similar ELO Rating first.
   Online Presence: A live sidebar shows exactly who is online, their department, and their current status (Idle, Searching, or Battling).
2. Competitive Ranking (ELO System)
   Themed Tiers: Players progress through engineering-themed ranks:
   Resistor (Bronze)
   Capacitor (Silver)
   Inductor (Gold)
   Transistor (Platinum)
   Superconductor (Elite)
   Dynamic Stakes: Winning against a higher-rated player grants more ELO points, while losing to a lower-rated player costs more.
3. Reliability & Anti-Cheat
   Forfeit Detection: If an opponent closes their browser or loses internet during a match, the system detects their "Presence" drop and awards you an automatic Forfeit Victory.
   Safety Valve: If one player's app hangs or they stop answering, the game has a "forced-progression" timer that prevents the other player from being stuck forever.
   Bot Fallback: If no real players are found within 30 seconds, the app seamlessly introduces an AI bot (e.g., CircuitBot, ByteGhost) so you can still play.
   🛠️ Technical Workings (How it works under the hood)
   Supabase Realtime (WebSockets):
   Presence: Tracks who is online and their current "Activity" status.
   Broadcast: Sends your score updates to your opponent's screen in milliseconds without needing to refresh the database.
   The "Handshake" Protocol:
   When a match is found, Player A (The Host) generates the questions.
   The questions are saved to a specific battle_id in the database.
   Player B (The Joiner) waits until it sees the questions are ready, then downloads them.
   Both apps "Start" at the same moment.
   Database Architecture:
   profiles: Stores usernames, ELO, wins, and department info.
   questions: The library of academic questions categorized by subject.
   matchmaking_queue: A temporary table for users looking for a fight.
   battles: A live ledger of active matches, scores, and shared question data.
