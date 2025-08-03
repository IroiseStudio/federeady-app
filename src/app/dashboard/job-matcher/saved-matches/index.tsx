'use client'

import { useMatches } from '@/app/hooks/use-matchs'
import { useSession } from '@supabase/auth-helpers-react'
import { MatchCard } from './match-card'
import { useState } from 'react'
import { MatchStatus } from '@/types/job-match'

export default function SavedMatchesTab() {
	const session = useSession()
	const userId = session?.user?.id
	const { data: matches, isLoading, error } = useMatches(userId)
	const [filter, setFilter] = useState<MatchStatus | 'all'>('all')

	if (isLoading) return <p>Loading saved matches...</p>
	if (error) return <p className="text-red-500">Error: {error.message}</p>
	if (!matches || matches.length === 0)
		return <p className="text-gray-500">No saved matches yet.</p>

	const filteredMatches = matches.filter((m) =>
		filter === 'all' ? true : m.status === filter
	)

	return (
		<>
			<div className="flex gap-2 mb-4 border-b border-gray-300">
				{(
					[
						'all',
						MatchStatus.Current,
						MatchStatus.Passed,
						MatchStatus.Archived,
					] as const
				).map((key) => (
					<button
						key={key}
						onClick={() => setFilter(key)}
						className={`px-4 py-1 text-sm font-medium rounded-t-md ${
							filter === key
								? 'bg-white text-blue-600 border-x border-t border-gray-300'
								: 'text-gray-600 hover:text-gray-800'
						}`}
					>
						{key === 'all' ? 'All' : key.charAt(0).toUpperCase() + key.slice(1)}
					</button>
				))}
			</div>

			<div className="space-y-4">
				{filteredMatches.map((match) => (
					<MatchCard key={match.id} match={match} />
				))}
			</div>
		</>
	)
}
