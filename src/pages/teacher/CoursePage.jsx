"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getCourseById } from "@/lib/api"
import { BookOpen, Upload, FileText, UserPlus, Users, ArrowRight } from 'lucide-react'

const CoursePage = () => {
  const { id: courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(courseId)
        setCourse(res.data)
      } catch (err) {
        console.error("Failed to load course", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!course) return <p className="p-6">Course not found</p>

  const courseActions = [
    {
      title: "Upload Document",
      description: "Add study materials and resources",
      icon: Upload,
      link: `/teacher/course/${courseId}/upload`,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "View Documents",
      description: "Manage uploaded course materials",
      icon: FileText,
      link: `/teacher/course/${courseId}/documents`,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Enroll Students",
      description: "Add students to your course",
      icon: UserPlus,
      link: `/teacher/course/${courseId}/enroll`,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "View Enrolled",
      description: "See all enrolled students",
      icon: Users,
      link: `/teacher/course/${courseId}/students`,
      color: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <div className="p-6">
      {/* Course Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 mb-8 border border-emerald-200/50 dark:border-emerald-700/50">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{course.description}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-gray-800/50 rounded-full text-sm">
              {course.isPublic ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-400">Public Course</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-orange-700 dark:text-orange-400">Private Course</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Management Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courseActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <Link
                key={index}
                to={action.link}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 hover:scale-105 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CoursePage
