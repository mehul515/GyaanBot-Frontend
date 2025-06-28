"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { enrollStudent, getCourseById } from "@/lib/api"
import { BookOpen, UserPlus, Mail, CheckCircle, XCircle } from "lucide-react"

const EnrollStudent = () => {
  const { id: courseId } = useParams()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(courseId)
        setCourse(res.data)
      } catch (err) {
        console.error("Failed to load course", err)
      }
    }
    fetchCourse()
  }, [courseId])

  const handleEnroll = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await enrollStudent(courseId, email)
      setStatus("success")
      setEmail("")
    } catch (err) {
      console.error(err)
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Enroll Student</h1>
        <p className="text-gray-600 dark:text-gray-400">Add a student to your course by email</p>
      </div>

      {/* Course Header */}
      {course && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 mb-8 border border-emerald-200/50 dark:border-emerald-700/50 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h2>
              <p className="text-gray-700 dark:text-gray-300">{course.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add Student</h3>
        </div>

        <form onSubmit={handleEnroll} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Student Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter student's email address"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enrolling...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Enroll Student
              </>
            )}
          </button>
        </form>

        {/* Status Messages */}
        {status && (
          <div className="mt-6">
            {status === "success" ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-green-700 dark:text-green-400 font-medium">Student enrolled successfully!</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-400 font-medium">
                  Failed to enroll student. Please try again.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrollStudent
