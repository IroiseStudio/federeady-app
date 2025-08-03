'use client'

import { useSession } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

import {
	HomeIcon,
	UserIcon,
	Cog6ToothIcon,
	CpuChipIcon,
} from '@heroicons/react/24/outline'
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { UserRole } from '@/types/user'
import { useUser } from '../hooks/use-user'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const router = useRouter()
	const pathname = usePathname()
	const [loading, setLoading] = useState(true)
	const session = useSession()
	const { user, loading: userLoading } = useUser()

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (session === null) {
				router.push('/auth/login')
			} else if (session) {
				setLoading(false)
			}
		}, 300) // small delay to allow visual feedback

		return () => clearTimeout(timeout)
	}, [session, router])

	if (loading || userLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
				<div className="text-base font-medium mb-2">Checking session...</div>
				<div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
			</div>
		)
	}

	const tabs = [
		{ name: 'Home', href: '/dashboard', icon: HomeIcon },
		{ name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
		{ name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
		...(user?.role === UserRole.Admin
			? [
					{
						name: 'AI Actions',
						href: '/dashboard/ai-actions',
						icon: CpuChipIcon,
					},
			  ]
			: []),
	]

	const handleLogout = async () => {
		await supabase.auth.signOut()
		router.push('/auth/login')
	}

	return (
		<div className="flex min-h-screen bg-gray-100">
			<aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg flex flex-col justify-between">
				<nav className="p-6 space-y-4 overflow-y-auto">
					<h2 className="text-xl font-bold text-gray-800 mb-4">Dashboard</h2>
					{tabs.map((tab) => (
						<Link
							key={tab.name}
							href={tab.href}
							className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
								pathname === tab.href
									? 'bg-blue-100 text-blue-700'
									: 'text-gray-700 hover:bg-gray-100'
							}`}
						>
							<tab.icon className="w-5 h-5" />
							{tab.name}
						</Link>
					))}
				</nav>

				<div className="p-6">
					<button
						onClick={handleLogout}
						className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
					>
						<ArrowLeftOnRectangleIcon className="w-5 h-5" />
						Log Out
					</button>
				</div>
			</aside>

			<main className="ml-64 flex-1 bg-gray-100 min-h-screen overflow-y-auto">
				<div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
				<div className="p-8">{children}</div>
			</main>
		</div>
	)
}
