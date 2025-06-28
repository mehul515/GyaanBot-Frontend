"use client"

import { useEffect, useRef, useState } from "react"
import {
  Bot,
  User,
  Send,
  MessageCircle,
  ChevronDown,
  Square,
  Sparkles,
  Paperclip,
  ArrowUp,
  Check,
  BarChart3,
} from "lucide-react"
import { getMyEnrolledCourses, askCourseQuestion } from "@/lib/api"

export default function ChatPage() {
  const [courses, setCourses] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCourseDropdown, setShowCourseDropdown] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark))
  }, [])

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  useEffect(() => {
    getMyEnrolledCourses().then((res) => {
      setCourses(res.data)
      if (res.data.length > 0) {
        setSelectedCourseId(res.data[0].course.id)
      }
    })
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!question.trim()) return

    const newUserMessage = { type: "user", text: question }
    setMessages((prev) => [...prev, newUserMessage])
    setLoading(true)
    setQuestion("")

    try {
      const res = await askCourseQuestion(question, selectedCourseId)
      const answer = res.data.response || "I don't know."
      setMessages((prev) => [...prev, { type: "bot", text: answer }])
    } catch (error) {
      setMessages((prev) => [...prev, { type: "bot", text: "❌ Error fetching response." }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const selectedCourse = courses.find((enrollment) => enrollment.course.id === selectedCourseId)

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {selectedCourse ? `${selectedCourse.course.title} AI Tutor` : "AI Tutor"}
            </div>
            <div className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Online & Ready to Help
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Start a Conversation</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ask any question about your course materials. I'm here to help!
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 mb-6 ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.type === "user" ? "bg-gray-200 dark:bg-gray-600" : "bg-gradient-to-br from-emerald-500 to-teal-600"
                }`}
            >
              {msg.type === "user" ? (
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={`max-w-[80%] ${msg.type === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`text-xs mb-2 ${msg.type === "user" ? "text-gray-500 dark:text-gray-400" : "text-emerald-600 dark:text-emerald-400"}`}
              >
                {msg.type === "user" ? "You" : "AI Tutor"}
              </div>
              <div
                className={`inline-block px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.type === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700/50"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="max-w-[80%]">
              <div className="text-xs mb-2 text-emerald-600 dark:text-emerald-400">AI Tutor</div>
              <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-200"></div>
                  </div>
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* v0-style Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700/50">
        {/* Course Dropdown */}
        {showCourseDropdown && (
          <div className="mb-4 relative">
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-1 shadow-lg absolute top-0 left-0 w-full z-10 max-w-md  ">
              <div className="space-y-2">
                {courses.map((enrollment) => (
                  <button
                    key={enrollment.course.id}
                    onClick={() => {
                      setSelectedCourseId(enrollment.course.id)
                      setShowCourseDropdown(false)
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <span className="text-gray-900 dark:text-white font-medium">{enrollment.course.title}</span>
                    {selectedCourseId === enrollment.course.id && <Check className="w-4 h-4 text-emerald-500" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="relative bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
          <div className="flex items-end">
            {/* Input Field */}
            <div className="flex-1 relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a follow-up..."
                className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-6 py-4 focus:outline-none resize-none text-base leading-relaxed"
                rows={1}
                style={{ minHeight: "60px", maxHeight: "160px" }}
                onInput={(e) => {
                  e.target.style.height = "auto"
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"
                }}
              />
              {/* Course Selector */}
              <button
                onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors p-5"
              >
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium">
                  {selectedCourse ? selectedCourse.course.title : "Select Course"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 p-4">
              {/* Send Button */}
              {loading ? (
                <button
                  onClick={() => setLoading(false)}
                  className="px-4 py-2 text-white text-sm font-medium rounded-lg flex items-center gap-2 bg-gradient-to-br from-emerald-500 to-teal-600 "
                >
                  <Square className="w-4 h-4" />
                  Stop
                </button>
              ) : (
                <button
                  onClick={sendMessage}
                  disabled={!question.trim()}
                  className="p-3 text-white rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
