"use client"

import { useEffect, useState } from "react"
import { getTeacherProfile } from "@/lib/api"
import { useNavigate } from "react-router-dom"
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Building, Edit, CheckCircle, FileText } from 'lucide-react'

export default function TeacherProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getTeacherProfile()
        setProfile(res.data)
      } catch (err) {
        console.error("Error fetching teacher profile", err)
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
      "contactNumber",
      "address",
      "department",
      "designation",
      "employeeId",
      "dob",
      "institution",
      "qualification",
      "bio",
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
    { label: "Bio", value: profile.bio, icon: FileText },
    { label: "Employee ID", value: profile.employeeId, icon: GraduationCap },
    { label: "Department", value: profile.department, icon: Building },
    { label: "Designation", value: profile.designation, icon: GraduationCap },
    { label: "Contact Number", value: profile.contactNumber, icon: Phone },
    { label: "Address", value: profile.address, icon: MapPin },
    { label: "Date of Birth", value: profile.dob, icon: Calendar },
    { label: "Institution", value: profile.institution, icon: Building },
    { label: "Qualification", value: profile.qualification, icon: GraduationCap },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Teacher Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">View and manage your professional information</p>
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
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">{profile.designation}</p>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.department} • {profile.institution}
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profileFields.map((field, index) => {
            const IconComponent = field.icon
            const isBio = field.label === "Bio"
            
            return (
              <div key={index} className={`${isBio ? "md:col-span-2" : ""} flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl`}>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{field.label}</p>
                  {isBio ? (
                    <p className="font-medium text-gray-900 dark:text-white mt-1 leading-relaxed">
                      {field.value || "Not provided"}
                    </p>
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{field.value || "Not provided"}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
