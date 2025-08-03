type Props = {
	score: number // 0 to 100
	size?: number // px, default 100
}

export function ScoreCircle({ score, size = 100 }: Props) {
	const radius = size / 2 - 8
	const circumference = 2 * Math.PI * radius
	const offset = circumference - (score / 100) * circumference

	return (
		<svg width={size} height={size} className="block">
			<circle
				stroke="#e5e7eb"
				fill="transparent"
				strokeWidth="8"
				r={radius}
				cx={size / 2}
				cy={size / 2}
			/>
			<circle
				stroke="#3b82f6"
				fill="transparent"
				strokeWidth="8"
				r={radius}
				cx={size / 2}
				cy={size / 2}
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				strokeLinecap="round"
				transform={`rotate(-90 ${size / 2} ${size / 2})`}
			/>
			<text
				x="50%"
				y="50%"
				dominantBaseline="middle"
				textAnchor="middle"
				fontSize="20"
				fill="#1f2937"
				fontWeight="bold"
			>
				{score}%
			</text>
		</svg>
	)
}
