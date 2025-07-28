'use client'

import { useState } from 'react'
import FederalExperiences from './experiences/federal-experiences'
import Skills from './skills/skills'

export default function ProfilePage() {
	const [activeTab, setActiveTab] = useState<'experiences' | 'skills'>(
		'experiences'
	)

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Builder</h1>

			<div className="flex gap-2 border-b border-gray-300 mb-6">
				<button
					onClick={() => setActiveTab('experiences')}
					className={`px-4 py-2 text-sm font-medium rounded-t-md 
            ${
							activeTab === 'experiences'
								? 'bg-white text-blue-600 border-x border-t border-gray-300'
								: 'text-gray-600 hover:text-gray-800'
						}`}
				>
					Federal Experiences
				</button>
				<button
					onClick={() => setActiveTab('skills')}
					className={`px-4 py-2 text-sm font-medium rounded-t-md 
            ${
							activeTab === 'skills'
								? 'bg-white text-blue-600 border-x border-t border-gray-300'
								: 'text-gray-600 hover:text-gray-800'
						}`}
				>
					Skills
				</button>
			</div>

			<div className="bg-white rounded-md shadow-md p-6">
				{activeTab === 'experiences' ? <FederalExperiences /> : <Skills />}
			</div>
		</div>
	)
}
