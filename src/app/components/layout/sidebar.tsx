'use client'

import Link from 'next/link'
import { PowerIcon } from '@heroicons/react/24/outline'

export type TabItem = {
	name: string
	href: string
	icon: React.ComponentType<{ className?: string }>
}

export type SidebarProps = {
	tabs: TabItem[]
	pathname: string
	isOpen: boolean // not used yet
	onClose: () => void // not used yet
	onLogout: () => void
}

export function Sidebar({
	tabs,
	pathname,
	onLogout,
	isOpen,
	onClose,
}: SidebarProps) {
	return (
		<>
			{/* Mobile Overlay */}
			<div
				className={`fixed inset-0 z-40 bg-gray-900 md:hidden transition-opacity duration-300 ${
					isOpen
						? 'opacity-70 pointer-events-auto'
						: 'opacity-0 pointer-events-none'
				}`}
				onClick={onClose}
			/>

			{/* Sidebar */}
			<aside
				className={`
    h-screen w-64 bg-white shadow-lg z-50
    fixed md:static
    flex flex-col justify-between
    transition-transform duration-300
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
  `}
			>
				{/* Top nav + links */}
				<nav className="p-6 space-y-4 overflow-y-auto flex-1">
					<h2 className="text-xl font-bold text-gray-800 mb-4">Fed-E-Ready</h2>
					{tabs.map((tab) => (
						<Link
							key={tab.name}
							href={tab.href}
							onClick={onClose}
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

				{/* Footer: Logout */}
				<div className="p-6">
					<button
						onClick={onLogout}
						className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
					>
						<PowerIcon className="w-5 h-5" />
						Log Out
					</button>
				</div>
			</aside>
		</>
	)
}
