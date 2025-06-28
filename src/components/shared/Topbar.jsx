"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { User, ChevronRight, ChevronDown, LogOut, Mail } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { getUser, getStudentProfile, getTeacherProfile, logout } from "@/lib/api"

export default function Topbar() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const user = getUser()

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (user?.role === "STUDENT") {
          const res = await getStudentProfile()
          setName(res.data.name)
          setEmail(res.data.email)
        } else if (user?.role === "TEACHER") {
          const res = await getTeacherProfile()
          setName(res.data.name)
          setEmail(res.data.email)
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err)
      }
    }

    if (user?.role) {
      fetchUserData()
    }
  }, [user?.role])

  const handleLogout = () => {
    logout()
    navigate("/auth/login")
    setIsProfileMenuOpen(false)
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleColor = (role) => {
    return role === "TEACHER" ? "from-orange-500 to-amber-600" : "from-emerald-500 to-teal-600"
  }

  const getRoleAccent = (role) => {
    return role === "TEACHER" ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400"
  }

  // Function to get breadcrumb from current path
  const getBreadcrumb = () => {
    const path = location.pathname

    // Define path mappings
    const pathMappings = {
      "/dashboard": "Dashboard",
      "/profile": "Profile",
      "/teacher/create-course": "Create Course",
      "/teacher/my-courses": "My Courses",
      "/student/courses": "Public Courses",
      "/student/my-courses": "My Enrolled Courses",
      "/student/chat": "Ask Doubts",
      "/update-profile": "Update Profile",
    }

    // Check for exact matches first
    if (pathMappings[path]) {
      return pathMappings[path]
    }

    // Handle dynamic routes or nested paths
    if (path.startsWith("/teacher/")) {
      if (path.includes("/create-course")) return "Create Course"
      if (path.includes("/my-courses")) return "My Courses"
      return "Teacher Dashboard"
    }

    if (path.startsWith("/student/")) {
      if (path.includes("/courses") && !path.includes("/my-courses")) return "Public Courses"
      if (path.includes("/my-courses")) return "My Enrolled Courses"
      if (path.includes("/chat")) return "Ask Doubts"
      return "Student Dashboard"
    }

    // Default fallback
    return "Dashboard"
  }

  const getCurrentSection = () => {
    const path = location.pathname

    if (path.startsWith("/teacher/")) {
      return "Teacher"
    } else if (path.startsWith("/student/")) {
      return "Student"
    }
    return "General"
  }

  return (
    <div className="sticky top-0 z-30 w-full h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Current Path */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{getCurrentSection()}</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{getBreadcrumb()}</h1>
        </div>

        {/* Right Section - Profile & Theme */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Section with Dropdown */}
          <div className="relative">
            <div
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="hover:scale-105 cursor-pointer flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border border-gray-200/50 dark:border-gray-600/50">
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getRoleColor(user?.role)} flex items-center justify-center text-white font-semibold text-sm shadow-lg`}
              >
                {name ? getInitials(name) : <User className="w-4 h-4" />}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{name || "User"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">{user?.role?.toLowerCase()}</p>
              </div>
            </div>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)} />

                {/* Dropdown Content */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-20">
                  {/* User Info Section */}
                  <div className="px-4 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getRoleColor(user?.role)} flex items-center justify-center text-white font-semibold shadow-lg`}
                      >
                        {name ? getInitials(name) : <User className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{name || "User"}</p>
                        
                        <p className={`text-xs font-medium ${getRoleAccent(user?.role)}`}>
                          {user?.role === "TEACHER" ? "Teacher" : "Student"}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                        {email || "No email available"}
                      </span>
                    </div>
                  </div>

                  {/* Role Badge */}
                  <div className="px-4 py-2">
                    <div
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                        user?.role === "TEACHER"
                          ? "from-orange-100 to-amber-100 text-orange-700 dark:from-orange-900/30 dark:to-amber-900/30 dark:text-orange-300"
                          : "from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-emerald-300"
                      }`}
                    >
                      {user?.role?.toLowerCase()} account
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="px-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 rounded-lg group"
                    >
                      <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                      <span className="font-medium">Sign out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

