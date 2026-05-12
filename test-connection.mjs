/**
 * EduRank — Supabase Connection Test
 * Run: node test-connection.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pypjvbnsmuqdssvnywxw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cGp2Ym5zbXVxZHNzdm55d3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjIyMDMsImV4cCI6MjA5NDA5ODIwM30.GdLpn9ulDVb3T878ks5ZCSdvp5ZDgsjEItuCIc0OEPU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('═══════════════════════════════════════');
console.log('  EduRank — Supabase Connection Test');
console.log('═══════════════════════════════════════\n');

async function test() {
  let passed = 0;
  let failed = 0;

  // Test 1: Basic connection
  console.log('1️⃣  Testing connection...');
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('   ✅ Connection successful!\n');
    passed++;
  } catch (err) {
    console.log(`   ❌ Connection failed: ${err.message}\n`);
    failed++;
  }

  // Test 2: Tables exist
  console.log('2️⃣  Checking tables...');
  const tables = ['profiles', 'questions', 'matchmaking_queue', 'battles', 'match_history'];
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error) throw error;
      console.log(`   ✅ ${table}`);
      passed++;
    } catch (err) {
      console.log(`   ❌ ${table}: ${err.message}`);
      failed++;
    }
  }

  // Test 3: Questions seeded
  console.log('\n3️⃣  Checking seed data...');
  try {
    const { data, error, count } = await supabase.from('questions').select('*', { count: 'exact' });
    if (error) throw error;
    console.log(`   ✅ ${data.length} questions found in database`);
    
    // Show department breakdown
    const depts = {};
    data.forEach(q => { depts[q.department] = (depts[q.department] || 0) + 1; });
    Object.entries(depts).sort((a,b) => b[1] - a[1]).forEach(([dept, count]) => {
      console.log(`      📚 ${dept}: ${count} questions`);
    });
    passed++;
  } catch (err) {
    console.log(`   ❌ Questions check failed: ${err.message}`);
    failed++;
  }

  // Test 4: RPC functions
  console.log('\n4️⃣  Checking RPC functions...');
  try {
    const { data, error } = await supabase.rpc('get_leaderboard', { p_limit: 5 });
    if (error) throw error;
    console.log(`   ✅ get_leaderboard() works — ${data.length} players found`);
    passed++;
  } catch (err) {
    console.log(`   ❌ get_leaderboard(): ${err.message}`);
    failed++;
  }

  // Test 5: Auth
  console.log('\n5️⃣  Checking auth service...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    console.log('   ✅ Auth service reachable');
    passed++;
  } catch (err) {
    console.log(`   ❌ Auth: ${err.message}`);
    failed++;
  }

  // Summary
  console.log('\n═══════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════');
  
  if (failed === 0) {
    console.log('\n🎉 All checks passed! EduRank is ready to go.\n');
  } else {
    console.log('\n⚠️  Some checks failed. Please verify your Supabase setup.\n');
  }
}

test();
