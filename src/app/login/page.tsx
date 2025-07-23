'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-500 px-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">FedEReady Login</h1>

      <input
        type="email"
        placeholder="Email"
        className="w-full mb-4 px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full py-2 rounded-md bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold hover:opacity-90 transition"
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </div>
  </div>
)
}