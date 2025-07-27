import { ReactNode } from 'react'

export function Card({ children }: { children: ReactNode }) {
	return (
		<div className="bg-white shadow-md rounded-lg p-4 border border-gray-100 mb-4">
			{children}
		</div>
	)
}
