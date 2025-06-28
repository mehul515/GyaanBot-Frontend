"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCourseById, getCourseDocuments, getTeacherById } from '@/lib/api'
import DashboardLayout from '@/layouts/DashboardLayout'
import { BookOpen, User, FileText, ExternalLink, Mail, Phone, MapPin, GraduationCap } from 'lucide-react'

export default function StudentCoursePage() {
  const { id: courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [teacher, setTeacher] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const courseRes = await getCourseById(courseId)
        setCourse(courseRes.data)

        const teacherRes = await getTeacherById(courseRes.data.teacherId)
        setTeacher(teacherRes.data)

        const docsRes = await getCourseDocuments(courseId)
        setDocuments(docsRes.data)
      } catch (err) {
        console.error('Failed to load course / teacher / documents', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [courseId])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!course) return <DashboardLayout><p className="p-6">Course not found</p></DashboardLayout>

  return (
      <div className="p-6 space-y-6">
        {/* Course Header */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50">
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

        {/* Instructor Details */}
        {teacher && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Instructor
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{teacher.name}</h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">{teacher.designation}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{teacher.department}, {teacher.institution}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{teacher.contactNumber}</span>
                  </div>
                </div>
                
                {teacher.bio && (
                  <p className="mt-3 text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    "{teacher.bio}"
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Documents Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Course Materials
          </h2>
          
          {documents.length ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{doc.description}</p>
                    </div>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    View
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">No documents uploaded yet</p>
            </div>
          )}
        </div>
      </div>
  )
}
