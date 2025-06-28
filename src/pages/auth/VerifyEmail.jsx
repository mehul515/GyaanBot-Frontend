"use client"

import { useState, useRef, useEffect } from "react"
import React from "react"
import { Link } from "react-router-dom"
import { Shield, AlertCircle, CheckCircle } from "lucide-react"
import { verifyEmail } from "@/lib/api"


function OTPInput({ value, onChange, disabled = false, length = 6 }) {
  const inputRefs = useRef([])

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus()
    }
  }, [disabled])

  const handleChange = (index, inputValue) => {
    // Only allow single digit
    const digit = inputValue.replace(/\D/g, "").slice(-1)

    // Update the value
    const newValue = value.split("")
    newValue[index] = digit
    const updatedValue = newValue.join("").slice(0, length)
    onChange(updatedValue)

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current input is empty, focus previous input
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newValue = value.split("")
        newValue[index] = ""
        onChange(newValue.join(""))
      }
    }
    // Handle arrow keys
    else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
    // Handle paste
    else if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    onChange(pastedData)

    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleFocus = (index) => {
    // Select all text when focusing
    inputRefs.current[index]?.select()
  }

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={`
            w-12 h-12 text-center text-lg font-semibold rounded-xl border-2 transition-all duration-200
            ${
              disabled
                ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : value[index]
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300 shadow-lg"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-emerald-400 dark:hover:border-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20"
            }
            focus:outline-none
          `}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  )
}

// Main Verify Email Component
export default function VerifyEmail() {
  const [otp, setOtp] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setLoading(true)

    try {
      const email = localStorage.getItem("register_email")
      await verifyEmail({ email, otp })
      setMessage("Email verified successfully!")
      setVerified(true)
      // Clear the stored email after successful verification
      localStorage.removeItem("register_email")
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.")
    } finally {
      setLoading(false)
    }
  }

  const isOtpComplete = otp.length === 6
  const storedEmail = localStorage.getItem("register_email")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            {verified ? <CheckCircle className="w-8 h-8 text-white" /> : <Shield className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            {verified ? "Email Verified!" : "Verify Your Email"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {verified
              ? "Your account is now ready to use"
              : `Enter the 6-digit code sent to ${storedEmail ? storedEmail.replace(/(.{2}).*(@.*)/, "$1***$2") : "your email"}`}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          {!verified ? (
            <form onSubmit={handleVerify} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {/* Success Message (for resend) */}
              {message && !verified && (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-sm text-green-700 dark:text-green-300">{message}</p>
                </div>
              )}

              {/* OTP Input */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                  Verification Code
                </label>
                <OTPInput value={otp} onChange={setOtp} disabled={loading} />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isOtpComplete}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              {/* Success Message */}
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-300">{message}</p>
              </div>

              {/* Continue Button */}
              <Link
                to="/auth/login"
                className="inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
              >
                Continue to Login
              </Link>
            </div>
          )}

          {/* Footer */}
        </div>

        {/* Back to Login */}
        {!verified && (
          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
