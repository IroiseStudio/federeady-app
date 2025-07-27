'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Experience, ExperienceInput } from '@/types/experience'
import { ExperienceForm } from './experience-form'
import { ExperienceCard } from './experience-card'
import { testGPT4FedExp } from '@/lib/llm-parser/test-gpt'

const emptyExperience: ExperienceInput = {
	title: '',
	agency: '',
	gs_level: '',
	summary: '',
	start_date: '',
	end_date: '',
	current: false,
}

export default function FederalExperiences() {
	const [experiences, setExperiences] = useState<Experience[]>([])
	const [loading, setLoading] = useState(false)
	const [adding, setAdding] = useState(false)
	const [newExperience, setNewExperience] =
		useState<ExperienceInput>(emptyExperience)

	useEffect(() => {
		testGPT4FedExp()
	}, [])

	const fetchExperiences = async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession()

		const userId = session?.user?.id

		const { data, error } = await supabase
			.from('experiences')
			.select('*')
			.eq('user_id', userId)
			.order('current', { ascending: false }) // current:true first
			.order('start_date', { ascending: false, nullsFirst: false })

		if (!error) setExperiences(data as Experience[])
	}

	const addExperience = async () => {
		setLoading(true)

		const user = await supabase.auth.getUser()

		const payload = {
			...newExperience,
			user_id: user.data.user?.id,
			start_date: newExperience.start_date || null,
			end_date: newExperience.current ? null : newExperience.end_date || null,
		}

		const { data, error } = await supabase
			.from('experiences')
			.insert([payload])
			.select()
		setLoading(false)

		if (!error && data && data.length > 0) {
			setExperiences((prev) => [...prev, data[0]]) // ⬅️ Add to bottom of list
			setNewExperience(emptyExperience) // ⬅️ Reset form
			setAdding(false) // ⬅️ Collapse form
		} else {
			console.error('Supabase insert error:', error)
		}
	}

	useEffect(() => {
		fetchExperiences()
	}, [])

	return (
		<div className="min-h-screen p-6">
			<h2 className="text-lg font-semibold text-gray-800 mb-4">
				Your Federal Experience
			</h2>

			<div className="grid gap-4">
				{experiences.map((exp) => (
					<ExperienceCard
						key={exp.id}
						exp={exp}
						onDelete={fetchExperiences}
						onUpdate={fetchExperiences}
					/>
				))}
			</div>
			{adding ? (
				<div className="bg-white shadow-md rounded-lg p-4 border border-gray-100 mb-4">
					<ExperienceForm
						formType="add"
						experience={newExperience}
						setExperience={setNewExperience}
						onSave={addExperience}
						onCancel={() => {
							setAdding(false)
							setNewExperience(emptyExperience)
						}}
						loading={loading}
					/>
				</div>
			) : (
				<div
					className="cursor-pointer bg-white border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-600 hover:shadow-md transition"
					onClick={() => setAdding(true)}
				>
					+ Add New Experience
				</div>
			)}
		</div>
	)
}
