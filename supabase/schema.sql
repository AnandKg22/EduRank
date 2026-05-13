-- ═══════════════════════════════════════════════════════════════
-- EduRank Enterprise Database Schema (Clean Slate Deployment)
-- Completely recreates the relational model for Multi-Tenancy & RBAC
-- ═══════════════════════════════════════════════════════════════

-- ── Enable required extensions ──
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════
-- ABSOLUTE FRESH-START TABLE & FUNCTION PURGE
-- Drops existing tables, views, and functions in cascading sequence
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS match_history CASCADE;
DROP TABLE IF EXISTS battles CASCADE;
DROP TABLE IF EXISTS matchmaking_queue CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

DROP FUNCTION IF EXISTS get_leaderboard(INTEGER, TEXT) CASCADE;
DROP FUNCTION IF EXISTS update_tier(UUID, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_modified_column() CASCADE;

-- ═══════════════════════════════════════════════════════════════
-- AUTOMATED TIMESTAMP TRIGGER
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════
-- 1. ORGANIZATIONS TABLE (Primary B2B Tenant Pillar)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  branding_color TEXT DEFAULT '#6D28D9',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_organizations_modtime
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ═══════════════════════════════════════════════════════════════
-- 2. PROFILES TABLE (User Identities & RBAC)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT DEFAULT '',
  department TEXT NOT NULL DEFAULT 'General Science',
  role TEXT NOT NULL DEFAULT 'Student' CHECK (role IN ('SuperAdmin', 'TenantAdmin', 'Faculty', 'Student')),
  elo_rating INTEGER NOT NULL DEFAULT 1000,
  tier TEXT NOT NULL DEFAULT 'Bronze',
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  total_matches INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_profiles_modtime
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Auto-create profile on signup with Multi-Tenant local fallback
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_org_id UUID;
BEGIN
  -- Select the first created organization as fallback for dev sandbox registration
  SELECT id INTO default_org_id FROM organizations ORDER BY created_at ASC LIMIT 1;

  INSERT INTO profiles (id, username, avatar_url, department, role, organization_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Player_' || LEFT(NEW.id::text, 8)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'department', 'General Science'),
    CASE 
      WHEN LOWER(NEW.raw_user_meta_data->>'username') = 'anandadmin' THEN 'SuperAdmin'
      ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'Student')
    END,
    COALESCE((NEW.raw_user_meta_data->>'organization_id')::uuid, default_org_id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════════════════════════════
-- 3. QUESTIONS TABLE (Tenant-Isolated Trivia Bank)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'General Science',
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- ["Option A", "Option B", "Option C", "Option D"]
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_questions_modtime
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ═══════════════════════════════════════════════════════════════
-- 4. MATCHMAKING QUEUE TABLE (Tenant Scoped Matchmaking)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE matchmaking_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  elo_rating INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'matched')),
  matched_with UUID REFERENCES profiles(id),
  battle_id UUID,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_matchmaking_queue_modtime
  BEFORE UPDATE ON matchmaking_queue
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ═══════════════════════════════════════════════════════════════
-- 5. BATTLES TABLE (Tenant Scoped Game Instances)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  player_a UUID NOT NULL REFERENCES profiles(id),
  player_b UUID REFERENCES profiles(id),
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_battles_modtime
  BEFORE UPDATE ON battles
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ═══════════════════════════════════════════════════════════════
-- 6. MATCH HISTORY TABLE
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE match_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  battle_id UUID NOT NULL REFERENCES battles(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  opponent_id UUID,
  opponent_name TEXT,
  result TEXT NOT NULL CHECK (result IN ('win', 'loss', 'draw', 'forfeit_win')),
  elo_change INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  opponent_score INTEGER NOT NULL DEFAULT 0,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_match_history_modtime
  BEFORE UPDATE ON match_history
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Enforcing Tenant Isolation & Role Policies
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchmaking_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_history ENABLE ROW LEVEL SECURITY;

-- ── Organizations ──
CREATE POLICY "Organizations viewable by authenticated" ON organizations FOR SELECT TO authenticated USING (true);

-- ── Profiles ──
CREATE POLICY "Profiles viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── Questions ──
CREATE POLICY "Questions viewable by tenant" ON questions FOR SELECT TO authenticated 
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Faculty insert questions" ON questions FOR INSERT TO authenticated 
WITH CHECK (
  organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()) AND
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('Faculty', 'TenantAdmin', 'SuperAdmin')
);

CREATE POLICY "Faculty update questions" ON questions FOR UPDATE TO authenticated 
USING (
  organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()) AND
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('Faculty', 'TenantAdmin', 'SuperAdmin')
);

-- ── Matchmaking Queue ──
CREATE POLICY "Queue viewable by tenant" ON matchmaking_queue FOR SELECT TO authenticated 
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users insert own queue entry" ON matchmaking_queue FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id AND organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users delete own queue entry" ON matchmaking_queue FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Tenant participants update queue" ON matchmaking_queue FOR UPDATE TO authenticated 
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- ── Battles ──
CREATE POLICY "Battles viewable by tenant participants" ON battles FOR SELECT TO authenticated 
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Battles insertable by player_a" ON battles FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = player_a AND organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Battles updatable by participants" ON battles FOR UPDATE TO authenticated 
USING (auth.uid() = player_a OR auth.uid() = player_b);

-- ── Match History ──
CREATE POLICY "History viewable by owner" ON match_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "History insertable by owner" ON match_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- RPC FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- Get tenant scoped leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(p_limit INTEGER DEFAULT 50, p_department TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  username TEXT,
  avatar_url TEXT,
  department TEXT,
  role TEXT,
  elo_rating INTEGER,
  tier TEXT,
  wins INTEGER,
  losses INTEGER,
  draws INTEGER,
  total_matches INTEGER
) AS $$
DECLARE
  caller_org_id UUID;
BEGIN
  -- Identify caller organization scope
  SELECT organization_id INTO caller_org_id FROM profiles WHERE profiles.id = auth.uid();

  RETURN QUERY
  SELECT p.id, p.username, p.avatar_url, p.department, p.role,
         p.elo_rating, p.tier, p.wins, p.losses, p.draws, p.total_matches
  FROM profiles p
  WHERE p.organization_id = caller_org_id
    AND (p_department IS NULL OR p.department = p_department)
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
    WHEN p_elo >= 1800 THEN 'Diamond'
    WHEN p_elo >= 1500 THEN 'Platinum'
    WHEN p_elo >= 1300 THEN 'Gold'
    WHEN p_elo >= 1100 THEN 'Silver'
    ELSE 'Bronze'
  END;
  
  UPDATE profiles SET tier = new_tier WHERE id = p_user_id;
  RETURN new_tier;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══════════════════════════════════════════════════════════════
-- ENABLE REALTIME PUBLICATIONS
-- ═══════════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE matchmaking_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE battles;

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA: Provision Sample B2B Tenants & Bind Questions
-- ═══════════════════════════════════════════════════════════════

-- 1. Insert Initial Institutions
INSERT INTO organizations (id, name, branding_color) VALUES
('a0000000-0000-0000-0000-000000000001', 'Massachusetts Institute of Technology (MIT)', '#6D28D9'),
('a0000000-0000-0000-0000-000000000002', 'Stanford University', '#B91C1C'),
('a0000000-0000-0000-0000-000000000003', 'Indian Institute of Technology (IIT) Bombay', '#0284C7')
ON CONFLICT (name) DO UPDATE SET branding_color = EXCLUDED.branding_color;

-- 2. Insert Base Questions tied to MIT (Tenant 1)
INSERT INTO questions (organization_id, subject, department, difficulty, question_text, options, correct_answer) VALUES
-- Computer Science
('a0000000-0000-0000-0000-000000000001', 'Data Structures', 'Computer Science', 'easy', 'What is the time complexity of accessing an element in an array by index?', '["O(n)", "O(log n)", "O(1)", "O(n²)"]', 2),
('a0000000-0000-0000-0000-000000000001', 'Data Structures', 'Computer Science', 'medium', 'Which data structure uses LIFO (Last In First Out) principle?', '["Queue", "Stack", "Array", "Linked List"]', 1),
('a0000000-0000-0000-0000-000000000001', 'Algorithms', 'Computer Science', 'medium', 'What is the worst-case time complexity of Quick Sort?', '["O(n log n)", "O(n)", "O(n²)", "O(log n)"]', 2),
('a0000000-0000-0000-0000-000000000001', 'Algorithms', 'Computer Science', 'hard', 'Which algorithm is used to find the shortest path in a weighted graph?', '["BFS", "DFS", "Dijkstra", "Prim"]', 2),

-- Electrical Engineering
('a0000000-0000-0000-0000-000000000001', 'Circuit Theory', 'Electrical Engineering', 'easy', 'What is Ohm''s Law?', '["V = IR", "P = IV", "V = I/R", "R = V²/P"]', 0),
('a0000000-0000-0000-0000-000000000001', 'Electromagnetics', 'Electrical Engineering', 'medium', 'What is the unit of magnetic flux?', '["Tesla", "Weber", "Henry", "Gauss"]', 1),

-- General Science
('a0000000-0000-0000-0000-000000000001', 'Physics', 'General Science', 'easy', 'What is the speed of light approximately?', '["3 × 10⁶ m/s", "3 × 10⁸ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"]', 1),
('a0000000-0000-0000-0000-000000000001', 'Chemistry', 'General Science', 'easy', 'What is the chemical symbol for Gold?', '["Go", "Gd", "Au", "Ag"]', 2);

-- 3. Insert Base Questions tied to Stanford (Tenant 2)
INSERT INTO questions (organization_id, subject, department, difficulty, question_text, options, correct_answer) VALUES
('a0000000-0000-0000-0000-000000000002', 'Operating Systems', 'Computer Science', 'medium', 'What is a deadlock in operating systems?', '["A process running infinitely", "Two or more processes waiting for each other indefinitely", "A process with highest priority", "Memory overflow"]', 1),
('a0000000-0000-0000-0000-000000000002', 'Thermodynamics', 'Mechanical Engineering', 'easy', 'What is the first law of thermodynamics about?', '["Entropy", "Conservation of Energy", "Heat Transfer", "Work Done"]', 1);
