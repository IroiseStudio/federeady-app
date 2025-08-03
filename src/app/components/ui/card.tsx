import { ReactNode } from 'react'
import clsx from 'clsx'

export function Card({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<div
			className={clsx(
				'bg-white shadow-md rounded-lg p-4 border border-gray-100 mb-4 ',
				className
			)}
		>
			{children}
		</div>
	)
}
