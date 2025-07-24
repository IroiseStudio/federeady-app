'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ResetRequestPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async () => {
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
redirectTo: `${window.location.origin}/auth/update-password`
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for the reset link.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-indigo-900 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
{message && (
  <>
    <p className="text-green-600 text-sm mb-2 text-center">{message}</p>
    <div className="mt-4 mb-4 text-center">
      <a
        href="/auth/login"
        className="inline-block text-sm text-blue-600 font-medium underline hover:text-blue-800"
      >
        ← Back to login
      </a>
    </div>
  </>
)}
        <button
          onClick={handleReset}
          className="w-full py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  )
}
