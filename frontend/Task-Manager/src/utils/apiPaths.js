// Vite injects VITE_* at build time. Local default keeps dev working.
// Production (EC2): set VITE_API_URL=http://YOUR_EC2_PUBLIC_IP:8000 before `npm run build`
export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Register a new user (Admin or Member)
    LOGIN: "/api/auth/login", // Authenticate user & return JNT token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
  },
  USERS: {
    GET_ALL_USERS: "/api/users", //? Get all users (Admin only)
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`, //? Get user by ID
    CREATE_USER: "/api/users", //? Create a new user (Admin only)
    UPDATE_USER: (userId) => `/api/users/${userId}`, //? Update user details
    DELETE_USER: (userId) => `/api/users/${userId}`, //? Delete a user
  },
  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", //? Get Dashboard Data
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", //? Get User Dashboard Data
    GET_ALL_TASKS: "/api/tasks", //? Get all tasks (Admin: all, User: only assigned tasks)
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, //? Get task by ID
    CREATE_TASK: "/api/tasks", //? Create a new task (Admin only)
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, //? Update task details
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, //? Delete a task (Admin only)
    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, //? Update task status
    UPDATE_TOOD_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, //? Update todo checklist
    UPLOAD_ATTACHMENT: "/api/tasks/upload-attachment", // Upload file for task attachments
    GET_ACTIVITY: (taskId) => `/api/tasks/${taskId}/activity`, // Audit trail
  },
  NOTIFICATIONS: {
    GET_ALL: "/api/notifications",
    MARK_READ: (id) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: "/api/notifications/read-all",
  },
  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks", //?Download all tasks as an Excel/PDF report
    EXPORT_USERS: "/api/reports/export/users", //?Download user-task report
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
