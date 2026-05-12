-- ═══════════════════════════════════════════════════════════════
-- EduRank — Fix: Re-create the handle_new_user trigger
-- Run this in the Supabase SQL Editor
-- https://supabase.com/dashboard/project/pypjvbnsmuqdssvnywxw/sql
-- ═══════════════════════════════════════════════════════════════

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Re-create the function with robust error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, department)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Player_' || LEFT(NEW.id::text, 8)),
    COALESCE(NEW.raw_user_meta_data->>'department', 'General Science')
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Username already exists, append a random suffix
    INSERT INTO public.profiles (id, username, department)
    VALUES (
      NEW.id,
      'Player_' || LEFT(NEW.id::text, 12),
      COALESCE(NEW.raw_user_meta_data->>'department', 'General Science')
    );
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE LOG 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Verify: this should return the function
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';
