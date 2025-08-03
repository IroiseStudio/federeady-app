import { ScoreCircle } from '@/app/components/ui/score-circle'

type Result = {
	title: string
	alignment_score: number
	matching_skills: string[]
	missing_skills: string[]
	notes: string
}

export function MatchResult({ result }: { result: Partial<Result> }) {
	const {
		title = 'Job Match Result',
		alignment_score = 0,
		matching_skills = [],
		missing_skills = [],
		notes = 'No feedback available.',
	} = result

	return (
		<div className="flex gap-6 items-start">
			{/* LEFT: Score Circle */}
			<div className="flex-shrink-0">
				<p className="font-lg text-gray-500">Match Score:</p>
				<ScoreCircle score={alignment_score} size={120} />
			</div>

			{/* RIGHT: Skills + Feedback */}
			<div className="flex-1 space-y-4">
				<h2 className="text-xl font-semibold text-gray-800">{title}</h2>
				<div>
					<p className="font-medium text-gray-500">
						Matching Skills:{' '}
						{matching_skills.length > 0 ? null : (
							<span className="text-gray-400 font-normal">None</span>
						)}
					</p>
					<div className="flex flex-wrap gap-2 mt-1">
						{matching_skills.map((skill) => (
							<span
								key={skill}
								className="bg-green-200 text-green-900 px-2 py-1 rounded text-sm"
							>
								{skill}
							</span>
						))}
					</div>
				</div>

				<div>
					<p className="font-medium text-gray-500">
						Missing Skills:{' '}
						{missing_skills.length > 0 ? null : (
							<span className="text-gray-400 font-normal">None</span>
						)}
					</p>
					<div className="flex flex-wrap gap-2 mt-1">
						{missing_skills.map((skill) => (
							<span
								key={skill}
								className="bg-red-200 text-red-900 px-2 py-1 rounded text-sm"
							>
								{skill}
							</span>
						))}
					</div>
				</div>

				<div>
					<p className="font-medium text-gray-500">AI Feedback:</p>
					<p className="text-gray-700 mt-1">{notes}</p>
				</div>
			</div>
		</div>
	)
}
