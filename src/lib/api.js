import axios from 'axios';


// Base URLs
const USER_BASE = import.meta.env.VITE_USER_BASE;
const COURSE_BASE = import.meta.env.VITE_COURSE_BASE;
const CHAT_BASE = import.meta.env.VITE_CHAT_BASE;


// Local Storage Keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';


// Token & User Management
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};
export const removeUser = () => localStorage.removeItem(USER_KEY);

export const logout = () => {
  removeToken();
  removeUser();
};


// Axios Instances
const userAPI = axios.create({ baseURL: USER_BASE });
const courseAPI = axios.create({ baseURL: COURSE_BASE });
const chatAPI = axios.create({ baseURL: CHAT_BASE });


// Attach JWT
[userAPI, courseAPI, chatAPI].forEach((api) =>
  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  )
);


// Auth APIs (User Service)
export const registerUser = (data) => userAPI.post('/auth/register', data);
export const verifyEmail = (data) => userAPI.post('/auth/verify', data);
export const resendOtp = (email) => userAPI.post('/auth/resend-otp', { email });
export const loginUser = (data) => userAPI.post('/auth/login', data);
export const forgotPassword = (data) => userAPI.post('/auth/forgot', data);
export const resetPassword = (data) => userAPI.post('/auth/reset', data);


// Student Profile APIs
export const getStudentProfile = () => userAPI.get('/user/student/profile');
export const updateStudentProfile = (data) => userAPI.put('/user/student/profile', data);


// Teacher Profile APIs
export const getTeacherProfile = () => userAPI.get('/user/teacher/profile');
export const updateTeacherProfile = (data) => userAPI.put('/user/teacher/profile', data);


// Course APIs (Course Service)
export const createCourse = (courseData) => courseAPI.post('/courses/create', courseData);
export const getMyCourses = () => courseAPI.get('/courses/my-courses');

export const uploadDocument = (courseId, formData) =>
  courseAPI.post(`/courses/${courseId}/documents/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const enrollStudent = (courseId, email) =>
  courseAPI.post(`/courses/${courseId}/enroll`, { email });

export const getEnrolledStudents = (courseId) =>
  courseAPI.get(`/courses/${courseId}/students`);

export const removeStudent = (courseId, email) =>
  courseAPI.delete(`/courses/${courseId}/remove-student`, {
    data: { email },
  });

export const toggleCourseVisibility = (courseId) =>
  courseAPI.put(`/courses/${courseId}/toggle-public`);

export const deleteCourse = (courseId) =>
  courseAPI.delete(`/courses/${courseId}`);

export const getCourseDocuments = (courseId) =>
  courseAPI.get(`/courses/${courseId}/documents`);

export const deleteDocument = (courseId, docId) =>
  courseAPI.delete(`/courses/${courseId}/documents/${docId}`);

export const getCourseById = (courseId) =>
  courseAPI.get(`/courses/${courseId}`);

export const getAllCourses = () => courseAPI.get('/courses');
export const joinCourse = (courseId) => courseAPI.post(`/courses/${courseId}/join`);

export const getMyEnrolledCourses = () =>
  courseAPI.get('/courses/enrolled');

export const getStudentById = (id) => userAPI.get(`/user/student/profile/${id}`);
export const getTeacherById = (id) => userAPI.get(`/user/teacher/profile/${id}`);



// Chat / Q&A APIs
export const askCourseQuestion = (question, courseId) =>
  chatAPI.post('/chat/ask', { question, courseId });
