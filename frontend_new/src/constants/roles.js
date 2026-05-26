export const ROLES = {
  ADMIN: 'admin',
  HOD: 'hod',
  ASST_HEAD_ACADEMICS: 'assistantHeadAcademics',
  ASST_HEAD_RESEARCH: 'assistantHeadResearch',
  FACULTY: 'faculty',
  CLASS_TEACHER: 'classTeacher',
  INTERNSHIP_COORD: 'internshipCoordinator',
  MAJOR_PROJECT_COORD: 'majorProjectCoordinator',
  EDI_COORD: 'ediCoordinator',
  STUDENT_ACTIVITY_COORD: 'studentActivityCoordinator',
  STUDENT_PORTFOLIO_ALUMNI_COORD: 'studentPortfolioAlumniCoordinator',
  BUDGET_COORD: 'budgetCoordinator',
};

export const ROLE_LABELS = {
  admin: 'Admin',
  hod: 'Head of Department',
  assistantHeadAcademics: 'Asst. Head Academics',
  assistantHeadResearch: 'Asst. Head Research',
  faculty: 'Faculty',
  classTeacher: 'Class Teacher',
  internshipCoordinator: 'Internship Coordinator',
  majorProjectCoordinator: 'Major Project Coordinator',
  ediCoordinator: 'EDI Coordinator',
  studentActivityCoordinator: 'Student Activity Coordinator',
  studentPortfolioAlumniCoordinator: 'Student Portfolio & Alumni Coordinator',
  budgetCoordinator: 'Budget Coordinator',
};

export const ALL_ROLES = Object.keys(ROLE_LABELS);
export const NON_ADMIN_ROLES = ALL_ROLES.filter((r) => r !== 'admin');
