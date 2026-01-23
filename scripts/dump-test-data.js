/**
 * Comprehensive Test Data Dump Script
 * Run with: node scripts/dump-test-data.js
 *
 * Creates:
 * - Users (admin, teachers, students, parents)
 * - Academic structure (years, grades, classes, subjects)
 * - Enrollments
 * - Schedules
 * - Attendance records
 * - Fee items and invoices
 * - Assessments and grades
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

// ==================== DATA GENERATORS ====================

const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];
const lastNames = ['Văn An', 'Thị Bình', 'Văn Cường', 'Thị Dung', 'Văn Em', 'Thị Gái', 'Văn Hùng', 'Thị Lan', 'Vân Minh', 'Thị Ngọc', 'Văn Phúc', 'Thị Quỳnh', 'Vân Rạng', 'Thị Sương', 'Văn Thành'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateFullName() {
  return `${randomElement(firstNames)} ${randomElement(lastNames)}`;
}

function generateEmail(role, identifier) {
  const clean = identifier.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${clean}@school.edu`;
}

function generateStudentCode(grade, index) {
  const year = new Date().getFullYear();
  return `${year}${grade}${String(index).padStart(4, '0')}`;
}

function generateTeacherCode(index) {
  return `GV${String(index).padStart(4, '0')}`;
}

function generatePhone() {
  return `09${Math.floor(Math.random() * 90000000) + 10000000}`;
}

// ==================== TEST DATA ====================

// Cache for existing users (populated once at start)
let existingUsersCache = null;

const grades = [
  { id: '6', name: '6', display_order: 1 },
  { id: '7', name: '7', display_order: 2 },
  { id: '8', name: '8', display_order: 3 },
  { id: '9', name: '9', display_order: 4 },
];

const classesByGrade = {
  '6': ['6A1', '6A2', '6A3', '6A4', '6A5', '6A6'],
  '7': ['7A1', '7A2', '7A3', '7A4', '7A5', '7A6'],
  '8': ['8A1', '8A2', '8A3', '8A4', '8A5', '8A6'],
  '9': ['9A1', '9A2', '9A3', '9A4', '9A5', '9A6'],
};

const subjects = [
  { id: 'toan', name: 'Toán', name_en: 'Mathematics', code: 'TOA', is_core: true, display_order: 1 },
  { id: 'van', name: 'Văn', name_en: 'Literature', code: 'VAN', is_core: true, display_order: 2 },
  { id: 'anh', name: 'Anh', name_en: 'English', code: 'ANH', is_core: true, display_order: 3 },
  { id: 'ly', name: 'Lý', name_en: 'Physics', code: 'LY', is_core: true, display_order: 4 },
  { id: 'hoa', name: 'Hóa', name_en: 'Chemistry', code: 'HOA', is_core: true, display_order: 5 },
  { id: 'sinh', name: 'Sinh', name_en: 'Biology', code: 'SINH', is_core: true, display_order: 6 },
  { id: 'su', name: 'Sử', name_en: 'History', code: 'SU', is_core: false, display_order: 7 },
  { id: 'dia', name: 'Địa', name_en: 'Geography', code: 'DIA', is_core: false, display_order: 8 },
  { id: 'gdcd', name: 'GDCD', name_en: 'Civic Education', code: 'GDCD', is_core: false, display_order: 9 },
  { id: 'tin', name: 'Tin', name_en: 'IT', code: 'TIN', is_core: false, display_order: 10 },
  { id: 'td', name: 'TD', name_en: 'Defense Education', code: 'TD', is_core: false, display_order: 11 },
  { id: 'hoa', name: 'Họa', name_en: 'Art', code: 'HOA_A', is_core: false, display_order: 12 },
  { id: 'nhac', name: 'Nhạc', name_en: 'Music', code: 'NHAC', is_core: false, display_order: 13 },
  { id: 'the_duc', name: 'Thể dục', name_en: 'PE', code: 'TD', is_core: false, display_order: 14 },
];

const feeItems = [
  { name: 'Học phí tháng 9', code: 'HP09', amount: 1500000, semester: '1', fee_type: 'mandatory' },
  { name: 'Học phí tháng 10', code: 'HP10', amount: 1500000, semester: '1', fee_type: 'mandatory' },
  { name: 'Học phí tháng 11', code: 'HP11', amount: 1500000, semester: '1', fee_type: 'mandatory' },
  { name: 'Học phí tháng 12', code: 'HP12', amount: 1500000, semester: '1', fee_type: 'mandatory' },
  { name: 'Tiết kiệm học phí', code: 'TKHP', amount: 500000, semester: '1', fee_type: 'voluntary' },
  { name: 'Bảo hiểm y tế', code: 'BHYT', amount: 500000, semester: '1', fee_type: 'mandatory' },
  { name: 'Đóng góp xây dựng trường', code: 'XDCT', amount: 300000, semester: '1', fee_type: 'voluntary' },
];

const periods = [
  { id: 1, name: 'Tiết 1', start_time: '07:00', end_time: '07:45', display_order: 1 },
  { id: 2, name: 'Tiết 2', start_time: '07:50', end_time: '08:35', display_order: 2 },
  { id: 3, name: 'Tiết 3', start_time: '08:40', end_time: '09:25', display_order: 3 },
  { id: 4, name: 'Tiết 4', start_time: '09:35', end_time: '10:20', display_order: 4 },
  { id: 5, name: 'Tiết 5', start_time: '10:25', end_time: '11:10', display_order: 5 },
  { id: 6, name: 'Tiết 6', start_time: '13:30', end_time: '14:15', display_order: 6 },
  { id: 7, name: 'Tiết 7', start_time: '14:20', end_time: '15:05', display_order: 7 },
  { id: 8, name: 'Tiết 8', start_time: '15:10', end_time: '15:55', display_order: 8 },
];

// ==================== CREATION FUNCTIONS ====================

async function getAllUsers() {
  let allUsers = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page: page,
      perPage: 1000,
    });

    if (error) {
      console.error('Error listing users:', error.message);
      break;
    }

    allUsers = allUsers.concat(data.users);
    hasMore = data.users.length === 1000; // If we got a full page, there might be more
    page++;
  }

  return allUsers;
}

async function createAuthUser(email, password, fullName, role) {
  // Use cache if available, otherwise fetch once
  if (!existingUsersCache) {
    console.log('  📋 Fetching all existing users...');
    existingUsersCache = await getAllUsers();
    console.log(`     Found ${existingUsersCache.length} existing users`);
  }

  const userWithEmail = existingUsersCache.find(u => u.email === email);

  if (userWithEmail) {
    console.log(`    ⚠️  User already exists: ${email}`);
    return userWithEmail;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  // Handle email_exists error gracefully
  if (error && error.code === 'email_exists') {
    console.log(`    ⚠️  User already exists (from error): ${email}`);
    // Refresh cache to get the newly created user
    existingUsersCache = await getAllUsers();
    const existing = existingUsersCache.find(u => u.email === email);
    if (existing) return existing;
    // If still not found, return null to skip this user
    return null;
  }

  if (error) throw error;

  // Add new user to cache
  existingUsersCache.push(data.user);
  return data.user;
}

async function createProfile(userId, email, role, fullName) {
  // Check if profile exists
  const { data: existingProfile } = await supabase.from('profiles').select('id').eq('id', userId).single();

  if (existingProfile) {
    console.log(`    ⚠️  Profile already exists for ${email}`);
    return;
  }

  const { error } = await supabase.from('profiles').insert({
    id: userId,
    email,
    role,
    full_name: fullName,
    phone: role === 'parent' ? generatePhone() : null,
    status: 'active',
  });
  if (error) throw error;
}

async function createUser(userId, email, role, fullName, code) {
  // Skip if userId is null (user already exists but couldn't be found)
  if (!userId) {
    console.log(`    ⏭️  Skipping profile creation for existing user: ${email}`);
    return;
  }

  await createProfile(userId, email, role, fullName);

  if (role === 'admin') {
    await supabase.from('admins').insert({ id: userId, admin_code: code });
  } else if (role === 'teacher') {
    await supabase.from('teachers').insert({ id: userId, employee_code: code });
  } else if (role === 'student') {
    await supabase.from('students').insert({ id: userId, student_code: code });
  } else if (role === 'parent') {
    await supabase.from('parents').insert({ id: userId });
  }
}

// ==================== MAIN DUMP FUNCTION ====================

async function dumpTestData() {
  console.log('🚀 Starting comprehensive test data dump...\n');

  const createdUsers = {
    admins: [],
    teachers: [],
    students: [],
    parents: [],
  };

  try {
    // ==================== STEP 1: CREATE USERS ====================
    console.log('📝 Step 1: Creating users...');

    // Create 2 admins
    console.log('  Creating admins...');
    for (let i = 1; i <= 2; i++) {
      const fullName = generateFullName();
      const code = `AD00${i}`;
      const email = generateEmail('admin', code);
      const authUser = await createAuthUser(email, 'Test123456!', fullName, 'admin');
      if (!authUser) {
        console.log(`    ⏭️  Skipping existing admin: ${email}`);
        continue;
      }
      await createUser(authUser.id, email, 'admin', fullName, code);
      createdUsers.admins.push({ id: authUser.id, email, code, name: fullName });
      console.log(`    ✅ Admin ${i}: ${email} (${code})`);
    }

    // Create 15 teachers
    console.log('  Creating teachers...');
    for (let i = 1; i <= 15; i++) {
      const fullName = generateFullName();
      const code = generateTeacherCode(i);
      const email = generateEmail('teacher', code);
      const authUser = await createAuthUser(email, 'Test123456!', fullName, 'teacher');
      if (!authUser) {
        console.log(`    ⏭️  Skipping existing teacher: ${email}`);
        continue;
      }
      await createUser(authUser.id, email, 'teacher', fullName, code);
      createdUsers.teachers.push({ id: authUser.id, email, code, name: fullName });
      console.log(`    ✅ Teacher ${i}: ${email} (${code})`);
    }

    // Create students and parents
    console.log('  Creating students and parents...');
    let studentIndex = 1;
    const allClasses = [];

    for (const grade of grades) {
      for (const className of classesByGrade[grade.name]) {
        allClasses.push({ name: className, grade: grade.id });

        // Create 40 students per class
        for (let j = 1; j <= 40; j++) {
          const studentFullName = generateFullName();
          const studentCode = generateStudentCode(grade.id, studentIndex);
          const studentEmail = generateEmail('student', studentCode);
          const studentAuthUser = await createAuthUser(studentEmail, 'Test123456!', studentFullName, 'student');
          if (!studentAuthUser) {
            console.log(`    ⏭️  Skipping existing student: ${studentEmail}`);
            studentIndex++;
            continue;
          }
          await createUser(studentAuthUser.id, studentEmail, 'student', studentFullName, studentCode);

          // Create parent for each student
          const parentFullName = generateFullName();
          const parentEmail = `ph${studentCode}@school.edu`;
          const parentAuthUser = await createAuthUser(parentEmail, 'Test123456!', parentFullName, 'parent');
          if (!parentAuthUser) {
            console.log(`    ⏭️  Skipping existing parent: ${parentEmail}`);
            createdUsers.students.push({
              id: studentAuthUser.id,
              email: studentEmail,
              code: studentCode,
              name: studentFullName,
              class: className,
              parentId: null,
            });
            studentIndex++;
            continue;
          }
          await createUser(parentAuthUser.id, parentEmail, 'parent', parentFullName, null);

          createdUsers.students.push({
            id: studentAuthUser.id,
            email: studentEmail,
            code: studentCode,
            name: studentFullName,
            class: className,
            parentId: parentAuthUser.id,
          });
          createdUsers.parents.push({ id: parentAuthUser.id, email: parentEmail, name: parentFullName });

          studentIndex++;
        }
      }
    }
    console.log(`    ✅ Created ${studentIndex - 1} students with parents`);

    // ==================== STEP 2: CREATE ACADEMIC STRUCTURE ====================
    console.log('\n📚 Step 2: Creating academic structure...');

    // Create grades
    console.log('  Creating grades...');
    for (const grade of grades) {
      const { error } = await supabase.from('grades').insert(grade);
      if (error) console.error(`    ❌ Error creating grade ${grade.name}:`, error.message);
      else console.log(`    ✅ Grade: ${grade.name}`);
    }

    // Create classes
    console.log('  Creating classes...');
    const createdClasses = [];
    for (const classInfo of allClasses) {
      const classData = {
        name: classInfo.name,
        grade_id: classInfo.grade,
        room: `P${Math.floor(Math.random() * 30) + 1}`,
        current_students: 40,
        status: 'active',
      };
      const { data, error } = await supabase.from('classes').insert(classData).select().single();
      if (error) console.error(`    ❌ Error creating class ${classInfo.name}:`, error.message);
      else {
        createdClasses.push({ id: data.id, name: classInfo.name, grade: classInfo.grade });
        console.log(`    ✅ Class: ${classInfo.name}`);
      }
    }

    // Create subjects
    console.log('  Creating subjects...');
    const createdSubjects = [];
    for (const subject of subjects) {
      const { data, error } = await supabase.from('subjects').insert(subject).select().single();
      if (error) console.error(`    ❌ Error creating subject ${subject.name}:`, error.message);
      else {
        createdSubjects.push(data);
        console.log(`    ✅ Subject: ${subject.name}`);
      }
    }

    // Create periods
    console.log('  Creating periods...');
    for (const period of periods) {
      const { error } = await supabase.from('periods').insert(period);
      if (error) console.error(`    ❌ Error creating period ${period.name}:`, error.message);
      else console.log(`    ✅ Period: ${period.name}`);
    }

    // ==================== STEP 3: CREATE ENROLLMENTS ====================
    console.log('\n📋 Step 3: Creating enrollments...');
    let enrollmentCount = 0;
    for (const student of createdUsers.students) {
      const classData = createdClasses.find(c => c.name === student.class);
      if (classData) {
        const { error } = await supabase.from('enrollments').insert({
          student_id: student.id,
          class_id: classData.id,
          status: 'active',
          enrolled_date: new Date().toISOString(),
        });
        if (!error) enrollmentCount++;
      }
    }
    console.log(`  ✅ Created ${enrollmentCount} enrollments`);

    // ==================== STEP 4: CREATE SCHEDULES ====================
    console.log('\n📅 Step 4: Creating teacher schedules...');
    let scheduleCount = 0;
    const daysOfWeek = [1, 2, 3, 4, 5]; // Mon-Fri

    for (const teacher of createdUsers.teachers) {
      // Assign 2-4 subjects per teacher
      const assignedSubjects = [];
      for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
        const subject = randomElement(createdSubjects);
        if (!assignedSubjects.find(s => s.id === subject.id)) {
          assignedSubjects.push(subject);
        }
      }

      // Create schedules for each day
      for (const day of daysOfWeek) {
        // 3-5 periods per day
        const periodsPerDay = 3 + Math.floor(Math.random() * 3);
        const usedPeriods = [];

        for (let i = 0; i < periodsPerDay; i++) {
          let period;
          do {
            period = randomElement(periods);
          } while (usedPeriods.includes(period.id));
          usedPeriods.push(period.id);

          const subject = randomElement(assignedSubjects);
          const classData = randomElement(createdClasses);

          const { error } = await supabase.from('schedules').insert({
            teacher_id: teacher.id,
            class_id: classData.id,
            subject_id: subject.id,
            period_id: period.id,
            day_of_week: day,
            room: `P${Math.floor(Math.random() * 30) + 1}`,
            academic_year_id: 1,
          });
          if (!error) scheduleCount++;
        }
      }
    }
    console.log(`  ✅ Created ${scheduleCount} schedule entries`);

    // ==================== STEP 5: CREATE FEE ITEMS ====================
    console.log('\n💰 Step 5: Creating fee items...');
    for (const fee of feeItems) {
      const { error } = await supabase.from('fee_items').insert({
        name: fee.name,
        code: fee.code,
        amount: fee.amount,
        semester: fee.semester,
        fee_type: fee.fee_type,
        status: 'active',
      });
      if (error) console.error(`    ❌ Error creating fee ${fee.name}:`, error.message);
      else console.log(`    ✅ Fee item: ${fee.name}`);
    }

    // ==================== STEP 6: CREATE INVOICES ====================
    console.log('\n📄 Step 6: Creating invoices...');
    const statuses = ['paid', 'pending', 'overdue'];
    let invoiceCount = 0;
    const currentYear = new Date().getFullYear();

    for (const student of createdUsers.students) {
      // Create 2-4 invoices per student
      for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
        const fee = randomElement(feeItems);
        const status = randomElement(statuses);
        const dueMonth = 8 + Math.floor(Math.random() * 5); // Sep-Dec
        const dueDate = new Date(currentYear, dueMonth, 15).toISOString().split('T')[0];

        let paidDate = null;
        let paidAmount = 0;
        if (status === 'paid') {
          paidDate = new Date(currentYear, dueMonth, Math.floor(Math.random() * 10) + 1).toISOString().split('T')[0];
          paidAmount = fee.amount;
        }

        const { error } = await supabase.from('invoices').insert({
          student_id: student.id,
          fee_item_id: 1, // Will reference actual fee_item
          total_amount: fee.amount,
          paid_amount: paidAmount,
          status,
          due_date: dueDate,
          paid_date: paidDate,
          academic_year_id: 1,
        });
        if (!error) invoiceCount++;
      }
    }
    console.log(`  ✅ Created ${invoiceCount} invoices`);

    // ==================== STEP 7: CREATE ATTENDANCE ====================
    console.log('\n✓ Step 7: Creating attendance records...');
    const attendanceStatuses = ['present', 'present', 'present', 'present', 'present', 'present', 'present', 'late', 'excused', 'absent'];
    let attendanceCount = 0;
    const today = new Date();

    // Create attendance for last 30 days
    for (let day = 0; day < 30; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends

      const dateStr = date.toISOString().split('T')[0];

      for (const student of createdUsers.students) {
        const status = randomElement(attendanceStatuses);
        const classData = createdClasses.find(c => c.name === student.class);
        if (classData) {
          const { error } = await supabase.from('attendance').insert({
            student_id: student.id,
            class_id: classData.id,
            date: dateStr,
            status,
            recorded_by: randomElement(createdUsers.teachers).id,
          });
          if (!error) attendanceCount++;
        }
      }
    }
    console.log(`  ✅ Created ${attendanceCount} attendance records`);

    // ==================== STEP 8: CREATE ASSESSMENTS ====================
    console.log('\n📝 Step 8: Creating assessments...');
    let assessmentCount = 0;
    const assessmentTypes = ['15 phút', '1 tiết', 'Giữa kỳ', 'Cuối kỳ'];

    for (const teacher of createdUsers.teachers) {
      // Get teacher's classes
      const { data: teacherSchedules } = await supabase
        .from('schedules')
        .select('class_id, subject_id')
        .eq('teacher_id', teacher.id);

      if (teacherSchedules && teacherSchedules.length > 0) {
        const uniqueClasses = [...new Set(teacherSchedules.map(s => s.class_id))];

        for (const classId of uniqueClasses) {
          const schedule = teacherSchedules.find(s => s.class_id === classId);

          // Create 3-5 assessments per class
          for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
            const assessmentMonth = 9 + Math.floor(Math.random() * 4);
            const { error } = await supabase.from('assessments').insert({
              teacher_id: teacher.id,
              class_id: classId,
              subject_id: schedule.subject_id,
              name: `${randomElement(assessmentTypes)} - ${randomElement(createdSubjects).name}`,
              assessment_type: randomElement(['quiz', 'midterm', 'final']),
              date: new Date(currentYear, assessmentMonth, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
              max_score: 10,
              semester: '1',
            });
            if (!error) assessmentCount++;
          }
        }
      }
    }
    console.log(`  ✅ Created ${assessmentCount} assessments`);

    // ==================== SUMMARY ====================
    console.log('\n🎉 Test data dump complete!\n');
    console.log('Summary:');
    console.log(`  Admins: ${createdUsers.admins.length}`);
    console.log(`  Teachers: ${createdUsers.teachers.length}`);
    console.log(`  Students: ${createdUsers.students.length}`);
    console.log(`  Parents: ${createdUsers.parents.length}`);
    console.log(`  Classes: ${createdClasses.length}`);
    console.log(`  Subjects: ${createdSubjects.length}`);
    console.log(`  Enrollments: ${enrollmentCount}`);
    console.log(`  Schedule entries: ${scheduleCount}`);
    console.log(`  Invoices: ${invoiceCount}`);
    console.log(`  Attendance records: ${attendanceCount}`);
    console.log(`  Assessments: ${assessmentCount}`);

    console.log('\n🔐 Login credentials:');
    console.log('  Password for all users: Test123456!');
    console.log(`  Admins: ${createdUsers.admins.map(a => a.email).join(', ')}`);
    console.log(`  Teachers: ${createdUsers.teachers.slice(0, 3).map(t => t.email).join(', ')}...`);
    console.log(`  Students: ${createdUsers.students.slice(0, 3).map(s => s.email).join(', ')}...`);
    console.log(`  Parents: ${createdUsers.parents.slice(0, 3).map(p => p.email).join(', ')}...`);

  } catch (error) {
    console.error('\n❌ Error during data dump:', error.message);
    throw error;
  }
}

// Run the dump
dumpTestData().catch(console.error);
