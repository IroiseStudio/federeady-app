'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
const [loading, setLoading] = useState(false)

const handleUpdate = async () => {
  setLoading(true)
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    setError(error.message)
  } else {
    setMessage('Password updated successfully. Redirecting to login...')
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  }

  setLoading(false)
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-indigo-900 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Set New Password</h1>

        <input
          type="password"
          placeholder="New password"
          className="w-full mb-4 px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

<button
  disabled={loading || !!message}
  onClick={handleUpdate}
  className={`w-full py-2 rounded-md text-white font-semibold transition ${
    message
      ? 'bg-green-500 cursor-default'
      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
  }`}
>
  {message ? 'Success! Redirecting...' : loading ? 'Updating...' : 'Update Password'}
</button>
      </div>
    </div>
  )
}
