"use client"

import { useEffect, useState } from "react"
import { getTeacherProfile, getMyCourses, getEnrolledStudents, getCourseDocuments } from "@/lib/api"
import { useNavigate } from "react-router-dom"
import { BookOpen, Users, FileText, TrendingUp, Plus, ArrowRight, GraduationCap, Upload, UserPlus, BarChart3, Eye } from 'lucide-react'

export default function TeacherDashboard() {
  const [profile, setProfile] = useState(null)
  const [courses, setCourses] = useState([])
  const [courseStats, setCourseStats] = useState({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, coursesRes] = await Promise.all([getTeacherProfile(), getMyCourses()])

        setProfile(profileRes.data)
        setCourses(coursesRes.data)

        // Fetch stats for each course
        const stats = {}
        for (const course of coursesRes.data) {
          try {
            const [studentsRes, documentsRes] = await Promise.all([
              getEnrolledStudents(course.id),
              getCourseDocuments(course.id),
            ])
            stats[course.id] = {
              students: studentsRes.data.length,
              documents: documentsRes.data.length,
            }
          } catch (err) {
            stats[course.id] = { students: 0, documents: 0 }
          }
        }
        setCourseStats(stats)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const totalStudents = Object.values(courseStats).reduce((sum, stats) => sum + stats.students, 0)
  const totalDocuments = Object.values(courseStats).reduce((sum, stats) => sum + stats.documents, 0)
  const publicCourses = courses.filter((course) => course.isPublic).length

  const quickActions = [
    {
      title: "Create Course",
      description: "Start a new course",
      icon: Plus,
      action: () => navigate("/teacher/create-course"),
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Upload Content",
      description: "Add study materials",
      icon: Upload,
      action: () => navigate("/teacher/my-courses"),
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Manage Students",
      description: "Enroll and manage students",
      icon: UserPlus,
      action: () => navigate("/teacher/my-courses"),
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "View Analytics",
      description: "Course performance insights",
      icon: BarChart3,
      action: () => navigate("/teacher/my-courses"),
      color: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {profile?.name?.split(" ")[0] || "Professor"} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Ready to inspire minds today? Your students are waiting to learn from you.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
              <p className="text-gray-600 dark:text-gray-400">Total Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
              <p className="text-gray-600 dark:text-gray-400">Total Students</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDocuments}</p>
              <p className="text-gray-600 dark:text-gray-400">Documents</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{publicCourses}</p>
              <p className="text-gray-600 dark:text-gray-400">Public Courses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <button
                key={index}
                onClick={action.action}
                className="group p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 text-left"
              >
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Courses</h2>
            <button
              onClick={() => navigate("/teacher/courses")}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {courses.length > 0 ? (
            <div className="space-y-3">
              {courses.slice(0, 3).map((course, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => navigate(`/teacher/course/${course.id}`)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{course.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {courseStats[course.id]?.students || 0} students • {courseStats[course.id]?.documents || 0}{" "}
                      documents
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {course.isPublic ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                        Public
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs rounded-full">
                        Private
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">No courses created yet</p>
              <button
                onClick={() => navigate("/teacher/create-course")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Create Course
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Course Overview</h2>

          {courses.length > 0 ? (
            <div className="space-y-4">
              {courses.slice(0, 4).map((course, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">{course.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {course.isPublic ? "Public" : "Private"} Course
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {courseStats[course.id]?.students || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">students</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">No activity yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Teaching Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Teaching Tip</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload diverse content types to enhance student engagement and learning outcomes.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/teacher/create-course")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
