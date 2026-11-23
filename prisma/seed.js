const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Smart School Database Seeding ---');

  // Clear existing records safely
  const tablenames = [
    'Notification', 'Message', 'StaffPayroll', 'StaffLeave', 'Expense',
    'StudentTransport', 'TransportRoute', 'TransportVehicle', 'Event', 'Notice',
    'BookIssue', 'LibraryBook', 'HomeworkSubmission', 'Homework', 'Timetable',
    'FeePayment', 'FeeInvoice', 'FeeType', 'Grade', 'ExamResult', 'ExamSchedule',
    'Exam', 'TeacherAttendance', 'Attendance', 'ClassSubject', 'Subject',
    'Section', 'Student', 'Class', 'Teacher', 'Staff', 'Parent', 'User', 'SchoolSettings'
  ];

  for (const table of tablenames) {
    try {
      await prisma[table.charAt(0).toLowerCase() + table.slice(1)].deleteMany();
    } catch (e) {
      // Ignore if table doesn't exist yet
    }
  }

  // School Settings
  await prisma.schoolSettings.create({
    data: {
      schoolName: 'Smart Academy International',
      tagline: 'Inspiring Excellence, Fostering Innovation',
      address: '742 Evergreen Terrace, Springfield, OR',
      phone: '+1 (555) 839-2049',
      email: 'info@smartacademy.edu',
      website: 'https://smartacademy.edu',
      currency: 'USD',
      currencySymbol: '$',
      academicYear: '2026-2027',
    },
  });

  const defaultPassword = await bcrypt.hash('Password@123', 10);
  const adminPassword = await bcrypt.hash('Admin@123', 10);

  // 1. Create Users for all 8 Roles
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@smartacademy.edu',
      password: adminPassword,
      name: 'Alexander Wright',
      role: 'SUPER_ADMIN',
      phone: '+1 555-0100',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const schoolAdmin = await prisma.user.create({
    data: {
      email: 'schooladmin@smartacademy.edu',
      password: adminPassword,
      name: 'Victoria Vance',
      role: 'SCHOOL_ADMIN',
      phone: '+1 555-0101',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    },
  });

  const principal = await prisma.user.create({
    data: {
      email: 'principal@smartacademy.edu',
      password: defaultPassword,
      name: 'Dr. Arthur Pendelton',
      role: 'PRINCIPAL',
      phone: '+1 555-0102',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  });

  const teacherUser1 = await prisma.user.create({
    data: {
      email: 'teacher@smartacademy.edu',
      password: defaultPassword,
      name: 'Sarah Jenkins',
      role: 'TEACHER',
      phone: '+1 555-0103',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  const teacherUser2 = await prisma.user.create({
    data: {
      email: 'marcus.brooks@smartacademy.edu',
      password: defaultPassword,
      name: 'Marcus Brooks',
      role: 'TEACHER',
      phone: '+1 555-0104',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  });

  const teacherUser3 = await prisma.user.create({
    data: {
      email: 'elena.rostova@smartacademy.edu',
      password: defaultPassword,
      name: 'Elena Rostova',
      role: 'TEACHER',
      phone: '+1 555-0105',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
  });

  const parentUser = await prisma.user.create({
    data: {
      email: 'parent@smartacademy.edu',
      password: defaultPassword,
      name: 'Robert Sterling',
      role: 'PARENT',
      phone: '+1 555-0106',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
  });

  const studentUser1 = await prisma.user.create({
    data: {
      email: 'student@smartacademy.edu',
      password: defaultPassword,
      name: 'Ethan Sterling',
      role: 'STUDENT',
      phone: '+1 555-0107',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    },
  });

  const studentUser2 = await prisma.user.create({
    data: {
      email: 'chloe.adams@smartacademy.edu',
      password: defaultPassword,
      name: 'Chloe Adams',
      role: 'STUDENT',
      phone: '+1 555-0108',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    },
  });

  const accountantUser = await prisma.user.create({
    data: {
      email: 'accountant@smartacademy.edu',
      password: defaultPassword,
      name: 'Franklin Hayes',
      role: 'ACCOUNTANT',
      phone: '+1 555-0109',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    },
  });

  const librarianUser = await prisma.user.create({
    data: {
      email: 'librarian@smartacademy.edu',
      password: defaultPassword,
      name: 'Miriam Becker',
      role: 'LIBRARIAN',
      phone: '+1 555-0110',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
  });

  // 2. Teachers Profile
  const teacher1 = await prisma.teacher.create({
    data: {
      userId: teacherUser1.id,
      teacherId: 'TCH-2026-001',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      gender: 'Female',
      email: 'teacher@smartacademy.edu',
      phone: '+1 555-0103',
      address: '14 Elm Street, Springfield',
      designation: 'Senior Mathematics Instructor',
      qualification: 'M.Sc. in Applied Mathematics',
      department: 'Mathematics',
      salary: 5800.0,
      avatar: teacherUser1.avatar,
    },
  });

  const teacher2 = await prisma.teacher.create({
    data: {
      userId: teacherUser2.id,
      teacherId: 'TCH-2026-002',
      firstName: 'Marcus',
      lastName: 'Brooks',
      gender: 'Male',
      email: 'marcus.brooks@smartacademy.edu',
      phone: '+1 555-0104',
      address: '88 Oak Avenue, Springfield',
      designation: 'Head of Physics Department',
      qualification: 'Ph.D. in Physics',
      department: 'Science',
      salary: 6400.0,
      avatar: teacherUser2.avatar,
    },
  });

  const teacher3 = await prisma.teacher.create({
    data: {
      userId: teacherUser3.id,
      teacherId: 'TCH-2026-003',
      firstName: 'Elena',
      lastName: 'Rostova',
      gender: 'Female',
      email: 'elena.rostova@smartacademy.edu',
      phone: '+1 555-0105',
      address: '24 Maple Crescent, Springfield',
      designation: 'English Literature Lead',
      qualification: 'M.A. in English Literature',
      department: 'Humanities',
      salary: 5500.0,
      avatar: teacherUser3.avatar,
    },
  });

  // 3. Classes and Sections
  const classesData = [
    { name: 'Grade 8', numericGrade: 8, capacity: 40 },
    { name: 'Grade 9', numericGrade: 9, capacity: 40 },
    { name: 'Grade 10', numericGrade: 10, capacity: 45, classTeacherId: teacher1.id },
    { name: 'Grade 11', numericGrade: 11, capacity: 45, classTeacherId: teacher2.id },
    { name: 'Grade 12', numericGrade: 12, capacity: 50, classTeacherId: teacher3.id },
  ];

  const createdClasses = [];
  for (const c of classesData) {
    const cl = await prisma.class.create({ data: c });
    createdClasses.push(cl);

    // Create Sections A & B for each class
    await prisma.section.createMany({
      data: [
        { name: 'A', classId: cl.id, roomNumber: `Room ${c.numericGrade}01`, capacity: 25 },
        { name: 'B', classId: cl.id, roomNumber: `Room ${c.numericGrade}02`, capacity: 25 },
      ],
    });
  }

  const grade10 = createdClasses.find((c) => c.numericGrade === 10);
  const grade10Sections = await prisma.section.findMany({ where: { classId: grade10.id } });
  const section10A = grade10Sections.find((s) => s.name === 'A');
  const section10B = grade10Sections.find((s) => s.name === 'B');

  // 4. Subjects
  const subjectsData = [
    { name: 'Advanced Mathematics', code: 'MTH-101', type: 'THEORY', credits: 4 },
    { name: 'Physics & Laboratory', code: 'PHY-101', type: 'PRACTICAL', credits: 4 },
    { name: 'English Literature', code: 'ENG-101', type: 'THEORY', credits: 3 },
    { name: 'Chemistry', code: 'CHM-101', type: 'PRACTICAL', credits: 4 },
    { name: 'Computer Science', code: 'CS-101', type: 'PRACTICAL', credits: 4 },
    { name: 'World History', code: 'HIS-101', type: 'THEORY', credits: 3 },
  ];

  const createdSubjects = [];
  for (const s of subjectsData) {
    const subj = await prisma.subject.create({ data: s });
    createdSubjects.push(subj);
  }

  // Link Subjects to Grade 10
  await prisma.classSubject.createMany({
    data: [
      { classId: grade10.id, subjectId: createdSubjects[0].id, teacherId: teacher1.id },
      { classId: grade10.id, subjectId: createdSubjects[1].id, teacherId: teacher2.id },
      { classId: grade10.id, subjectId: createdSubjects[2].id, teacherId: teacher3.id },
      { classId: grade10.id, subjectId: createdSubjects[4].id, teacherId: teacher2.id },
    ],
  });

  // 5. Parent Record
  const parent = await prisma.parent.create({
    data: {
      userId: parentUser.id,
      fatherName: 'Robert Sterling',
      motherName: 'Claire Sterling',
      guardianName: 'Robert Sterling',
      occupation: 'Senior Software Architect',
      phone: '+1 555-0106',
      email: 'parent@smartacademy.edu',
      address: '742 Evergreen Terrace, Springfield',
      relation: 'Father',
    },
  });

  // 6. Students
  const student1 = await prisma.student.create({
    data: {
      userId: studentUser1.id,
      studentId: 'STD-2026-001',
      firstName: 'Ethan',
      lastName: 'Sterling',
      gender: 'Male',
      dob: new Date('2010-04-15'),
      bloodGroup: 'O+',
      religion: 'Christianity',
      email: 'student@smartacademy.edu',
      phone: '+1 555-0107',
      address: '742 Evergreen Terrace, Springfield',
      admissionNumber: 'ADM-2024-089',
      rollNumber: '1001',
      classId: grade10.id,
      sectionId: section10A.id,
      parentId: parent.id,
      status: 'ACTIVE',
      avatar: studentUser1.avatar,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      userId: studentUser2.id,
      studentId: 'STD-2026-002',
      firstName: 'Chloe',
      lastName: 'Adams',
      gender: 'Female',
      dob: new Date('2010-09-22'),
      bloodGroup: 'A+',
      religion: 'Christianity',
      email: 'chloe.adams@smartacademy.edu',
      phone: '+1 555-0108',
      address: '320 Pine Valley Rd, Springfield',
      admissionNumber: 'ADM-2024-092',
      rollNumber: '1002',
      classId: grade10.id,
      sectionId: section10A.id,
      status: 'ACTIVE',
      avatar: studentUser2.avatar,
    },
  });

  const additionalStudents = [
    { firstName: 'Liam', lastName: 'Taylor', gender: 'Male', roll: '1003', blood: 'B+' },
    { firstName: 'Sophia', lastName: 'Martinez', gender: 'Female', roll: '1004', blood: 'AB+' },
    { firstName: 'Noah', lastName: 'Kim', gender: 'Male', roll: '1005', blood: 'O-' },
    { firstName: 'Emma', lastName: 'Johnson', gender: 'Female', roll: '1006', blood: 'A-' },
  ];

  for (let i = 0; i < additionalStudents.length; i++) {
    const s = additionalStudents[i];
    await prisma.student.create({
      data: {
        studentId: `STD-2026-00${i + 3}`,
        firstName: s.firstName,
        lastName: s.lastName,
        gender: s.gender,
        dob: new Date('2010-07-10'),
        bloodGroup: s.blood,
        email: `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}@smartacademy.edu`,
        phone: `+1 555-012${i}`,
        address: 'Springfield Metro Area',
        admissionNumber: `ADM-2024-09${i + 3}`,
        rollNumber: s.roll,
        classId: grade10.id,
        sectionId: i % 2 === 0 ? section10A.id : section10B.id,
        status: 'ACTIVE',
      },
    });
  }

  // 7. Staff Records
  await prisma.staff.createMany({
    data: [
      {
        userId: accountantUser.id,
        staffId: 'STF-2026-001',
        firstName: 'Franklin',
        lastName: 'Hayes',
        roleType: 'ACCOUNTANT',
        department: 'Finance & Accounts',
        email: 'accountant@smartacademy.edu',
        phone: '+1 555-0109',
        salary: 4900.0,
      },
      {
        userId: librarianUser.id,
        staffId: 'STF-2026-002',
        firstName: 'Miriam',
        lastName: 'Becker',
        roleType: 'LIBRARIAN',
        department: 'Library Services',
        email: 'librarian@smartacademy.edu',
        phone: '+1 555-0110',
        salary: 4300.0,
      },
      {
        staffId: 'STF-2026-003',
        firstName: 'Robert',
        lastName: 'Jenkins',
        roleType: 'SECURITY',
        department: 'Campus Security',
        email: 'security@smartacademy.edu',
        phone: '+1 555-0111',
        salary: 3200.0,
      },
      {
        staffId: 'STF-2026-004',
        firstName: 'Carlos',
        lastName: 'Mendez',
        roleType: 'DRIVER',
        department: 'Logistics & Transport',
        email: 'carlos.m@smartacademy.edu',
        phone: '+1 555-0112',
        salary: 3400.0,
      },
    ],
  });

  // 8. Attendance Records
  const today = new Date();
  const pastDays = [0, 1, 2, 3, 4]; // Last 5 days
  for (const d of pastDays) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    date.setHours(8, 0, 0, 0);

    await prisma.attendance.create({
      data: {
        studentId: student1.id,
        date: date,
        status: d === 2 ? 'LATE' : 'PRESENT',
        remarks: d === 2 ? 'Traffic delay on transit line' : 'On time',
      },
    });

    await prisma.attendance.create({
      data: {
        studentId: student2.id,
        date: date,
        status: d === 4 ? 'EXCUSED' : 'PRESENT',
        remarks: d === 4 ? 'Medical appointment' : 'On time',
      },
    });

    // Teacher Attendance
    await prisma.teacherAttendance.create({
      data: {
        teacherId: teacher1.id,
        date: date,
        status: 'PRESENT',
        remarks: 'Punctual',
      },
    });
  }

  // 9. Grading Scale
  const grades = [
    { gradeName: 'A+', minMarks: 90, maxMarks: 100, gradePoint: 4.0, description: 'Outstanding' },
    { gradeName: 'A', minMarks: 80, maxMarks: 89, gradePoint: 3.7, description: 'Excellent' },
    { gradeName: 'B+', minMarks: 75, maxMarks: 79, gradePoint: 3.3, description: 'Very Good' },
    { gradeName: 'B', minMarks: 70, maxMarks: 74, gradePoint: 3.0, description: 'Good' },
    { gradeName: 'C', minMarks: 60, maxMarks: 69, gradePoint: 2.0, description: 'Average' },
    { gradeName: 'D', minMarks: 40, maxMarks: 59, gradePoint: 1.0, description: 'Pass' },
    { gradeName: 'F', minMarks: 0, maxMarks: 39, gradePoint: 0.0, description: 'Fail' },
  ];
  for (const g of grades) {
    await prisma.grade.create({ data: g });
  }

  // 10. Exams & Results
  const midTerm = await prisma.exam.create({
    data: {
      title: 'Mid-Term Comprehensive Exam 2026',
      term: 'Mid-Term',
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-10-25'),
      status: 'COMPLETED',
    },
  });

  const finalExam = await prisma.exam.create({
    data: {
      title: 'Annual Final Examination 2026',
      term: 'Finals',
      startDate: new Date('2026-12-10'),
      endDate: new Date('2026-12-22'),
      status: 'UPCOMING',
    },
  });

  // Exam Schedules for Grade 10
  await prisma.examSchedule.createMany({
    data: [
      {
        examId: midTerm.id,
        classId: grade10.id,
        subjectId: createdSubjects[0].id,
        date: new Date('2026-10-15'),
        startTime: '09:00 AM',
        endTime: '12:00 PM',
        roomNumber: 'Hall A-1',
        maxMarks: 100,
        passMarks: 40,
      },
      {
        examId: midTerm.id,
        classId: grade10.id,
        subjectId: createdSubjects[1].id,
        date: new Date('2026-10-17'),
        startTime: '09:00 AM',
        endTime: '12:00 PM',
        roomNumber: 'Hall A-1',
        maxMarks: 100,
        passMarks: 40,
      },
      {
        examId: midTerm.id,
        classId: grade10.id,
        subjectId: createdSubjects[2].id,
        date: new Date('2026-10-19'),
        startTime: '09:00 AM',
        endTime: '12:00 PM',
        roomNumber: 'Hall A-2',
        maxMarks: 100,
        passMarks: 40,
      },
    ],
  });

  // Exam Results for Student 1
  await prisma.examResult.createMany({
    data: [
      {
        examId: midTerm.id,
        studentId: student1.id,
        subjectId: createdSubjects[0].id, // Math
        marksObtained: 94.0,
        maxMarks: 100.0,
        grade: 'A+',
        gpa: 4.0,
        remarks: 'Exceptional mathematical rigor',
      },
      {
        examId: midTerm.id,
        studentId: student1.id,
        subjectId: createdSubjects[1].id, // Physics
        marksObtained: 88.0,
        maxMarks: 100.0,
        grade: 'A',
        gpa: 3.7,
        remarks: 'Strong conceptual clarity in kinematics',
      },
      {
        examId: midTerm.id,
        studentId: student1.id,
        subjectId: createdSubjects[2].id, // English
        marksObtained: 85.0,
        maxMarks: 100.0,
        grade: 'A',
        gpa: 3.7,
        remarks: 'Eloquent essay formulation',
      },
      // Student 2 results
      {
        examId: midTerm.id,
        studentId: student2.id,
        subjectId: createdSubjects[0].id,
        marksObtained: 96.0,
        maxMarks: 100.0,
        grade: 'A+',
        gpa: 4.0,
        remarks: 'Top score in algebra and trigonometry',
      },
      {
        examId: midTerm.id,
        studentId: student2.id,
        subjectId: createdSubjects[1].id,
        marksObtained: 91.0,
        maxMarks: 100.0,
        grade: 'A+',
        gpa: 4.0,
        remarks: 'Excellent laboratory experiment execution',
      },
    ],
  });

  // 11. Fees, Invoices & Payments
  const feeTypeTuition = await prisma.feeType.create({
    data: {
      name: 'Monthly Tuition Fee - Secondary',
      description: 'Standard monthly instruction and academic fees',
      amount: 450.0,
      frequency: 'MONTHLY',
    },
  });

  const feeTypeAdmission = await prisma.feeType.create({
    data: {
      name: 'Annual Registration & Technology Fee',
      description: 'Campus lab, cloud software, and registration',
      amount: 250.0,
      frequency: 'YEARLY',
    },
  });

  const feeTypeTransport = await prisma.feeType.create({
    data: {
      name: 'Monthly School Bus Transit',
      description: 'Dedicated air-conditioned door-to-school transit',
      amount: 90.0,
      frequency: 'MONTHLY',
    },
  });

  // Invoice 1: Paid Tuition
  const invoice1 = await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-0001',
      studentId: student1.id,
      feeTypeId: feeTypeTuition.id,
      amount: 450.0,
      discountAmount: 0.0,
      paidAmount: 450.0,
      dueAmount: 0.0,
      dueDate: new Date('2026-11-05'),
      status: 'PAID',
    },
  });

  await prisma.feePayment.create({
    data: {
      invoiceId: invoice1.id,
      amount: 450.0,
      paymentMethod: 'ONLINE',
      transactionId: 'TXN-STRIPE-893042',
      paymentDate: new Date('2026-11-02'),
      receiptNumber: 'RCT-2026-0001',
      receivedBy: 'Franklin Hayes',
      notes: 'Paid via Parent Portal online debit',
    },
  });

  // Invoice 2: Unpaid Tuition for November
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-0002',
      studentId: student2.id,
      feeTypeId: feeTypeTuition.id,
      amount: 450.0,
      discountAmount: 50.0, // Scholarship discount
      paidAmount: 200.0,
      dueAmount: 200.0,
      dueDate: new Date('2026-11-30'),
      status: 'PARTIAL',
    },
  });

  // 12. Timetable Schedule
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  for (let i = 0; i < days.length; i++) {
    await prisma.timetable.createMany({
      data: [
        {
          classId: grade10.id,
          sectionId: section10A.id,
          subjectId: createdSubjects[0].id,
          teacherId: teacher1.id,
          dayOfWeek: days[i],
          startTime: '08:30 AM',
          endTime: '09:30 AM',
          roomNumber: 'Room 1001',
        },
        {
          classId: grade10.id,
          sectionId: section10A.id,
          subjectId: createdSubjects[1].id,
          teacherId: teacher2.id,
          dayOfWeek: days[i],
          startTime: '09:45 AM',
          endTime: '10:45 AM',
          roomNumber: 'Science Lab 2',
        },
        {
          classId: grade10.id,
          sectionId: section10A.id,
          subjectId: createdSubjects[2].id,
          teacherId: teacher3.id,
          dayOfWeek: days[i],
          startTime: '11:00 AM',
          endTime: '12:00 PM',
          roomNumber: 'Room 1001',
        },
      ],
    });
  }

  // 13. Homework Assignments
  const hw1 = await prisma.homework.create({
    data: {
      title: 'Quadratic Equations & Polynomial Functions Problem Set',
      description: 'Solve exercises 4.1 through 4.8 from Chapter 4. Show complete step-by-step proofs and graph representations.',
      classId: grade10.id,
      sectionId: section10A.id,
      subjectId: createdSubjects[0].id,
      teacherId: teacher1.id,
      dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    },
  });

  await prisma.homeworkSubmission.create({
    data: {
      homeworkId: hw1.id,
      studentId: student1.id,
      content: 'Completed all 8 problem sets with graphs attached. Checked discriminant values for all equations.',
      status: 'GRADED',
      grade: 'A+',
      feedback: 'Flawless mathematical clarity and impeccable handwriting.',
    },
  });

  // 14. Library Books & Circulation
  const books = [
    { title: 'Calculus: Early Transcendentals', author: 'James Stewart', isbn: '978-1285741550', category: 'Mathematics', totalCopies: 8, availableCopies: 7, shelfNumber: 'Shelf M-03' },
    { title: 'University Physics with Modern Physics', author: 'Hugh D. Young', isbn: '978-0135159552', category: 'Science', totalCopies: 6, availableCopies: 5, shelfNumber: 'Shelf P-01' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0060935467', category: 'Literature', totalCopies: 12, availableCopies: 10, shelfNumber: 'Shelf L-12' },
    { title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Technology', totalCopies: 5, availableCopies: 4, shelfNumber: 'Shelf CS-05' },
    { title: 'A Short History of Nearly Everything', author: 'Bill Bryson', isbn: '978-0767908184', category: 'Science', totalCopies: 7, availableCopies: 7, shelfNumber: 'Shelf S-08' },
  ];

  for (const b of books) {
    const createdBook = await prisma.libraryBook.create({ data: b });
    if (b.title.includes('Calculus')) {
      await prisma.bookIssue.create({
        data: {
          bookId: createdBook.id,
          studentId: student1.id,
          issueDate: new Date('2026-11-10'),
          dueDate: new Date('2026-11-24'),
          status: 'ISSUED',
          remarks: 'Issued for midterm preparation',
        },
      });
    }
  }

  // 15. Transport System
  const vehicle = await prisma.transportVehicle.create({
    data: {
      vehicleNumber: 'BUS-01',
      model: 'Volvo 9700 Luxury Transit (36 Seat)',
      capacity: 36,
      driverName: 'Carlos Mendez',
      driverPhone: '+1 555-0112',
      licenseNumber: 'CDL-OR-928341',
      status: 'ACTIVE',
    },
  });

  const route = await prisma.transportRoute.create({
    data: {
      routeName: 'North Ridge Express Route',
      vehicleId: vehicle.id,
      startPoint: 'North Hill Plaza',
      endPoint: 'Smart Academy Main Gate',
      pickupTime: '07:20 AM',
      dropTime: '03:45 PM',
      fare: 90.0,
    },
  });

  await prisma.studentTransport.create({
    data: {
      studentId: student1.id,
      routeId: route.id,
      stopName: 'Evergreen Boulevard Crossing',
    },
  });

  // 16. Notices & Announcements
  await prisma.notice.createMany({
    data: [
      {
        title: 'Annual Science & Robotics Exhibition 2026',
        content: 'All students from Grades 8-12 are invited to submit their STEM and robotics exhibition proposals to the Science department by Friday.',
        targetAudience: 'ALL',
        publishedBy: 'Principal Arthur Pendelton',
        isPinned: true,
      },
      {
        title: 'Parent-Teacher Academic Conference (PTAC)',
        content: 'The second quarter Parent-Teacher conferences are scheduled for next Saturday from 9:00 AM to 3:00 PM. Appointment booking slots are now open in the portal.',
        targetAudience: 'PARENTS',
        publishedBy: 'Academic Dean',
        isPinned: true,
      },
      {
        title: 'Winter Vacation & Exam Schedule Released',
        content: 'Please review the updated final examination timetable and winter vacation schedule posted under the Examinations portal.',
        targetAudience: 'ALL',
        publishedBy: 'Administration Office',
        isPinned: false,
      },
    ],
  });

  // 17. Expenses & Operations
  await prisma.expense.createMany({
    data: [
      {
        title: 'Campus High-Speed Optical Fiber Internet (Quarterly)',
        category: 'IT & Infrastructure',
        amount: 1450.0,
        paymentMethod: 'BANK_TRANSFER',
        receiptNumber: 'EXP-2026-104',
        recordedBy: 'Franklin Hayes',
      },
      {
        title: 'Chemistry Laboratory Reagents & Glassware Refill',
        category: 'Laboratory',
        amount: 820.0,
        paymentMethod: 'CARD',
        receiptNumber: 'EXP-2026-105',
        recordedBy: 'Franklin Hayes',
      },
      {
        title: 'Sports Field Maintenance & Athletic Equipment',
        category: 'Sports',
        amount: 650.0,
        paymentMethod: 'BANK_TRANSFER',
        receiptNumber: 'EXP-2026-106',
        recordedBy: 'Franklin Hayes',
      },
    ],
  });

  // 18. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: superAdmin.id,
        title: 'System Health & Daily Sync',
        message: 'All daily attendance and fee transactions synced successfully.',
        type: 'SUCCESS',
      },
      {
        userId: studentUser1.id,
        title: 'New Grade Published',
        message: 'Your grade for Math Mid-Term is now available: A+ (94/100).',
        type: 'INFO',
        link: '/exams/results',
      },
      {
        userId: parentUser.id,
        title: 'Tuition Payment Confirmed',
        message: 'Receipt RCT-2026-0001 for $450.00 has been verified.',
        type: 'SUCCESS',
        link: '/fees',
      },
    ],
  });

  console.log('--- Database Seeded Successfully with Realistic Production Data! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
