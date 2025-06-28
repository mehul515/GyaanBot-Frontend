"use client"

import { useEffect, useState } from "react"
import { getTeacherProfile, updateTeacherProfile, getUser, saveUser } from "@/lib/api"
import { useNavigate } from "react-router-dom"
import { User, Save, Loader, ArrowLeft } from "lucide-react"

export default function UpdateTeacherProfile() {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const navigate = useNavigate()
  const role = getUser()?.role

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getTeacherProfile()
        setForm(res.data)
      } catch (err) {
        console.error("Error fetching teacher profile", err)
      } finally {
        setInitialLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await updateTeacherProfile(form)
      saveUser({ ...getUser(), teacher: res.data })
      alert("Profile updated successfully.")
      navigate("/profile")
    } catch (err) {
      console.error("Error updating profile:", err)
      alert("Failed to update profile.")
    }
    setLoading(false)
  }

  if (initialLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!form || role !== "TEACHER") return <p className="p-6">Access denied or loading...</p>

  const formFields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Enter your full name" },
    { name: "contactNumber", label: "Contact Number", type: "tel", placeholder: "Enter your phone number" },
    { name: "address", label: "Address", type: "text", placeholder: "Enter your address" },
    { name: "department", label: "Department", type: "text", placeholder: "Enter your department" },
    { name: "dob", label: "Date of Birth", type: "date", placeholder: "YYYY-MM-DD" },
    { name: "employeeId", label: "Employee ID", type: "text", placeholder: "Enter your employee ID" },
    { name: "designation", label: "Designation", type: "text", placeholder: "Enter your designation" },
    { name: "institution", label: "Institution", type: "text", placeholder: "Enter your institution" },
    { name: "qualification", label: "Qualification", type: "text", placeholder: "Enter your qualification" },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate("/profile")}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Update Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Keep your professional information up to date</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Professional Information</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            ))}
          </div>

          {/* Bio Field - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea
              name="bio"
              value={form.bio || ""}
              onChange={handleChange}
              placeholder="Tell us about yourself, your experience, and expertise..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            />
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
