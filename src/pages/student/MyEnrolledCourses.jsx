"use client"

import React, { useEffect, useState } from 'react'
import { getMyEnrolledCourses, getTeacherById } from '@/lib/api'
import { useNavigate } from 'react-router-dom'
import { BookOpen, User, GraduationCap, ArrowRight, Clock } from 'lucide-react'

const MyEnrolledCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const res = await getMyEnrolledCourses()

        const enriched = await Promise.all(
          res.data.map(async (enroll) => {
            const teacherRes = await getTeacherById(enroll.course.teacherId)
            return {
              ...enroll,
              teacher: teacherRes.data,
            }
          })
        )

        setCourses(enriched)
      } catch (err) {
        console.error('Failed to fetch enrolled courses', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrolled()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Enrolled Courses</h1>
        <p className="text-gray-600 dark:text-gray-400">Continue your learning journey with your enrolled courses</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Courses Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't enrolled in any courses yet. Start exploring!</p>
          <button
            onClick={() => navigate('/student/courses')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Browse Courses
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {courses.map(({ course, teacher }) => (
            <div
              key={course.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 hover:scale-[1.02] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>Continue Learning</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{course.description}</p>

                    {teacher && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">{teacher.name}</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {teacher.designation} • {teacher.department}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{teacher.college || teacher.institution}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/student/course/${course.id}`)}
                    className="ml-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    Open Course
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyEnrolledCourses
