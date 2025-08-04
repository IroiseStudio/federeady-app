import { ReactNode } from 'react'

export function StatCard({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ComponentType<{ className?: string }>
	label: string
	value: string | number
}) {
	return (
		<div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
			<div className="p-2 bg-blue-100 rounded-full">
				<Icon className="w-6 h-6 text-blue-600" />
			</div>
			<div>
				<div className="text-sm text-gray-500">{label}</div>
				<div className="text-xl font-bold">{value}</div>
			</div>
		</div>
	)
}
