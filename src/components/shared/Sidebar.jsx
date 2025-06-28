"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Home,
  User,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Plus,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  LogOut,
} from "lucide-react"
import { getUser, logout } from "@/lib/api"

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = getUser()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isActive = (path) => location.pathname.startsWith(path)

  const handleLogout = async () => {
    try {
      await logout()
      // Use replace to prevent going back to authenticated pages
      navigate("/auth/login", { replace: true })
    } catch (error) {
      console.error("Logout error:", error)
      // Navigate anyway in case of error
      navigate("/auth/login", { replace: true })
    }
  }

  const renderLinks = (links) =>
    links.map((link) => (
      <li key={link.path}>
        <Link
          to={link.path}
          className={`group flex items-center ${isCollapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
            isActive(link.path)
              ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 shadow-lg backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-500/30"
              : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-amber-100/80 dark:hover:from-orange-900/20 dark:hover:to-amber-900/20 hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => setIsMobileOpen(false)}
        >
          <span
            className={`transition-transform duration-300 ${isActive(link.path) ? "scale-110 text-emerald-600 dark:text-emerald-400" : "group-hover:scale-110 group-hover:text-orange-600 dark:group-hover:text-orange-400"}`}
          >
            {link.icon}
          </span>
          {!isCollapsed && <span className="font-medium truncate">{link.label}</span>}
          {isActive(link.path) && !isCollapsed && <ChevronRight className="w-4 h-4 ml-auto opacity-60" />}
        </Link>
      </li>
    ))

  const dashboardLabel = user?.role === "TEACHER" ? "Teacher Dashboard" : "Student Dashboard"
  const profileLabel = user?.role === "TEACHER" ? "Teacher Profile" : "Student Profile"

  const commonLinks = [
    {
      label: dashboardLabel,
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: profileLabel,
      path: "/profile",
      icon: <User className="w-5 h-5" />,
    },
  ]

  const studentLinks = [
    {
      label: "Public Courses",
      path: "/student/courses",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: "My Enrolled Courses",
      path: "/student/my-courses",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      label: "Chat with Courses",
      path: "/student/chat",
      icon: <MessageCircle className="w-5 h-5" />,
    },
  ]

  const teacherLinks = [
    {
      label: "Create Course",
      path: "/teacher/create-course",
      icon: <Plus className="w-5 h-5" />,
    },
    {
      label: "My Courses",
      path: "/teacher/my-courses",
      icon: <BookOpen className="w-5 h-5" />,
    },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/50 dark:border-gray-700/50">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              GyaanBot
            </h2>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Common Links */}
        <div>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-4">
              General
            </h3>
          )}
          <ul className="space-y-1">{renderLinks(commonLinks)}</ul>
        </div>

        {/* Role-specific Links */}
        {user?.role === "TEACHER" && (
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-3 px-4">
                Teacher Tools
              </h3>
            )}
            <ul className="space-y-1">{renderLinks(teacherLinks)}</ul>
          </div>
        )}

        {user?.role === "STUDENT" && (
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-3 px-4">
                Learning
              </h3>
            )}
            <ul className="space-y-1">{renderLinks(studentLinks)}</ul>
          </div>
        )}
      </div>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-3">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-[1.02] group cursor-pointer`}
        >
          <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border border-orange-200/50 dark:border-orange-700/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200"
      >
        <Menu className="w-5 h-5 text-orange-600 dark:text-orange-400" />
      </button>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex flex-col h-full transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-72"
        } bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl`}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              GyaanBot
            </h2>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors duration-200"
          >
            <X className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-4">
              General
            </h3>
            <ul className="space-y-1">{renderLinks(commonLinks)}</ul>
          </div>

          {user?.role === "TEACHER" && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-3 px-4">
                Teacher Tools
              </h3>
              <ul className="space-y-1">{renderLinks(teacherLinks)}</ul>
            </div>
          )}

          {user?.role === "STUDENT" && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-3 px-4">
                Learning
              </h3>
              <ul className="space-y-1">{renderLinks(studentLinks)}</ul>
            </div>
          )}
        </div>

        {/* Mobile Footer with Logout */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  )
}
