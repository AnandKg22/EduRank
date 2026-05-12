-- ═══════════════════════════════════════════════════════════════
-- EduRank Database Schema
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── Enable required extensions ──
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════
-- 1. PROFILES TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT DEFAULT '',
  department TEXT NOT NULL DEFAULT 'General Science',
  elo_rating INTEGER NOT NULL DEFAULT 1000,
  tier TEXT NOT NULL DEFAULT 'Resistor',
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  total_matches INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, department)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Player_' || LEFT(NEW.id::text, 8)),
    COALESCE(NEW.raw_user_meta_data->>'department', 'General Science')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════════════════════════════
-- 2. QUESTIONS TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'General Science',
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- ["Option A", "Option B", "Option C", "Option D"]
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 3. MATCHMAKING QUEUE TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS matchmaking_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  elo_rating INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'matched')),
  matched_with UUID REFERENCES profiles(id),
  battle_id UUID,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 4. BATTLES TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_a UUID NOT NULL REFERENCES profiles(id),
  player_b UUID REFERENCES profiles(id), -- NULL for bot matches initially
  questions JSONB DEFAULT '[]'::jsonb,
  current_question INTEGER NOT NULL DEFAULT 0,
  score_a INTEGER NOT NULL DEFAULT 0,
  score_b INTEGER NOT NULL DEFAULT 0,
  answers_a JSONB DEFAULT '[]'::jsonb,
  answers_b JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'preparing' CHECK (status IN ('preparing', 'active', 'finished', 'forfeited')),
  winner UUID,
  is_bot_match BOOLEAN NOT NULL DEFAULT false,
  bot_name TEXT,
  elo_delta_a INTEGER DEFAULT 0,
  elo_delta_b INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 5. MATCH HISTORY TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS match_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  battle_id UUID NOT NULL REFERENCES battles(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  opponent_id UUID,
  opponent_name TEXT,
  result TEXT NOT NULL CHECK (result IN ('win', 'loss', 'draw', 'forfeit_win')),
  elo_change INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  opponent_score INTEGER NOT NULL DEFAULT 0,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchmaking_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_history ENABLE ROW LEVEL SECURITY;

-- Profiles: read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Questions: read all
CREATE POLICY "Questions are viewable by authenticated" ON questions FOR SELECT TO authenticated USING (true);

-- Matchmaking queue: insert/delete own, read all
CREATE POLICY "Queue is viewable by authenticated" ON matchmaking_queue FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join queue" ON matchmaking_queue FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave queue" ON matchmaking_queue FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own queue entry" ON matchmaking_queue FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Battles: participants can read, update own
CREATE POLICY "Battles viewable by participants" ON battles FOR SELECT TO authenticated USING (auth.uid() = player_a OR auth.uid() = player_b);
CREATE POLICY "Battles insertable by authenticated" ON battles FOR INSERT TO authenticated WITH CHECK (auth.uid() = player_a);
CREATE POLICY "Battles updatable by participants" ON battles FOR UPDATE TO authenticated USING (auth.uid() = player_a OR auth.uid() = player_b);

-- Match history: read own
CREATE POLICY "Users can view own history" ON match_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON match_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- RPC FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- Get leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(p_limit INTEGER DEFAULT 50, p_department TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT,
  department TEXT,
  elo_rating INTEGER,
  tier TEXT,
  wins INTEGER,
  losses INTEGER,
  draws INTEGER,
  total_matches INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.username, p.avatar_url, p.department,
         p.elo_rating, p.tier, p.wins, p.losses, p.draws, p.total_matches
  FROM profiles p
  WHERE (p_department IS NULL OR p.department = p_department)
  ORDER BY p.elo_rating DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update tier based on ELO
CREATE OR REPLACE FUNCTION update_tier(p_user_id UUID, p_elo INTEGER)
RETURNS TEXT AS $$
DECLARE
  new_tier TEXT;
BEGIN
  new_tier := CASE
    WHEN p_elo >= 1800 THEN 'Superconductor'
    WHEN p_elo >= 1500 THEN 'Transistor'
    WHEN p_elo >= 1300 THEN 'Inductor'
    WHEN p_elo >= 1100 THEN 'Capacitor'
    ELSE 'Resistor'
  END;
  
  UPDATE profiles SET tier = new_tier WHERE id = p_user_id;
  RETURN new_tier;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════════════════
-- ENABLE REALTIME
-- ═══════════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE matchmaking_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE battles;

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA: Sample Questions
-- ═══════════════════════════════════════════════════════════════

INSERT INTO questions (subject, department, difficulty, question_text, options, correct_answer) VALUES
-- Computer Science
('Data Structures', 'Computer Science', 'easy', 'What is the time complexity of accessing an element in an array by index?', '["O(n)", "O(log n)", "O(1)", "O(n²)"]', 2),
('Data Structures', 'Computer Science', 'medium', 'Which data structure uses LIFO (Last In First Out) principle?', '["Queue", "Stack", "Array", "Linked List"]', 1),
('Algorithms', 'Computer Science', 'medium', 'What is the worst-case time complexity of Quick Sort?', '["O(n log n)", "O(n)", "O(n²)", "O(log n)"]', 2),
('Algorithms', 'Computer Science', 'hard', 'Which algorithm is used to find the shortest path in a weighted graph?', '["BFS", "DFS", "Dijkstra", "Prim"]', 2),
('Networking', 'Computer Science', 'easy', 'Which protocol is used for sending emails?', '["HTTP", "FTP", "SMTP", "TCP"]', 2),
('Databases', 'Computer Science', 'medium', 'What does ACID stand for in database systems?', '["Atomicity, Consistency, Isolation, Durability", "Access, Control, Integration, Data", "Atomic, Compiled, Indexed, Distributed", "None of the above"]', 0),
('Operating Systems', 'Computer Science', 'medium', 'What is a deadlock in operating systems?', '["A process running infinitely", "Two or more processes waiting for each other indefinitely", "A process with highest priority", "Memory overflow"]', 1),
('Programming', 'Computer Science', 'easy', 'Which keyword is used to define a function in Python?', '["func", "function", "def", "define"]', 2),

-- Electrical Engineering
('Circuit Theory', 'Electrical Engineering', 'easy', 'What is Ohm''s Law?', '["V = IR", "P = IV", "V = I/R", "R = V²/P"]', 0),
('Circuit Theory', 'Electrical Engineering', 'medium', 'In a parallel circuit, what remains constant across all branches?', '["Current", "Voltage", "Resistance", "Power"]', 1),
('Electromagnetics', 'Electrical Engineering', 'medium', 'What is the unit of magnetic flux?', '["Tesla", "Weber", "Henry", "Gauss"]', 1),
('Power Systems', 'Electrical Engineering', 'hard', 'What is the typical frequency of AC power in India?', '["60 Hz", "50 Hz", "40 Hz", "100 Hz"]', 1),
('Electronics', 'Electrical Engineering', 'easy', 'What does LED stand for?', '["Light Emitting Device", "Light Emitting Diode", "Low Energy Diode", "Laser Emitting Diode"]', 1),
('Control Systems', 'Electrical Engineering', 'medium', 'What is the Laplace transform of a unit step function?', '["1/s", "s", "1/s²", "1"]', 0),
('Digital Electronics', 'Electrical Engineering', 'easy', 'How many bits are in a byte?', '["4", "8", "16", "32"]', 1),
('Machines', 'Electrical Engineering', 'medium', 'Which motor has the highest starting torque?', '["Induction Motor", "Synchronous Motor", "DC Series Motor", "DC Shunt Motor"]', 2),

-- Mechanical Engineering
('Thermodynamics', 'Mechanical Engineering', 'easy', 'What is the first law of thermodynamics about?', '["Entropy", "Conservation of Energy", "Heat Transfer", "Work Done"]', 1),
('Thermodynamics', 'Mechanical Engineering', 'medium', 'What is the Carnot efficiency formula?', '["1 - T_cold/T_hot", "T_hot/T_cold", "T_cold - T_hot", "1 + T_cold/T_hot"]', 0),
('Fluid Mechanics', 'Mechanical Engineering', 'medium', 'What does the Reynolds number indicate?', '["Flow velocity", "Flow type (laminar vs turbulent)", "Fluid density", "Pipe diameter"]', 1),
('Mechanics', 'Mechanical Engineering', 'easy', 'What is the SI unit of force?', '["Pascal", "Joule", "Newton", "Watt"]', 2),
('Manufacturing', 'Mechanical Engineering', 'medium', 'Which process is used to join metals by melting?', '["Casting", "Forging", "Welding", "Machining"]', 2),
('Materials', 'Mechanical Engineering', 'hard', 'What is the Young''s Modulus a measure of?', '["Hardness", "Elasticity/Stiffness", "Ductility", "Toughness"]', 1),
('Kinematics', 'Mechanical Engineering', 'easy', 'What is the acceleration due to gravity on Earth (approx)?', '["10.8 m/s²", "9.8 m/s²", "8.8 m/s²", "11.8 m/s²"]', 1),
('Heat Transfer', 'Mechanical Engineering', 'medium', 'Which mode of heat transfer does not require a medium?', '["Conduction", "Convection", "Radiation", "All require a medium"]', 2),

-- General Science
('Physics', 'General Science', 'easy', 'What is the speed of light approximately?', '["3 × 10⁶ m/s", "3 × 10⁸ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"]', 1),
('Physics', 'General Science', 'medium', 'What is the formula for kinetic energy?', '["mgh", "½mv²", "Fd", "mv"]', 1),
('Chemistry', 'General Science', 'easy', 'What is the chemical symbol for Gold?', '["Go", "Gd", "Au", "Ag"]', 2),
('Chemistry', 'General Science', 'medium', 'What is the pH of pure water?', '["0", "7", "14", "1"]', 1),
('Mathematics', 'General Science', 'easy', 'What is the value of Pi (π) to 2 decimal places?', '["3.41", "3.14", "3.12", "3.16"]', 1),
('Mathematics', 'General Science', 'medium', 'What is the derivative of sin(x)?', '["cos(x)", "-sin(x)", "tan(x)", "-cos(x)"]', 0),
('Biology', 'General Science', 'easy', 'What is the powerhouse of the cell?', '["Nucleus", "Ribosome", "Mitochondria", "Golgi Body"]', 2),
('Biology', 'General Science', 'medium', 'What is the basic unit of heredity?', '["Cell", "Chromosome", "Gene", "DNA"]', 2),

-- Electronics & Communication
('Analog Electronics', 'Electronics & Communication', 'easy', 'What is the function of a capacitor?', '["Store energy in magnetic field", "Store energy in electric field", "Convert AC to DC", "Amplify signals"]', 1),
('Analog Electronics', 'Electronics & Communication', 'medium', 'What is the gain of a common-emitter amplifier?', '["Less than 1", "Equal to 1", "Greater than 1", "Zero"]', 2),
('Communication', 'Electronics & Communication', 'medium', 'What is the Nyquist rate for a signal with bandwidth B?', '["B", "2B", "B/2", "4B"]', 1),
('Signals', 'Electronics & Communication', 'hard', 'What does the Fourier Transform convert a signal to?', '["Time domain to frequency domain", "Analog to digital", "Continuous to discrete", "Real to complex"]', 0),

-- Civil Engineering
('Structures', 'Civil Engineering', 'easy', 'What is the strongest shape in structural engineering?', '["Square", "Circle", "Triangle", "Rectangle"]', 2),
('Concrete', 'Civil Engineering', 'medium', 'What is the standard curing period for concrete?', '["7 days", "14 days", "21 days", "28 days"]', 3),
('Surveying', 'Civil Engineering', 'easy', 'What instrument is used to measure horizontal angles?', '["Level", "Theodolite", "Chain", "Compass"]', 1),
('Geotechnical', 'Civil Engineering', 'medium', 'What does SPT stand for in soil testing?', '["Standard Penetration Test", "Soil Pressure Test", "Standard Proctor Test", "Soil Permeability Test"]', 0),

-- Information Technology
('Web Development', 'Information Technology', 'easy', 'What does HTML stand for?', '["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"]', 0),
('Web Development', 'Information Technology', 'medium', 'Which HTTP method is idempotent?', '["POST", "GET", "PATCH", "None"]', 1),
('Security', 'Information Technology', 'medium', 'What does SQL injection exploit?', '["Memory buffers", "Input validation flaws", "Network protocols", "File permissions"]', 1),
('Cloud', 'Information Technology', 'easy', 'What does SaaS stand for?', '["Software as a Service", "Storage as a Service", "System as a Service", "Server as a Service"]', 0);
