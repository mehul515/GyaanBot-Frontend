"use client"

import { useEffect, useState } from "react"
import { getStudentProfile } from "@/lib/api"
import { useNavigate } from "react-router-dom"
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Hash, Users, Building, Edit, CheckCircle } from 'lucide-react'

export default function StudentProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getStudentProfile()
        setProfile(res.data)
      } catch (err) {
        console.error("Error fetching student profile", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0

    const fields = [
      "name",
      "email",
      "rollNumber",
      "department",
      "yearOfStudy",
      "section",
      "contactNumber",
      "address",
      "dob",
      "college",
      "gender",
    ]

    const filledFields = fields.filter((field) => profile[field] && profile[field].toString().trim() !== "")
    return Math.round((filledFields.length / fields.length) * 100)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return <p className="p-6">Error loading profile...</p>

  const completionPercentage = calculateProfileCompletion(profile)

  const profileFields = [
    { label: "Name", value: profile.name, icon: User },
    { label: "Email", value: profile.email, icon: Mail },
    { label: "Roll Number", value: profile.rollNumber, icon: Hash },
    { label: "Department", value: profile.department, icon: GraduationCap },
    { label: "Year of Study", value: profile.yearOfStudy, icon: Calendar },
    { label: "Section", value: profile.section, icon: Users },
    { label: "Contact Number", value: profile.contactNumber, icon: Phone },
    { label: "Address", value: profile.address, icon: MapPin },
    { label: "Date of Birth", value: profile.dob, icon: Calendar },
    { label: "College", value: profile.college, icon: Building },
    { label: "Gender", value: profile.gender, icon: User },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">View your personal information and academic details</p>
      </div>

      {/* Profile Header with Completion */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 mb-6 border border-emerald-200/50 dark:border-emerald-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">{profile.role}</p>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.department} • {profile.college}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/update-profile")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Edit className="w-4 h-4" />
            Update Profile
          </button>
        </div>

        {/* Profile Completion */}
        <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Completion</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          {completionPercentage === 100 && (
            <div className="flex items-center gap-2 mt-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Profile Complete!</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profileFields.map((field, index) => {
            const IconComponent = field.icon
            return (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{field.label}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{field.value || "Not provided"}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
