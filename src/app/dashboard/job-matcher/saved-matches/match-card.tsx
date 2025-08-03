import { ConfirmDialog } from '@/app/components/dialogs/confirm-dialog'
import { TagCard } from '@/app/components/ui/tag-card'
import { useDeleteMatch } from '@/app/hooks/use-delete-match'
import { useUpdateMatchStatus } from '@/app/hooks/user-update-match-status'

import { JobMatch, MatchStatus } from '@/types/job-match'
import { useState } from 'react'

export function MatchCard({ match }: { match: JobMatch }) {
	const { mutate: updateStatus, isPending: isUpdating } = useUpdateMatchStatus()
	const { mutate: deleteMatch, isPending: isDeleting } = useDeleteMatch()
	const [showConfirm, setShowConfirm] = useState(false)

	const due = match.due_date
		? new Date(match.due_date).toLocaleDateString()
		: 'No due date'

	const handleDelete = () => {
		if (!match.id) return
		deleteMatch(match.id)
		setShowConfirm(false)
	}

	return (
		<div className="border rounded p-4 bg-white shadow-sm space-y-2">
			<div className="flex justify-between items-center">
				<span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
					Match Score: {match.alignment_score}%
				</span>
				<TagCard
					text={match.status.charAt(0).toUpperCase() + match.status.slice(1)}
					color={
						match.status === MatchStatus.Passed
							? 'blue'
							: match.status === MatchStatus.Current
							? 'green'
							: match.status === MatchStatus.Archived
							? 'gray'
							: 'red'
					}
				/>
			</div>

			{match.job_url && (
				<a
					href={match.job_url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-sm text-blue-500 hover:underline"
				>
					View Job Posting
				</a>
			)}

			<div className="flex justify-between items-center">
				<h2 className="text-lg font-semibold text-gray-800">{match.title}</h2>
				<p className="text-sm text-gray-500">Due: {due}</p>
			</div>

			<p className="text-sm mt-2 text-gray-600">{match.notes}</p>

			<div>
				<p className="font-medium text-gray-500">
					Matching Skills:{' '}
					{match.matching_skills.length > 0 ? null : (
						<span className="text-gray-400 font-normal">None</span>
					)}
				</p>
				<div className="flex flex-wrap gap-2 mt-1">
					{match.matching_skills.map((skill) => (
						<TagCard key={skill} text={skill} color="green" />
					))}
				</div>
			</div>

			<div>
				<p className="font-medium text-gray-500">
					Missing Skills:{' '}
					{match.missing_skills.length > 0 ? null : (
						<span className="text-gray-400 font-normal">None</span>
					)}
				</p>
				<div className="flex flex-wrap gap-2 mt-1">
					{match.missing_skills.map((skill) => (
						<TagCard key={skill} text={skill} color="red" />
					))}
				</div>
			</div>

			<div className="flex justify-end mt-4 space-x-2">
				{match.status === MatchStatus.Archived ? (
					<button
						onClick={() => {
							if (!match.id) return
							updateStatus({ id: match.id, status: MatchStatus.Current })
						}}
						disabled={isUpdating}
						className={`text-xs px-3 py-1 rounded transition ${
							isUpdating
								? 'bg-green-300 text-white cursor-not-allowed'
								: 'bg-green-100 text-green-800 hover:bg-green-200'
						}`}
					>
						{isUpdating ? 'Restoring...' : 'Restore'}
					</button>
				) : (
					<button
						onClick={() => {
							if (!match.id) return
							updateStatus({ id: match.id, status: MatchStatus.Archived })
						}}
						disabled={isUpdating}
						className={`text-xs px-3 py-1 rounded transition ${
							isUpdating
								? 'bg-gray-300 text-white cursor-not-allowed'
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
						}`}
					>
						{isUpdating ? 'Archiving...' : 'Archive'}
					</button>
				)}
				<button
					onClick={() => setShowConfirm(true)}
					disabled={isDeleting}
					className={`text-xs px-3 py-1 rounded transition ${
						isDeleting
							? 'bg-red-300 text-white cursor-not-allowed'
							: 'bg-red-100 text-red-800 hover:bg-red-200'
					}`}
				>
					{isDeleting ? 'Deleting...' : 'Delete'}
				</button>
			</div>

			{showConfirm && (
				<ConfirmDialog
					title="Confirm Deletion"
					message="Are you sure you want to delete this job match? This action cannot be undone."
					onConfirm={handleDelete}
					onCancel={() => setShowConfirm(false)}
					confirmText="Delete"
					cancelText="Cancel"
				/>
			)}
		</div>
	)
}
