import { ReactNode } from 'react'

export function ActionCard({
	icon: Icon,
	title,
	subtitle,
	onClick,
}: {
	icon: React.ComponentType<{ className?: string }>
	title: string
	subtitle: string
	onClick: () => void
}) {
	return (
		<button
			onClick={onClick}
			className="bg-white rounded-xl shadow p-4 flex items-start gap-4 hover:shadow-md transition text-left w-full cursor-pointer"
		>
			<div className="p-2 bg-gray-100 rounded-full">
				<Icon className="w-6 h-6 text-gray-700" />
			</div>
			<div>
				<div className="font-semibold">{title}</div>
				<div className="text-sm text-gray-500">{subtitle}</div>
			</div>
		</button>
	)
}
