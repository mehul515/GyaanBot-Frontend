"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getCourseById, getEnrolledStudents, removeStudent, getStudentById } from "@/lib/api"
import { BookOpen, Users, Mail, GraduationCap, Hash, Trash2, Search, UserPlus } from "lucide-react"

const ViewEnrolled = () => {
  const { id: courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [studentProfiles, setStudentProfiles] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await getCourseById(courseId)
        setCourse(courseRes.data)

        const enrolledRes = await getEnrolledStudents(courseId)
        const profiles = await Promise.all(
          enrolledRes.data.map((enroll) =>
            getStudentById(enroll.id).then((res) => ({
              ...res.data,
              studentId: enroll.id,
              email: enroll.email,
            })),
          ),
        )
        setStudentProfiles(profiles)
        setFilteredStudents(profiles)
      } catch (err) {
        console.error("Error fetching course/students:", err)
        alert("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  // Filter students based on search
  useEffect(() => {
    const filtered = studentProfiles.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredStudents(filtered)
  }, [searchTerm, studentProfiles])

  const handleRemove = async (studentId) => {
    if (!window.confirm("Remove this student from the course?")) return
    try {
      await removeStudent(courseId, studentId)
      setStudentProfiles((prev) => prev.filter((s) => s.studentId !== studentId))
    } catch (err) {
      console.error(err)
      alert("Failed to remove student.")
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Enrolled Students</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage students enrolled in your course</p>
      </div>

      {/* Course Header */}
      {course && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 mb-8 border border-emerald-200/50 dark:border-emerald-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h2>
                <p className="text-gray-700 dark:text-gray-300">{course.description}</p>
              </div>
            </div>
            <button
              onClick={() => (window.location.href = `/teacher/course/${courseId}/enroll`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <UserPlus className="w-4 h-4" />
              Add Student
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      {studentProfiles.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students by name, email, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Students List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Students ({filteredStudents.length})
            </h3>
          </div>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="space-y-4">
            {filteredStudents.map((student, i) => (
              <div
                key={i}
                className="group bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">{student.name?.charAt(0)?.toUpperCase() || "S"}</span>
                    </div>

                    {/* Student Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{student.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Hash className="w-4 h-4" />
                          {student.rollNumber}
                        </div>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="w-4 h-4" />
                          {student.department} - Year {student.yearOfStudy}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(student.studentId)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 font-medium rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {studentProfiles.length === 0 ? "No Students Enrolled" : "No Students Found"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {studentProfiles.length === 0
                ? "Start by enrolling students to your course"
                : "Try adjusting your search criteria"}
            </p>
            {studentProfiles.length === 0 && (
              <button
                onClick={() => (window.location.href = `/teacher/course/${courseId}/enroll`)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <UserPlus className="w-4 h-4" />
                Enroll Your First Student
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewEnrolled
