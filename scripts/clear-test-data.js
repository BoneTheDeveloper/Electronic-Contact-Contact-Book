/**
 * Clear Test Data Script
 * Run with: node scripts/clear-test-data.js
 *
 * WARNING: This will DELETE all test data from the database!
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

async function clearTestData() {
  console.log('🗑️  Clearing test data...\n');

  const tables = [
    // Clear in order of dependencies (child tables first)
    { name: 'grade_entries', label: 'Grade entries' },
    { name: 'assessments', label: 'Assessments' },
    { name: 'attendance', label: 'Attendance records' },
    { name: 'leave_requests', label: 'Leave requests' },
    { name: 'invoices', label: 'Invoices' },
    { name: 'schedules', label: 'Schedules' },
    { name: 'enrollments', label: 'Enrollments' },
    { name: 'notifications', label: 'Notifications' },
    { name: 'periods', label: 'Periods' },
    { name: 'subjects', label: 'Subjects' },
    { name: 'classes', label: 'Classes' },
    { name: 'grades', label: 'Grades' },
    { name: 'academic_years', label: 'Academic years' },
    { name: 'fee_items', label: 'Fee items' },
    { name: 'students', label: 'Students' },
    { name: 'parents', label: 'Parents' },
    { name: 'teachers', label: 'Teachers' },
    { name: 'admins', label: 'Admins' },
    { name: 'profiles', label: 'Profiles' },
  ];

  // Also need to delete from auth
  console.log('📝 Collecting user IDs to delete from auth...\n');

  let totalDeleted = 0;
  const userIds = [];

  for (const table of tables) {
    try {
      if (table.name === 'profiles') {
        // Get all user IDs before deleting
        const { data: profiles } = await supabase.from('profiles').select('id');
        if (profiles) {
          userIds.push(...profiles.map(p => p.id));
        }
      }

      const { error } = await supabase.from(table.name).delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.error(`  ❌ Error clearing ${table.label}:`, error.message);
      } else {
        console.log(`  ✅ Cleared ${table.label}`);
        totalDeleted++;
      }
    } catch (err) {
      console.error(`  ❌ Error with ${table.label}:`, err.message);
    }
  }

  // Delete from auth
  console.log('\n🔐 Deleting users from auth...');
  let authDeleted = 0;
  for (const userId of userIds) {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (!error) authDeleted++;
    } catch (err) {
      // User might not exist in auth, ignore
    }
  }
  console.log(`  ✅ Deleted ${authDeleted} users from auth`);

  console.log(`\n✅ Test data cleared!`);
  console.log(`   Deleted ${totalDeleted} tables and ${authDeleted} auth users`);
}

clearTestData().catch(console.error);
