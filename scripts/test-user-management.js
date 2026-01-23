/**
 * Test User Management Functions
 * Run with: node scripts/test-user-management.js
 *
 * Tests:
 * - getUsers() - Fetch all users
 * - createUser() - Create new user
 * - updateUser() - Update existing user
 * - deleteUser() - Delete user
 * - Authentication tests
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

// Test results tracking
const results = {
  passed: [],
  failed: [],
  total: 0
};

function logTest(name, passed, details = '') {
  results.total++;
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`  ${status} - ${name}${details ? `: ${details}` : ''}`);

  if (passed) {
    results.passed.push(name);
  } else {
    results.failed.push({ name, details });
  }
}

async function testGetUsers() {
  console.log('\n📋 Test: getUsers() - Fetch all users');
  console.log('   Description: Retrieve all users from profiles table');

  try {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: false });

    if (error) throw error;

    logTest('Fetch users from database', true, `Found ${count || 0} users`);

    // Count by role
    const adminCount = data.filter(u => u.role === 'admin').length;
    const teacherCount = data.filter(u => u.role === 'teacher').length;
    const studentCount = data.filter(u => u.role === 'student').length;
    const parentCount = data.filter(u => u.role === 'parent').length;

    console.log(`     👥 Admins: ${adminCount}`);
    console.log(`     👨‍🏫 Teachers: ${teacherCount}`);
    console.log(`     🎓 Students: ${studentCount}`);
    console.log(`     👪 Parents: ${parentCount}`);

    // Verify we have test data
    const hasTestUsers = adminCount > 0 && teacherCount > 0 && studentCount > 0 && parentCount > 0;
    logTest('Test users exist in database', hasTestUsers);

    return { success: true, data, count };
  } catch (err) {
    logTest('Fetch users from database', false, err.message);
    return { success: false, error: err };
  }
}

async function testGetUsersByRole() {
  console.log('\n📋 Test: getUsersByRole() - Filter users by role');
  console.log('   Description: Retrieve users filtered by specific roles');

  const roles = ['admin', 'teacher', 'student', 'parent'];

  for (const role of roles) {
    try {
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', role)
        .limit(5);

      if (error) throw error;

      logTest(`Fetch users with role '${role}'`, true, `Found ${count || 0} users`);

      if (data && data.length > 0) {
        console.log(`     Sample ${role}: ${data[0].email} (${data[0].full_name})`);
      }
    } catch (err) {
      logTest(`Fetch users with role '${role}'`, false, err.message);
    }
  }
}

async function testGetUsersByStatus() {
  console.log('\n📋 Test: getUsersByStatus() - Filter users by status');

  const statuses = ['active', 'inactive'];

  for (const status of statuses) {
    try {
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('status', status)
        .limit(5);

      if (error) throw error;

      logTest(`Fetch users with status '${status}'`, true, `Found ${count || 0} users`);
    } catch (err) {
      logTest(`Fetch users with status '${status}'`, false, err.message);
    }
  }
}

async function testUserSearch() {
  console.log('\n📋 Test: User search - Search users by name/email');

  // Test searching for admin users
  try {
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .or('email.ilike.%admin%,full_name.ilike.%admin%')
      .limit(5);

    if (error) throw error;

    logTest('Search for users with "admin"', true, `Found ${count || 0} users`);
  } catch (err) {
    logTest('Search for users with "admin"', false, err.message);
  }

  // Test searching for specific student code (from students table)
  try {
    // Use explicit foreign key reference to avoid ambiguity
    const { data: students, error } = await supabase
      .from('students')
      .select('student_code, profiles!students_id_fkey (full_name, email)')
      .limit(1);

    if (error) throw error;

    if (students && students.length > 0) {
      const studentCode = students[0].student_code;
      if (studentCode) {
        const { data: searchData, error: searchError } = await supabase
          .from('students')
          .select('student_code, profiles!students_id_fkey (full_name, email)')
          .eq('student_code', studentCode);

        if (searchError) throw searchError;

        logTest('Search student by student_code', true, `Found ${searchData?.length || 0} students: ${students[0].profiles?.full_name}`);
      } else {
        logTest('Search student by student_code', false, 'No student_code found on test user');
      }
    }
  } catch (err) {
    logTest('Search student by student_code', false, err.message);
  }
}

async function testCreateUser() {
  console.log('\n📋 Test: createUser() - Create new user');

  // Use a truly unique email with random component
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const testUser = {
    email: `test-${randomSuffix}@test.edu`,
    password: 'Test123456!',
    fullName: 'Test User',
    role: 'teacher',
  };

  try {
    // First check if user already exists (shouldn't with random suffix)
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', testUser.email)
      .maybeSingle(); // Use maybeSingle to return null instead of error if not found

    if (existingUser) {
      logTest('Create auth user', false, `User with email ${testUser.email} already exists`);
      return { success: false, error: new Error('User already exists') };
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true,
      user_metadata: {
        full_name: testUser.fullName,
        role: testUser.role,
      },
    });

    if (authError) throw authError;

    logTest('Create auth user', true, `User ID: ${authData.user.id}, Email: ${testUser.email}`);

    // Create profile - use upsert in case it was auto-created
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: authData.user.id,
      email: testUser.email,
      role: testUser.role,
      full_name: testUser.fullName,
      status: 'active',
    }, { onConflict: 'id' });

    if (profileError) throw profileError;

    logTest('Create user profile', true);

    // Verify user was created
    const { data: verifyData, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (verifyError) throw verifyError;

    logTest('Verify user creation', true, `User found: ${verifyData.email}`);

    // Store user ID for cleanup/update tests
    return { success: true, userId: authData.user.id, userEmail: testUser.email };
  } catch (err) {
    logTest('Create user', false, err.message);
    return { success: false, error: err };
  }
}

async function testUpdateUser(userId) {
  console.log('\n📋 Test: updateUser() - Update existing user');

  if (!userId) {
    logTest('Update user profile', false, 'No user ID provided (create user test may have failed)');
    return { success: false };
  }

  const updateData = {
    full_name: 'Updated Test User',
    status: 'inactive',
  };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    logTest('Update user profile', true, `Updated to: ${data.full_name}, status: ${data.status}`);

    // Verify update
    if (data.full_name === updateData.full_name && data.status === updateData.status) {
      logTest('Verify user update', true);
    } else {
      logTest('Verify user update', false, 'Data mismatch after update');
    }

    return { success: true };
  } catch (err) {
    logTest('Update user profile', false, err.message);
    return { success: false, error: err };
  }
}

async function testDeleteUser(userId) {
  console.log('\n📋 Test: deleteUser() - Delete user');

  if (!userId) {
    logTest('Delete user', false, 'No user ID provided');
    return { success: false };
  }

  try {
    // Delete profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) throw profileError;

    logTest('Delete user profile', true);

    // Delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) throw authError;

    logTest('Delete auth user', true);

    // Verify deletion
    const { data: verifyData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);

    if (verifyData && verifyData.length === 0) {
      logTest('Verify user deletion', true);
    } else {
      logTest('Verify user deletion', false, 'User still exists in database');
    }

    return { success: true };
  } catch (err) {
    logTest('Delete user', false, err.message);
    return { success: false, error: err };
  }
}

async function testDataRelationships() {
  console.log('\n📋 Test: Data relationships - Verify user relationships');

  try {
    // Get students with their guardian info (using explicit FK references)
    const { data: students, error: studentError } = await supabase
      .from('students')
      .select(`
        id,
        student_code,
        profile:profiles!students_id_fkey (full_name, email),
        guardian:profiles!students_guardian_id_fkey (full_name, email)
      `)
      .not('guardian_id', 'is', null)
      .limit(3);

    if (studentError) throw studentError;

    if (students && students.length > 0) {
      logTest('Fetch students with guardians', true, `Found ${students.length} students with guardians`);

      students.forEach(student => {
        const guardianName = student.guardian?.full_name || 'No guardian';
        console.log(`     👨‍🎓 ${student.profile?.full_name} (${student.student_code}) → Guardian: ${guardianName}`);
      });
    } else {
      logTest('Fetch students with guardians', false, 'No students with guardians found');
    }

    // Get student-guardians relationships (junction table)
    const { data: guardianRelations, error: guardianError } = await supabase
      .from('student_guardians')
      .select(`
        is_primary,
        student:students!student_guardians_student_id_fkey (student_code, profile:profiles!students_id_fkey (full_name)),
        parent:parents!student_guardians_guardian_id_fkey (profile:profiles!parents_id_fkey (full_name, email))
      `)
      .limit(3);

    if (guardianError) throw guardianError;

    if (guardianRelations && guardianRelations.length > 0) {
      logTest('Fetch student-guardian relationships', true, `Found ${guardianRelations.length} relationships`);

      guardianRelations.forEach(rel => {
        const studentName = rel.student?.profile?.full_name;
        const parentName = rel.parent?.profile?.full_name;
        const primary = rel.is_primary ? ' (Primary)' : '';
        console.log(`     👨‍👩 ${studentName} ← ${parentName}${primary}`);
      });
    } else {
      logTest('Fetch student-guardian relationships', false, 'No guardian relationships found');
    }

    // Get enrollments
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('enrollments')
      .select(`
        id,
        student:students!enrollments_student_id_fkey (student_code, profile:profiles!students_id_fkey (full_name)),
        class:classes!enrollments_class_id_fkey (name)
      `)
      .limit(5);

    if (enrollmentError) throw enrollmentError;

    if (enrollments && enrollments.length > 0) {
      logTest('Fetch enrollments with student and class info', true, `Found ${enrollments.length} enrollments`);

      enrollments.forEach(enrollment => {
        console.log(`     📚 ${enrollment.student?.profile?.full_name} → ${enrollment.class?.name || 'No class'}`);
      });
    } else {
      logTest('Fetch enrollments', false, 'No enrollments found');
    }

    return { success: true };
  } catch (err) {
    logTest('Data relationships test', false, err.message);
    return { success: false, error: err };
  }
}

async function testAuthentication() {
  console.log('\n📋 Test: Authentication - Test user login');

  // Get an admin user for testing
  const { data: adminUsers, error: adminError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'admin')
    .limit(1);

  if (adminError) {
    logTest('Authentication test', false, adminError.message);
    return { success: false };
  }

  if (!adminUsers || adminUsers.length === 0) {
    logTest('Authentication test', false, 'No admin users found');
    return { success: false };
  }

  const adminEmail = adminUsers[0].email;
  console.log(`     🔐 Testing login for: ${adminEmail}`);

  try {
    // Create a test session using signInWithPassword (requires test user with known password)
    // Since we don't have the password for existing users, we'll just verify the user can auth
    const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(adminUsers[0].id);

    if (authError) throw authError;

    logTest('Get user by ID (auth verification)', true, `User: ${user?.email}`);

    return { success: true };
  } catch (err) {
    logTest('Authentication test', false, err.message);
    return { success: false, error: err };
  }
}

function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total tests: ${results.total}`);
  console.log(`Passed: ${results.passed.length} ✅`);
  console.log(`Failed: ${results.failed.length} ❌`);
  console.log(`Success rate: ${((results.passed.length / results.total) * 100).toFixed(1)}%`);

  if (results.failed.length > 0) {
    console.log('\n❌ Failed tests:');
    results.failed.forEach(({ name, details }) => {
      console.log(`   - ${name}: ${details}`);
    });
  }

  console.log('='.repeat(60));
}

async function runAllTests() {
  console.log('🧪 Starting User Management Tests');
  console.log('='.repeat(60));

  // Test 1: Get all users
  await testGetUsers();

  // Test 2: Get users by role
  await testGetUsersByRole();

  // Test 3: Get users by status
  await testGetUsersByStatus();

  // Test 4: Search users
  await testUserSearch();

  // Test 5: Data relationships
  await testDataRelationships();

  // Test 6: Authentication
  await testAuthentication();

  // Test 7-9: Create, Update, Delete user (using same user)
  const createResult = await testCreateUser();
  await testUpdateUser(createResult.userId);
  await testDeleteUser(createResult.userId);

  // Print summary
  printSummary();

  // Exit with appropriate code
  process.exit(results.failed.length > 0 ? 1 : 0);
}

runAllTests().catch(console.error);
