/**
 * Academic Structure Creation Script
 * Run with: node scripts/create-academic-structure.js
 *
 * Creates ONLY the academic structure (grades, classes, subjects, periods, enrollments, schedules)
 * Skips user creation - assumes users already exist
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

// ==================== DATA DEFINITIONS ====================

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
  { id: 'hoa_a', name: 'Họa', name_en: 'Art', code: 'HOA_A', is_core: false, display_order: 12 },
  { id: 'nhac', name: 'Nhạc', name_en: 'Music', code: 'NHAC', is_core: false, display_order: 13 },
  { id: 'the_duc', name: 'Thể dục', name_en: 'PE', code: 'PE', is_core: false, display_order: 14 },
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

const feeItems = [
  { name: 'Học phí tháng 9', code: 'HP09', amount: 1500000, semester: '1', fee_type: 'mandatory' },
  { name: 'Học phí tháng 10', code: 'HP10', amount: 1500000, semester: '1', fee_type: 'mandatory' },
  { name: 'Học phí tháng 11', code: 'HP11', amount: 1500000, semester: '1', fee_type: 'mandatory' },
  { name: 'Học phí tháng 12', code: 'HP12', amount: 1500000, semester: '1', fee_type: 'mandatory' },
  { name: 'Tiết kiệm học phí', code: 'TKHP', amount: 500000, semester: '1', fee_type: 'voluntary' },
  { name: 'Bảo hiểm y tế', code: 'BHYT', amount: 500000, semester: '1', fee_type: 'mandatory' },
  { name: 'Đóng góp xây dựng trường', code: 'XDCT', amount: 300000, semester: '1', fee_type: 'voluntary' },
];

const weekdays = [2, 3, 4, 5, 6, 7]; // Monday=2, Tuesday=3, ..., Saturday=7 (Sunday=1 skipped)

const statuses = ['present', 'absent', 'late', 'excused'];

// ==================== MAIN FUNCTIONS ====================

async function createGrades() {
  console.log('\n📚 Creating grades...');
  for (const grade of grades) {
    try {
      const { error } = await supabase.from('grades').upsert(grade, { onConflict: 'id' });
      if (error) throw error;
      console.log(`  ✅ Grade ${grade.name}`);
    } catch (err) {
      console.error(`  ❌ Error creating grade ${grade.name}:`, err.message);
    }
  }
}

async function createSubjects() {
  console.log('\n📖 Creating subjects...');
  for (const subject of subjects) {
    try {
      const { error } = await supabase.from('subjects').upsert(subject, { onConflict: 'id' });
      if (error) throw error;
      console.log(`  ✅ Subject ${subject.name} (${subject.code})`);
    } catch (err) {
      console.error(`  ❌ Error creating subject ${subject.name}:`, err.message);
    }
  }
}

async function createPeriods() {
  console.log('\n⏰ Creating periods...');
  for (const period of periods) {
    try {
      const { error } = await supabase.from('periods').upsert(period, { onConflict: 'id' });
      if (error) throw error;
      console.log(`  ✅ Period ${period.name} (${period.start_time} - ${period.end_time})`);
    } catch (err) {
      console.error(`  ❌ Error creating period ${period.name}:`, err.message);
    }
  }
}

async function createClasses() {
  console.log('\n🏫 Creating classes...');
  let totalCreated = 0;

  for (const [gradeId, classNames] of Object.entries(classesByGrade)) {
    for (const className of classNames) {
      try {
        const { error } = await supabase.from('classes').upsert({
          id: className.toLowerCase(),
          name: className,
          grade_id: gradeId,
          capacity: 40,
          status: 'active',
        }, { onConflict: 'id' });

        if (error) throw error;
        console.log(`  ✅ Class ${className}`);
        totalCreated++;
      } catch (err) {
        console.error(`  ❌ Error creating class ${className}:`, err.message);
      }
    }
  }

  console.log(`  📊 Total classes created: ${totalCreated}`);
  return totalCreated;
}

async function createEnrollments() {
  console.log('\n📝 Creating enrollments...');

  // Get all students
  const { data: students, error: studentError } = await supabase
    .from('students')
    .select('id, student_code');

  if (studentError) {
    console.error('  ❌ Error fetching students:', studentError.message);
    return;
  }

  if (!students || students.length === 0) {
    console.log('  ⚠️  No students found');
    return;
  }

  console.log(`  📊 Found ${students.length} students`);

  // Get all classes
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('id, name, grade_id');

  if (classError) {
    console.error('  ❌ Error fetching classes:', classError.message);
    return;
  }

  if (!classes || classes.length === 0) {
    console.log('  ⚠️  No classes found');
    return;
  }

  // Group classes by grade
  const classesByGradeMap = {};
  for (const cls of classes) {
    if (!classesByGradeMap[cls.grade_id]) {
      classesByGradeMap[cls.grade_id] = [];
    }
    classesByGradeMap[cls.grade_id].push(cls);
  }

  const gradeIds = Object.keys(classesByGradeMap);
  console.log(`  📊 Found classes for grades: ${gradeIds.join(', ')}`);

  let enrollmentsCreated = 0;
  let studentIndex = 0;

  // Assign students to classes round-robin by grade
  for (const student of students) {
    // Try to determine grade from student_code, or assign randomly
    let gradeId = '6'; // default for middle school

    const code = student.student_code;
    if (code && code.length >= 7) {
      // Format might be YYYY6<grade>XXX or similar
      // Try to find grade pattern in code (middle school: 6, 7, 8, 9)
      if (code.includes('9')) {
        gradeId = '9';
      } else if (code.includes('8')) {
        gradeId = '8';
      } else if (code.includes('7')) {
        gradeId = '7';
      } else if (code.includes('6')) {
        gradeId = '6';
      }
    }

    // Assign grade based on index for even distribution if not determined from code
    if (!code) {
      gradeId = gradeIds[studentIndex % gradeIds.length];
    }

    const availableClasses = classesByGradeMap[gradeId] || classesByGradeMap['6'];
    if (!availableClasses || availableClasses.length === 0) continue;

    // Assign to class round-robin
    const classIndex = studentIndex % availableClasses.length;
    const assignedClass = availableClasses[classIndex];

    try {
      const { error } = await supabase.from('enrollments').insert({
        student_id: student.id,
        class_id: assignedClass.id,
        status: 'active',
        enrollment_date: new Date().toISOString().split('T')[0],
      });

      if (error) throw error;
      enrollmentsCreated++;
      studentIndex++;
    } catch (err) {
      // Skip duplicate errors
      if (!err.message.includes('duplicate') && !err.message.includes('unique')) {
        console.error(`  ❌ Error enrolling student ${code}:`, err.message);
      }
    }
  }

  console.log(`  ✅ Created ${enrollmentsCreated} enrollments`);
}

async function createSchedules() {
  console.log('\n📅 Creating schedules...');

  // Get all classes
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('id, name');

  if (classError) {
    console.error('  ❌ Error fetching classes:', classError.message);
    return;
  }

  if (!classes || classes.length === 0) {
    console.log('  ⚠️  No classes found');
    return;
  }

  console.log(`  📊 Found ${classes.length} classes`);

  // Get all subjects
  const { data: allSubjects, error: subjectError } = await supabase
    .from('subjects')
    .select('id, name, code');

  if (subjectError) {
    console.error('  ❌ Error fetching subjects:', subjectError.message);
    return;
  }

  // Get all periods
  const { data: allPeriods, error: periodError } = await supabase
    .from('periods')
    .select('id, name');

  if (periodError) {
    console.error('  ❌ Error fetching periods:', periodError.message);
    return;
  }

  // Get all teachers
  const { data: allTeachers, error: teacherError } = await supabase
    .from('teachers')
    .select('id');

  if (teacherError) {
    console.error('  ❌ Error fetching teachers:', teacherError.message);
    return;
  }

  if (!allTeachers || allTeachers.length === 0) {
    console.log('  ⚠️  No teachers found');
    return;
  }

  let schedulesCreated = 0;

  // Create schedule for each class
  for (const cls of classes) {
    for (const dayOfWeek of weekdays) {
      // Assign subjects to periods (5-6 periods per day)
      const dailySubjects = allSubjects
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      for (let i = 0; i < dailySubjects.length; i++) {
        const subject = dailySubjects[i];
        const period = allPeriods[i];
        // Random teacher for this subject
        const teacher = allTeachers[Math.floor(Math.random() * allTeachers.length)];

        try {
          const { error } = await supabase.from('schedules').insert({
            class_id: cls.id,
            subject_id: subject.id,
            teacher_id: teacher.id,
            period_id: period.id,
            day_of_week: dayOfWeek,
            room: `Phòng ${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`,
          });

          if (error) throw error;
          schedulesCreated++;
        } catch (err) {
          if (!err.message.includes('duplicate')) {
            console.error(`  ❌ Error creating schedule for ${cls.name}:`, err.message);
          }
        }
      }
    }
  }

  console.log(`  ✅ Created ${schedulesCreated} schedule entries`);
}

async function createFeeItems() {
  console.log('\n💰 Creating fee items...');
  for (const item of feeItems) {
    try {
      const { error } = await supabase.from('fee_items').upsert(item, { onConflict: 'code' });
      if (error) throw error;
      console.log(`  ✅ Fee item ${item.name} (${item.code}): ${item.amount.toLocaleString()}đ`);
    } catch (err) {
      console.error(`  ❌ Error creating fee item ${item.name}:`, err.message);
    }
  }
}

async function createInvoices() {
  console.log('\n🧾 Creating invoices...');
  console.log('  ⚠️  Skipping invoice creation (requires fee_assignments setup)');
  // TODO: Implement proper invoice creation with fee_assignments
  // The invoices table requires fee_assignment_id, not fee_item_code
}

async function createAttendance() {
  console.log('\n📋 Creating attendance records...');

  // Get all enrollments
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from('enrollments')
    .select('student_id, class_id');

  if (enrollmentsError) {
    console.error('  ❌ Error fetching enrollments:', enrollmentsError.message);
    return;
  }

  if (!enrollments || enrollments.length === 0) {
    console.log('  ⚠️  No enrollments found');
    return;
  }

  console.log(`  📊 Found ${enrollments.length} enrollments`);

  // Get all periods
  const { data: allPeriods } = await supabase
    .from('periods')
    .select('id');

  let attendanceCreated = 0;

  // Create attendance for last 5 days only (reduced from 30 for faster execution)
  const today = new Date();
  for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const weekday = date.getDay();
    if (weekday === 0 || weekday === 6) continue; // Skip weekends (Sunday=0, Saturday=6)

    const dateStr = date.toISOString().split('T')[0];
    console.log(`  📅 Creating attendance for ${dateStr}...`);

    for (const enrollment of enrollments) {
      for (const period of allPeriods) {
        const status = randomElement(statuses);

        try {
          // Changed from upsert to insert due to no unique constraint
          const { error } = await supabase.from('attendance').insert({
            student_id: enrollment.student_id,
            class_id: enrollment.class_id,
            date: dateStr,
            period_id: period.id,
            status: status,
          });

          if (error) throw error;
          attendanceCreated++;
        } catch (err) {
          if (!err.message.includes('duplicate') && !err.message.includes('unique')) {
            console.error(`  ❌ Error creating attendance:`, err.message);
          }
        }
      }
    }
  }

  console.log(`  ✅ Created ${attendanceCreated} attendance records`);
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ==================== MAIN EXECUTION ====================

async function main() {
  console.log('🚀 Starting Academic Structure Creation...');
  console.log('='.repeat(60));

  try {
    await createGrades();
    await createSubjects();
    await createPeriods();
    await createClasses();
    await createEnrollments();
    await createSchedules();
    await createFeeItems();
    await createInvoices();
    await createAttendance();

    console.log('\n' + '='.repeat(60));
    console.log('✅ Academic structure created successfully!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

main();
