'use client'

export function TagCard({ text }: { text: string }) {
	return (
		<span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
			{text}
		</span>
	)
}
