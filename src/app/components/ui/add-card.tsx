import { ReactNode } from 'react'

interface AddCardProps {
	children: ReactNode
	onClick?: () => void
}

export function AddCard({ children, onClick }: AddCardProps) {
	return (
		<div
			onClick={onClick}
			className="cursor-pointer bg-white border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-600 hover:shadow-md transition mb-4"
		>
			{children}
		</div>
	)
}
