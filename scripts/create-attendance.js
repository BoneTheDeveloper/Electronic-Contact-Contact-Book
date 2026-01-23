/**
 * Quick Attendance Creation Script
 * Run with: node scripts/create-attendance.js
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

const statuses = ['present', 'absent', 'late', 'excused'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function createAttendance() {
  console.log('📋 Creating attendance records...');

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

  if (!allPeriods || allPeriods.length === 0) {
    console.log('  ⚠️  No periods found');
    return;
  }

  console.log(`  📊 Found ${allPeriods.length} periods`);

  let attendanceCreated = 0;
  let batchNumber = 0;
  const batchSize = 100;

  // Create attendance for last 5 days only
  const today = new Date();
  for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const weekday = date.getDay();
    if (weekday === 0 || weekday === 6) continue; // Skip weekends

    const dateStr = date.toISOString().split('T')[0];
    console.log(`  📅 Creating attendance for ${dateStr}...`);

    // Create batches of attendance records
    const attendanceRecords = [];
    for (const enrollment of enrollments) {
      for (const period of allPeriods) {
        attendanceRecords.push({
          student_id: enrollment.student_id,
          class_id: enrollment.class_id,
          date: dateStr,
          period_id: period.id,
          status: randomElement(statuses),
        });

        // Insert in batches
        if (attendanceRecords.length >= batchSize) {
          const { error } = await supabase.from('attendance').insert(attendanceRecords);
          if (error) {
            console.error(`  ❌ Batch error:`, error.message);
          } else {
            attendanceCreated += attendanceRecords.length;
            batchNumber++;
            if (batchNumber % 10 === 0) {
              console.log(`    Processed ${attendanceCreated} records...`);
            }
          }
          attendanceRecords.length = 0; // Clear array
        }
      }
    }

    // Insert remaining records
    if (attendanceRecords.length > 0) {
      const { error } = await supabase.from('attendance').insert(attendanceRecords);
      if (error) {
        console.error(`  ❌ Final batch error:`, error.message);
      } else {
        attendanceCreated += attendanceRecords.length;
      }
    }
  }

  console.log(`  ✅ Created ${attendanceCreated} attendance records`);
}

createAttendance().catch(console.error);
