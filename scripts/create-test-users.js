/**
 * Create Test Users with Password
 * Run with: node scripts/create-test-users.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lshmmoenfeodsrthsevf.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaG1tb2VuZmVvZHNydGhzZXZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA4MjI0MywiZXhwIjoyMDg0NjU4MjQzfQ.z4xpEWbTf6YamusX0Qsb-nx5bCieOHDIqTE9J7G8Sxw';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const testUsers = [
  {
    email: 'admin@school.edu',
    password: 'Test123456!',
    role: 'admin',
    code: 'AD001',
    full_name: 'Test Administrator',
    phone: null,
  },
  {
    email: 'teacher@school.edu',
    password: 'Test123456!',
    role: 'teacher',
    code: 'TC001',
    full_name: 'Test Teacher',
    phone: null,
  },
  {
    email: 'student@school.edu',
    password: 'Test123456!',
    role: 'student',
    code: 'ST2024001',
    full_name: 'Test Student',
    phone: null,
  },
  {
    email: 'parent@school.edu',
    password: 'Test123456!',
    role: 'parent',
    code: null,
    full_name: 'Test Parent',
    phone: '0901234569',
  },
];

async function createTestUsers() {
  console.log('Creating test users...\n');

  for (const user of testUsers) {
    try {
      console.log(`Creating ${user.role}: ${user.email}`);

      // Step 1: Create auth user with email confirmation skipped
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
        },
      });

      if (authError) {
        console.error(`  ❌ Auth error: ${authError.message}`);
        continue;
      }

      const userId = authData.user.id;
      console.log(`  ✅ Auth user created: ${userId}`);

      // Step 2: Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          phone: user.phone,
          status: 'active',
        });

      if (profileError) {
        console.error(`  ❌ Profile error: ${profileError.message}`);
        continue;
      }

      console.log(`  ✅ Profile created`);

      // Step 3: Create role-specific data
      if (user.role === 'admin') {
        const { error: adminError } = await supabase.from('admins').insert({
          id: userId,
          admin_code: user.code,
        });
        if (adminError) console.error(`  ❌ Admin error: ${adminError.message}`);
        else console.log(`  ✅ Admin data created (code: ${user.code})`);
      }

      if (user.role === 'teacher') {
        const { error: teacherError } = await supabase.from('teachers').insert({
          id: userId,
          employee_code: user.code,
        });
        if (teacherError) console.error(`  ❌ Teacher error: ${teacherError.message}`);
        else console.log(`  ✅ Teacher data created (code: ${user.code})`);
      }

      if (user.role === 'student') {
        const { error: studentError } = await supabase.from('students').insert({
          id: userId,
          student_code: user.code,
        });
        if (studentError) console.error(`  ❌ Student error: ${studentError.message}`);
        else console.log(`  ✅ Student data created (code: ${user.code})`);
      }

      if (user.role === 'parent') {
        const { error: parentError } = await supabase.from('parents').insert({
          id: userId,
        });
        if (parentError) console.error(`  ❌ Parent error: ${parentError.message}`);
        else console.log(`  ✅ Parent data created (phone: ${user.phone})`);
      }

      console.log(`\n✅ Successfully created ${user.role} user!\n`);
    } catch (error) {
      console.error(`  ❌ Error creating ${user.role}:`, error.message);
    }
  }

  console.log('\n✅ Test users creation complete!');
  console.log('\nLogin credentials:');
  console.log('Password for all users: Test123456!');
  console.log('\n- Admin: AD001 or admin@school.edu');
  console.log('- Teacher: TC001 or teacher@school.edu');
  console.log('- Student: ST2024001 or student@school.edu');
  console.log('- Parent: 0901234569 or parent@school.edu');
}

createTestUsers().catch(console.error);
