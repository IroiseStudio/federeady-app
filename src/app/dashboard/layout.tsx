'use client'

import { useSession } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import {
	HomeIcon,
	UserIcon,
	Cog6ToothIcon,
	CpuChipIcon,
	Bars3Icon,
} from '@heroicons/react/24/outline'
import { UserRole } from '@/types/user'
import { useUser } from '../hooks/use-user'
import { Sidebar } from '../components/layout/sidebar'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const router = useRouter()
	const pathname = usePathname()
	const [loading, setLoading] = useState(true)
	const session = useSession()
	const [sidebarOpen, setSidebarOpen] = useState(false)
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
		{ name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
		{ name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
		{ name: 'Job Matcher', href: '/dashboard/job-matcher', icon: UserIcon },
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
		<div className="flex h-screen overflow-hidden bg-gray-100">
			<Sidebar
				tabs={tabs}
				pathname={pathname}
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				onLogout={handleLogout}
			/>

			{/* Topbar for Mobile */}
			<div className="md:hidden flex flex-col w-full fixed top-0 left-0 z-30 bg-white shadow-md">
				<div className="flex items-center justify-between p-4">
					<button
						onClick={() => setSidebarOpen(true)}
						className="text-gray-600 focus:outline-none"
					>
						<Bars3Icon className="w-6 h-6" />
					</button>
					<span className="font-semibold text-gray-800">Fed-E-Ready</span>
				</div>
				{/* Color bar attached to bottom of topbar */}
				<div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
			</div>

			<main className="flex-1 bg-gray-100 overflow-y-auto pt-16 md:pt-0">
				<div className="hidden md:block h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
				<div className="px-4 py-8 sm:px-6 md:px-8">{children}</div>
			</main>
		</div>
	)
}
