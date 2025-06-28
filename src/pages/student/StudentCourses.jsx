"use client"

import { useEffect, useState } from "react"
import { getAllCourses, getMyEnrolledCourses, joinCourse, getTeacherById } from "@/lib/api"
import { useNavigate } from "react-router-dom"
import { BookOpen, User, CheckCircle, Plus, Search } from "lucide-react"

const StudentCourses = () => {
  const [courses, setCourses] = useState([])
  const [enrolledIds, setEnrolledIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [allCoursesRes, enrolledRes] = await Promise.all([getAllCourses(), getMyEnrolledCourses()])

        const enrolledIds = enrolledRes.data.map((c) => c.course.id)
        setEnrolledIds(enrolledIds)

        const enrichedCourses = await Promise.all(
          allCoursesRes.data.map(async (course) => {
            try {
              const teacherRes = await getTeacherById(course.teacherId)
              return { ...course, teacher: teacherRes.data }
            } catch {
              return { ...course, teacher: null }
            }
          }),
        )

        setCourses(enrichedCourses)
      } catch (err) {
        console.error("Failed to fetch courses", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleJoin = async (courseId) => {
    try {
      await joinCourse(courseId)
      setEnrolledIds((prev) => [...prev, courseId])
    } catch (err) {
      console.error("Failed to join course", err)
      alert("Error joining course.")
    }
  }

  const handleView = (id) => {
    navigate(`/student/course/${id}`)
  }

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.teacher && course.teacher.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Available Courses</h1>
        <p className="text-gray-600 dark:text-gray-400">Discover and join courses to start your learning journey</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses, instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Courses Found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredCourses.map((course) => (
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
                        <div className="flex items-center gap-2 text-sm">
                          {course.isPublic ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-600 dark:text-green-400 font-medium">Public</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-orange-600 dark:text-orange-400 font-medium">Private</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{course.description}</p>

                    {course.teacher && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">{course.teacher.name}</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {course.teacher.designation} • {course.teacher.department}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {course.teacher.college || course.teacher.institution}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 text-right">
                    {enrolledIds.includes(course.id) ? (
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Enrolled
                        </div>
                        <button
                          onClick={() => handleView(course.id)}
                          className="block w-full px-4 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoin(course.id)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      >
                        <Plus className="w-4 h-4" />
                        Join Course
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentCourses