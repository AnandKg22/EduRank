/**
 * EduRank — Debug Signup Issue
 * Run: node debug-signup.mjs
 */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pypjvbnsmuqdssvnywxw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5cGp2Ym5zbXVxZHNzdm55d3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjIyMDMsImV4cCI6MjA5NDA5ODIwM30.GdLpn9ulDVb3T878ks5ZCSdvp5ZDgsjEItuCIc0OEPU'
);

async function debug() {
  console.log('🔍 Debugging signup issue...\n');
  
  // Step 1: Check if the trigger exists
  console.log('1️⃣  Testing signup...');
  const email = `debug_${Date.now()}@test.io`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'DebugTest123!',
    options: {
      data: {
        username: 'DebugUser_' + Date.now(),
        department: 'Computer Science',
      },
    },
  });

  if (error) {
    console.log(`   ❌ Signup error: ${error.message}`);
    console.log(`   Status: ${error.status}`);
    console.log(`   Full error:`, JSON.stringify(error, null, 2));
    
    console.log('\n📋 Possible causes:');
    console.log('   1. The handle_new_user() trigger function is failing');
    console.log('   2. Email confirmations are ENABLED but no email provider configured');
    console.log('   3. The profiles table constraint is being violated\n');
    
    console.log('🔧 Fix: Go to Supabase Dashboard:');
    console.log('   → Authentication → Settings → Email');
    console.log('   → DISABLE "Confirm email" toggle');
    console.log('   → OR configure an SMTP email provider\n');
  } else {
    console.log(`   ✅ Signup succeeded!`);
    console.log(`   User ID: ${data.user?.id}`);
    console.log(`   Email confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`   Session: ${data.session ? 'Active' : 'None (needs email confirmation)'}`);
    
    if (!data.session) {
      console.log('\n⚠️  No session returned — email confirmation is likely ENABLED.');
      console.log('   Go to Supabase Dashboard:');
      console.log('   → Authentication → Settings → Email');
      console.log('   → DISABLE "Confirm email" for development\n');
    }
    
    // Check if profile was created
    if (data.user?.id) {
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileErr) {
        console.log(`\n❌ Profile NOT auto-created: ${profileErr.message}`);
        console.log('   The handle_new_user() trigger may not exist.');
        console.log('   Re-run the trigger creation SQL in the SQL Editor.\n');
      } else {
        console.log(`\n✅ Profile auto-created!`);
        console.log(`   Username: ${profile.username}`);
        console.log(`   Department: ${profile.department}`);
        console.log(`   ELO: ${profile.elo_rating}`);
        console.log(`   Tier: ${profile.tier}\n`);
      }
    }
  }
}

debug();
