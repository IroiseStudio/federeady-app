'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Experience, ExperienceInput } from '@/types/experience'
import { ExperienceForm } from './experience-form'
import { ExperienceCard } from './experience-card'
import { useExperiences } from '@/app/hooks/use-experience'
import { useAddExperience } from '@/app/hooks/use-add-experience'
import Spinner from '@/app/components/ui/spinner'
import { useQueryClient } from '@tanstack/react-query'

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
	const queryClient = useQueryClient()
	const [userId, setUserId] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [adding, setAdding] = useState(false)
	const [newExperience, setNewExperience] =
		useState<ExperienceInput>(emptyExperience)

	// Get user session on mount
	useEffect(() => {
		const getUser = async () => {
			const { data: sessionData } = await supabase.auth.getSession()
			setUserId(sessionData?.session?.user.id ?? null)
		}
		getUser()
	}, [])

	const { data: experiences, isLoading: isFetching } = useExperiences(
		userId || undefined
	)
	const addExperience = useAddExperience(userId ?? '')

	const handleAdd = async () => {
		try {
			setLoading(true)
			await addExperience.mutateAsync(newExperience)
			setNewExperience(emptyExperience)
			setAdding(false)
		} catch (e) {
			console.error('Add failed', e)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen p-6">
			<h2 className="text-lg font-semibold text-gray-800 mb-4">
				Your Federal Experience
			</h2>

			{isFetching ? (
				<Spinner />
			) : (
				<div className="grid gap-4">
					{experiences?.map((exp) => (
						<ExperienceCard
							userId={userId || undefined}
							key={exp.id}
							exp={exp}
							onDelete={() =>
								queryClient.invalidateQueries({
									queryKey: ['experiences', userId || undefined],
								})
							}
							onUpdate={() =>
								queryClient.invalidateQueries({
									queryKey: ['experiences', userId || undefined],
								})
							}
						/>
					))}
				</div>
			)}

			{adding ? (
				<div className="bg-white shadow-md rounded-lg p-4 border border-gray-100 mb-4">
					<ExperienceForm
						formType="add"
						experience={newExperience}
						setExperience={setNewExperience}
						onSave={handleAdd}
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
