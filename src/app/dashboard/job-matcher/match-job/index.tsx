'use client'

import { useSaveMatch } from '@/app/hooks/use-save-match'
import { JobMatch, MatchStatus } from '@/types/job-match'
import { useSession } from '@supabase/auth-helpers-react'
import { JobInputForm } from './job-input-form'
import { MatchResult } from './match-result'
import { Card } from '@/app/components/ui/card'

export default function MatchJobTab({
	userSkills,
	result,
	setResult,
	saved,
	setSaved,
}: {
	userSkills: string[]
	result: Partial<JobMatch> | null
	setResult: (r: Partial<JobMatch> | null) => void
	saved: boolean
	setSaved: (v: boolean) => void
}) {
	const session = useSession()

	const { mutate: saveMatch, isPending } = useSaveMatch()

	const handleSave = () => {
		if (!result || !session?.user?.id) return

		const payload: JobMatch = {
			user_id: session.user.id,
			title: result.title ?? 'Untitled',
			job_text: result.job_text ?? '',
			job_url: result.job_url?.trim() || null,
			due_date: result.due_date?.trim() || null,
			alignment_score: result.alignment_score ?? 0,
			matching_skills: result.matching_skills ?? [],
			missing_skills: result.missing_skills ?? [],
			notes: result.notes ?? '',
			status:
				result.due_date && new Date(result.due_date) < new Date()
					? MatchStatus.Passed
					: MatchStatus.Current,
		}

		saveMatch(payload, {
			onSuccess: () => setSaved(true),
			onError: (err) => {
				alert(`Failed to save match: ${err.message}`)
			},
		})
	}

	return (
		<>
			<Card>
				<JobInputForm skills={userSkills} onResult={setResult} />
			</Card>

			{result && (
				<Card>
					<MatchResult result={result} />
					{!saved && (
						<button
							onClick={handleSave}
							disabled={isPending}
							className={`mt-4 px-4 py-2 text-sm rounded ${
								isPending
									? 'bg-gray-400 text-white cursor-not-allowed'
									: 'bg-green-600 text-white hover:bg-green-700'
							}`}
						>
							{isPending ? 'Saving...' : 'Save Match'}
						</button>
					)}
				</Card>
			)}
		</>
	)
}
