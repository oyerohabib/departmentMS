/** Shared fixture accounts from backend seed (password: "password"). */
export const TEST_PASSWORD = "password";

export const fixtures = {
  admin: {
    email: "admin@campusconnect.com",
    password: TEST_PASSWORD,
    name: "Admin",
    role: "admin" as const,
  },
  lecturer: {
    email: "john.smith@campusconnect.com",
    password: TEST_PASSWORD,
    name: "Prof. John Smith",
    role: "lecturer" as const,
  },
  student: {
    email: "alice.williams@campusconnect.com",
    password: TEST_PASSWORD,
    name: "Alice Williams",
    role: "student" as const,
  },
  /** Student with no pre-assigned courses in seed (index 6 / George is on DSA/AIM only). */
  studentUnenrolled: {
    email: "bob.davis@campusconnect.com",
    password: TEST_PASSWORD,
    name: "Bob Davis",
    role: "student" as const,
  },
};

export const seededCourseTitle = "Introduction to Computer Science";
