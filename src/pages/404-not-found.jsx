"use client"

import { useNavigate } from "react-router-dom"
import { Home, ArrowLeft, Search, BookOpen, MessageCircle } from "lucide-react"

export default function NotFound() {
  const navigate = useNavigate()

  const quickLinks = [
    {
      title: "Dashboard",
      description: "Go to your main dashboard",
      icon: Home,
      action: () => navigate("/dashboard"),
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Browse Courses",
      description: "Explore available courses",
      icon: BookOpen,
      action: () => navigate("/student/courses"),
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Chat With Courses",
      description: "Get help from AI tutors",
      icon: MessageCircle,
      action: () => navigate("/student/chat"),
      color: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/10 flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-bold text-gray-200 dark:text-gray-700 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <Search className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Oops! Page Not Found</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            The page you're looking for seems to have wandered off into the digital void.
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Don't worry, even the best explorers sometimes take a wrong turn!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Or try these popular destinations:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon
              return (
                <button
                  key={index}
                  onClick={link.action}
                  className="group p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 text-left"
                >
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${link.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{link.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{link.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-8 p-4 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            💡 <strong>Pro tip:</strong> If you think this page should exist, please contact our support team. We're
            always here to help you navigate your learning journey!
          </p>
        </div>

        {/* Floating Elements for Visual Appeal */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-20 w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </div>
  )
}
