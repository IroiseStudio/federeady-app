'use client'

type TagCardProps = {
	text: string
	color?: 'green' | 'blue' | 'red' | 'yellow' | 'gray'
}

const colorClasses: Record<string, string> = {
	green: 'bg-green-200 text-green-900',
	blue: 'bg-blue-200 text-blue-900',
	red: 'bg-red-200 text-red-900',
	yellow: 'bg-yellow-200 text-yellow-900',
	gray: 'bg-gray-100 text-gray-600',
}

export function TagCard({ text, color = 'gray' }: TagCardProps) {
	return (
		<span
			className={`text-xs px-2 py-0.5 rounded-full ${
				colorClasses[color] || colorClasses.gray
			}`}
		>
			{text}
		</span>
	)
}
