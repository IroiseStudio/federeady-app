'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleSignup = async () => {
		setLoading(true)
		setError(null)

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		})

		if (error) {
			setError(error.message)
			setLoading(false)
			return
		}

		const userId = data.user?.id

		if (userId) {
			const { error: insertError } = await supabase.from('users').insert({
				id: userId,
				role: 'user', // you can change this dynamically
			})

			if (insertError) {
				setError(insertError.message)
				setLoading(false)
				return
			}
		}

		router.push('/dashboard')
		setLoading(false)
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-blue-700 px-4">
			<div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
				<h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
					Signup
				</h1>

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
					onClick={handleSignup}
					disabled={loading}
					className="w-full py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition"
				>
					{loading ? 'Signing up...' : 'Sign Up'}
				</button>
				<p className="mt-4 text-center text-sm text-gray-700">
					Already have an account?{' '}
					<a href="/auth/login" className="text-blue-600 font-medium underline">
						Log in
					</a>
				</p>
			</div>
		</div>
	)
}
