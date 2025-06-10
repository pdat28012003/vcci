// API configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh-token",

  // Student
  STUDENT_PROFILE: "/student/profile",
  UPDATE_STUDENT_INFO: "/student/update",

  // Curriculum
  CURRICULUM: "/curriculum",
  SEMESTER_PLAN: "/curriculum/semester-plan",

  // Course Registration
  COURSE_REGISTRATION: "/course-registration",
  COURSE_WITHDRAWAL: "/course-withdrawal",

  // Transactions
  TUITION: "/transactions/tuition",
  OTHER_FEES: "/transactions/other-fees",
  DEPOSIT: "/transactions/deposit",
  DEBT_PAYMENT: "/transactions/debt-payment",
  TRANSACTION_HISTORY: "/transactions/history",

  // Notifications
  SCHOOL_ANNOUNCEMENTS: "/notifications/school",
  PERSONAL_NOTIFICATIONS: "/notifications/personal",
  NEWS_FEED: "/notifications/news",

  // Schedule
  SCHEDULE: "/schedule",
  SCHEDULE_SEMESTERS: "/schedule/semesters",
  SCHEDULE_WEEKS: "/schedule/weeks",
  SCHEDULE_EXPORT: "/schedule/export",
  SCHEDULE_SYNC: "/schedule/sync-google-calendar",

  // Services
  ONE_STOP_SERVICE: "/services/one-stop",
  DEVICE_REPORT: "/services/device-report",
  USER_GUIDE: "/services/user-guide",
};
