'use client'

import {
	BriefcaseIcon,
	SparklesIcon,
	HeartIcon,
	PlusIcon,
	WrenchIcon,
	CalculatorIcon,
} from '@heroicons/react/24/outline'
import { StatCard } from '../components/ui/stat-card'
import { ActionCard } from '../components/ui/action-card'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
	const router = useRouter()

	return (
		<div className="space-y-8 text-gray-800">
			<div className="bg-white rounded-xl shadow p-6">
				<h2 className="text-lg font-semibold mb-2">
					🏠 Welcome to your dashboard
				</h2>
				<p className="text-gray-700">
					Start by reviewing your experience or generating skill matches.
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<StatCard icon={BriefcaseIcon} label="Experiences" value={3} />
				<StatCard icon={SparklesIcon} label="Skills" value={17} />
				<StatCard icon={HeartIcon} label="Saved Matches" value={5} />
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<ActionCard
					icon={PlusIcon}
					title="Add New Experience"
					subtitle="Record a federal job you've held"
					onClick={() => router.push('/dashboard/profile')}
				/>
				<ActionCard
					icon={WrenchIcon}
					title="Edit Skills"
					subtitle="Review or modify your skill list"
					onClick={() => router.push('/dashboard/profile?tab=skills')}
				/>
				<ActionCard
					icon={CalculatorIcon}
					title="Match Jobs"
					subtitle="Paste a job description to find matches"
					onClick={() => router.push('/dashboard/job-matcher')}
				/>
			</div>
		</div>
	)
}
