'use client'

import { useSession } from '@supabase/auth-helpers-react'
import { useSkills } from '@/app/hooks/use-skills'
import { useState } from 'react'
import { Card } from '@/app/components/ui/card'
import MatchJobTab from './match-job'
import SavedMatchesTab from './saved-matches'
import { JobMatch } from '@/types/job-match'

export default function JobMatcherPage() {
	const session = useSession()
	const userId = session?.user?.id
	const { data: skills, isLoading } = useSkills(userId)
	const [activeTab, setActiveTab] = useState<'match' | 'saved'>('match')
	const [result, setResult] = useState<Partial<JobMatch> | null>(null)
	const [saved, setSaved] = useState(false)

	const userSkills = skills?.map((s) => s.name) || []

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">Job Matcher</h1>

			<div className="flex gap-2 border-b border-gray-300 mb-6">
				<button
					onClick={() => setActiveTab('match')}
					className={`px-4 py-2 text-sm font-medium rounded-t-md ${
						activeTab === 'match'
							? 'bg-white text-blue-600 border-x border-t border-gray-300'
							: 'text-gray-600 hover:text-gray-800'
					}`}
				>
					Match My Skills
				</button>
				<button
					onClick={() => setActiveTab('saved')}
					className={`px-4 py-2 text-sm font-medium rounded-t-md ${
						activeTab === 'saved'
							? 'bg-white text-blue-600 border-x border-t border-gray-300'
							: 'text-gray-600 hover:text-gray-800'
					}`}
				>
					Saved Matches
				</button>
			</div>

			<>
				{isLoading ? (
					<Card>
						<p>Loading skills...</p>
					</Card>
				) : activeTab === 'match' ? (
					<MatchJobTab
						userSkills={userSkills}
						result={result}
						setResult={setResult}
						saved={saved}
						setSaved={setSaved}
					/>
				) : (
					<SavedMatchesTab />
				)}
			</>
		</div>
	)
}
