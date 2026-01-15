import { PrismaClient } from '@prisma/client';
import * as seedData from './lib/seed-data';

const prisma = new PrismaClient();

// User role constants for SQLite (no native enum support)
const UserRole = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
} as const;

async function main() {
  console.log(' Starting database seed...');

  // Clean existing data
  console.log(' Cleaning existing data...');
  await prisma.attendance.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.fee.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();
  console.log(' Data cleaned');

  // Create Admin
  console.log(' Creating admin user...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@econtact.vn',
      name: 'Nguyễn Văn Admin',
      role: UserRole.ADMIN,
      password: 'mock123',
    },
  });
  console.log(` Created admin: ${admin.name}`);

  // Create Subjects
  console.log(' Creating subjects...');
  const subjects = await Promise.all(
    seedData.subjectNames.map((subject) =>
      prisma.subject.create({
        data: {
          name: subject.name,
          code: subject.code,
        },
      })
    )
  );
  console.log(` Created ${subjects.length} subjects`);

  // Create Classes
  console.log(' Creating classes...');
  const classes = await Promise.all(
    seedData.classConfigs.map((config) =>
      prisma.class.create({
        data: {
          name: config.name,
          gradeLevel: config.gradeLevel,
          academicYear: '2025-2026',
        },
      })
    )
  );
  console.log(` Created ${classes.length} classes`);

  // Create Teachers
  console.log(' Creating teachers...');
  const teacherCount = 8;
  const teachers = await Promise.all(
    Array.from({ length: teacherCount }, async (_, i) => {
      const name = seedData.generateVietnameseName();
      const subject = subjects[i % subjects.length];

      const user = await prisma.user.create({
        data: {
          email: seedData.generateEmail(name),
          name,
          role: UserRole.TEACHER,
          password: 'mock123',
        },
      });

      return prisma.teacher.create({
        data: {
          userId: user.id,
          subjectId: subject.id,
        },
        include: {
          user: true,
        },
      });
    })
  );

  // Assign homeroom teachers to classes
  for (let i = 0; i < classes.length; i++) {
    await prisma.class.update({
      where: { id: classes[i].id },
      data: {
        homeroomTeacherId: teachers[i % teachers.length].id,
      },
    });
  }
  console.log(` Created ${teachers.length} teachers`);

  // Create Students and Parents
  console.log(' Creating students and parents...');
  const studentsPerClass = 5;
  const students: any[] = [];

  for (const classItem of classes) {
    for (let i = 0; i < studentsPerClass; i++) {
      const name = seedData.generateVietnameseName();

      // Create student user and student record
      const studentUser = await prisma.user.create({
        data: {
          email: seedData.generateEmail(name),
          name,
          role: UserRole.STUDENT,
          password: 'mock123',
        },
      });

      const student = await prisma.student.create({
        data: {
          userId: studentUser.id,
          classId: classItem.id,
        },
        include: {
          user: true,
        },
      });

      students.push(student);
    }
  }
  console.log(` Created ${students.length} students`);

  // Create Parents and link to students
  console.log(' Creating parents...');
  const parentCount = 12;
  const createdParents: any[] = [];

  for (let i = 0; i < parentCount; i++) {
    const name = seedData.generateVietnameseName();

    const parentUser = await prisma.user.create({
      data: {
        email: seedData.generateEmail(name),
        name,
        role: UserRole.PARENT,
        password: 'mock123',
      },
    });

    // Assign 1-3 children to each parent
    const numChildren = Math.floor(Math.random() * 3) + 1;
    const childIndices = [];
    while (childIndices.length < numChildren && childIndices.length < students.length) {
      const idx = Math.floor(Math.random() * students.length);
      if (!childIndices.includes(idx)) {
        childIndices.push(idx);
      }
    }

    const parent = await prisma.parent.create({
      data: {
        userId: parentUser.id,
        phone: seedData.generatePhone(),
        address: seedData.generateAddress(),
        children: {
          connect: childIndices.map((idx) => ({ id: students[idx].id })),
        },
      },
      include: {
        user: true,
        children: true,
      },
    });

    createdParents.push(parent);

    // Update students to have parentId
    for (const idx of childIndices) {
      await prisma.student.update({
        where: { id: students[idx].id },
        data: { parentId: parent.id },
      });
    }
  }
  console.log(` Created ${createdParents.length} parents`);

  // Create Grades
  console.log(' Creating grades...');
  const gradesCount = 60;
  const terms = ['I', 'II'];

  for (let i = 0; i < gradesCount; i++) {
    const student = seedData.getRandomItem(students);
    const subject = seedData.getRandomItem(subjects);
    const term = seedData.getRandomItem(terms);
    const score = seedData.generateScore(6, 10);

    await prisma.grade.create({
      data: {
        studentId: student.id,
        subjectId: subject.id,
        term,
        score,
      },
    });
  }
  console.log(` Created ${gradesCount} grades`);

  // Create Attendance records
  console.log(' Creating attendance records...');
  const attendanceCount = 120;
  const statuses = ['present', 'absent', 'late', 'excused'];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 60); // Last 60 days

  for (let i = 0; i < attendanceCount; i++) {
    const student = seedData.getRandomItem(students);
    const date = seedData.generateDateInRange(startDate, today);
    const status = seedData.getRandomItem(statuses);

    await prisma.attendance.create({
      data: {
        studentId: student.id,
        date,
        status,
      },
    });
  }
  console.log(` Created ${attendanceCount} attendance records`);

  // Create Fees
  console.log(' Creating fees...');
  const feeTypes = ['Học phí', 'Tiền ăn', 'Tiền sách', 'Phí hoạt động', 'Tiền đồng phục'];
  const feeStatuses = ['paid', 'pending', 'overdue'];

  for (const student of students.slice(0, 20)) {
    const numFees = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numFees; i++) {
      const feeType = seedData.getRandomItem(feeTypes);
      const amount = feeType === 'Học phí' ? 2000000 : Math.floor(Math.random() * 500000) + 100000;
      const dueDate = seedData.generateDateInPast(30);
      const status = seedData.getRandomItem(feeStatuses);

      await prisma.fee.create({
        data: {
          studentId: student.id,
          amount,
          dueDate,
          status,
        },
      });
    }
  }
  console.log(` Created fees`);

  // Create Notifications
  console.log(' Creating notifications...');
  const notifications = [
    { title: 'Thông báo nghỉ tết Nguyên Đán', message: 'Nhà trường xin thông báo lịch nghỉ tết từ ngày...', type: 'school' },
    { title: 'Lịch thi cuối kỳ', message: 'Kỳ thi cuối kỳ sẽ diễn ra từ ngày...', type: 'class' },
    { title: 'Nhắc nộp học phí', message: 'Vui lòng nộp học phí trước ngày...', type: 'payment' },
    { title: 'Họp phụ huynh', message: 'Nhà trường tổ chức họp phụ huynh vào ngày...', type: 'school' },
    { title: 'Khai giảng năm học mới', message: 'Lễ khai giảng năm học 2025-2026 sẽ diễn ra...', type: 'school' },
  ];

  for (const notif of notifications) {
    await prisma.notification.create({
      data: {
        title: notif.title,
        message: notif.message,
        type: notif.type,
      },
    });
  }
  console.log(` Created ${notifications.length} notifications`);

  // Summary
  console.log('\n Seed Summary:');
  console.log(`   - Admin: 1`);
  console.log(`   - Teachers: ${teachers.length}`);
  console.log(`   - Parents: ${createdParents.length}`);
  console.log(`   - Students: ${students.length}`);
  console.log(`   - Classes: ${classes.length}`);
  console.log(`   - Subjects: ${subjects.length}`);
  console.log(`   - Grades: ${gradesCount}`);
  console.log(`   - Attendance: ${attendanceCount}`);
  console.log(`   - Notifications: ${notifications.length}`);
  console.log('\n Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(' Error during seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
