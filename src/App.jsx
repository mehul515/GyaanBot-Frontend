import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { getUser, getToken } from "@/lib/api";

// Public pages
import LandingPage from "@/pages/Landing";
import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";

// Teacher pages
import TeacherDashboard from '@/pages/teacher/Dashboard';
import TeacherProfile from '@/pages/teacher/Profile';
import TeacherUpdateUserForm from '@/pages/teacher/UpdateUser';
import CreateCourse from "@/pages/teacher/CreateCourse";
import MyCourses from "@/pages/teacher/MyCourses";
import UploadDocument from "@/pages/teacher/UploadDocument";
import EnrollStudent from "@/pages/teacher/EnrollStudent";
import ViewEnrolled from "@/pages/teacher/ViewEnrolled";
import CourseDocuments from "@/pages/teacher/CourseDocuments";
import CoursePage from "@/pages/teacher/CoursePage";

// Student pages
import StudentDashboard from '@/pages/student/Dashboard';
import StudentProfile from '@/pages/student/Profile';
import StudentUpdateUserForm from '@/pages/student/UpdateUser';
import StudentCourses from "@/pages/student/StudentCourses";
import MyEnrolledCourses from "@/pages/student/MyEnrolledCourses";
import StudentCoursePage from "@/pages/student/StudentCoursePage";
import ChatPage from "@/pages/student/ChatPage"; // ✅ Import ChatPage
import DashboardLayout from "./layouts/DashboardLayout";
import NotFound from "./pages/404-not-found";

export default function App() {
  const [authLoaded, setAuthLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (token && user) {
      setIsAuthenticated(true);
      setRole(user.role);
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }

    setAuthLoaded(true);
  }, []);

  const PrivateRoute = ({ children, allowedRoles }) => {
    if (!authLoaded) return <p className="p-6">Checking authentication...</p>;
    if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
    if (!allowedRoles || allowedRoles.includes(role)) {
      return children;
    }
    return <Navigate to="/dashboard" replace />;
  };

  const PublicRoute = ({ children }) => {
    if (!authLoaded) return <p className="p-6">Checking authentication...</p>;
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
  };

  return (
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/auth/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/auth/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/auth/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/auth/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/auth/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />

        {/* Shared Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
              {role === 'TEACHER' ? <TeacherDashboard /> : <StudentDashboard />}
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <DashboardLayout>
              {role === 'TEACHER' ? <TeacherProfile /> : <StudentProfile />}
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/update-profile"
          element={
            <PrivateRoute>
              <DashboardLayout>
              {role === 'TEACHER' ? <TeacherUpdateUserForm role={role} /> : <StudentUpdateUserForm role={role} />}
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* 🧑‍🏫 Teacher Routes */}
        <Route path="/teacher/create-course" element={<PrivateRoute allowedRoles={['TEACHER']}><DashboardLayout><CreateCourse /></DashboardLayout></PrivateRoute>} />
        <Route path="/teacher/my-courses" element={<PrivateRoute allowedRoles={['TEACHER']}><DashboardLayout><MyCourses /></DashboardLayout></PrivateRoute>} />
        <Route path="/teacher/course/:id" element={<PrivateRoute allowedRoles={['TEACHER']}><DashboardLayout><CoursePage /></DashboardLayout></PrivateRoute>} />
        <Route path="/teacher/course/:id/upload" element={<PrivateRoute allowedRoles={['TEACHER']}><DashboardLayout><UploadDocument /></DashboardLayout></PrivateRoute>} />
        <Route path="/teacher/course/:id/enroll" element={<PrivateRoute allowedRoles={['TEACHER']}><DashboardLayout><EnrollStudent /></DashboardLayout></PrivateRoute>} />
        <Route path="/teacher/course/:id/students" element={<PrivateRoute allowedRoles={['TEACHER']}><DashboardLayout><ViewEnrolled /></DashboardLayout></PrivateRoute>} />
        <Route path="/teacher/course/:id/documents" element={<PrivateRoute allowedRoles={['TEACHER']}><DashboardLayout><CourseDocuments /></DashboardLayout></PrivateRoute>} />

        {/* 🎓 Student Routes */}
        <Route path="/student/courses" element={<PrivateRoute allowedRoles={['STUDENT']}><DashboardLayout><StudentCourses /></DashboardLayout></PrivateRoute>} />
        <Route path="/student/my-courses" element={<PrivateRoute allowedRoles={['STUDENT']}><DashboardLayout><MyEnrolledCourses /></DashboardLayout></PrivateRoute>} />
        <Route path="/student/course/:id" element={<PrivateRoute allowedRoles={['STUDENT']}><DashboardLayout><StudentCoursePage /></DashboardLayout></PrivateRoute>} />
        <Route path="/student/chat" element={<PrivateRoute allowedRoles={['STUDENT']}><DashboardLayout><ChatPage /></DashboardLayout></PrivateRoute>} /> {/* ✅ Chat Page Route */}


        <Route path="*" element={<NotFound/>} />

      </Routes>
    </ThemeProvider>
  );
}
