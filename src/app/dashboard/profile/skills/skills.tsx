'use client'

import { useEffect, useState } from 'react'
import { useSkills } from '@/app/hooks/use-skills'
import { useAddSkill } from '@/app/hooks/use-add-skill'
import { useExperiences } from '@/app/hooks/use-experiences'
import { useQueryClient } from '@tanstack/react-query'
import { AddCard } from '@/app/components/ui/add-card'
import { SkillCard } from './skill-card'
import { SkillForm } from './skill-form'
import { SkillInput } from '@/types/skill'
import Spinner from '@/app/components/ui/spinner'
import { supabase } from '@/lib/supabase'
import { parseWithLLM } from '@/lib/llm-parser'

const emptySkill: SkillInput = {
	name: '',
	source: 'manual',
	experience_id: null, // not an empty string!
}

export default function Skills() {
	const queryClient = useQueryClient()
	const [userId, setUserId] = useState<string | null>(null)
	const [adding, setAdding] = useState(false)
	const [loading, setLoading] = useState(false)
	const [newSkill, setNewSkill] = useState<SkillInput>(emptySkill)
	const [generating, setGenerating] = useState(false)
	const { data: skills = [], isLoading } = useSkills(userId || undefined)
	const { data: experiences = [] } = useExperiences(userId || undefined)
	const addSkill = useAddSkill(userId ?? '')

	useEffect(() => {
		const getUser = async () => {
			const { data: sessionData } = await supabase.auth.getSession()
			setUserId(sessionData?.session?.user.id ?? null)
		}
		getUser()
	}, [])

	const handleAdd = async () => {
		try {
			setLoading(true)
			await addSkill.mutateAsync(newSkill)
			setNewSkill(emptySkill)
			setAdding(false)
		} catch (e) {
			console.error('Add Skill Failed:', e)
		} finally {
			setLoading(false)
		}
	}

	const handleGenerateSkills = async () => {
		setGenerating(true)
		try {
			await generateSkills()
		} catch (err) {
			console.error('Generation failed', err)
			alert('Something went wrong while generating skills.')
		} finally {
			setGenerating(false)
		}
	}

	const generateSkills = async () => {
		if (!userId || !experiences || experiences.length === 0) {
			alert('No experiences found.')
			return
		}

		const formattedInput = experiences
			.map((exp) => `Title: ${exp.title}\nDescription: ${exp.summary || ''}`)
			.join('\n---\n')

		const result = await parseWithLLM({
			provider: 'openai',
			instanceId: 'gpt-3.5-turbo',
			promptId: 'generate-skills-from-experience',
			input: formattedInput,
			mode: 'json',
		})

		console.log('LLM Result:', result)

		if (!Array.isArray(result)) {
			alert('AI failed to generate skills. Try again.')
			return
		}

		const aiSkills: SkillInput[] = result.map((s: any) => ({
			name: s.name,
			source: 'llm',
			experience_id:
				experiences.find((e) => e.title === s.experience_title)?.id ?? null,
		}))

		const manualNames = (skills || [])
			.filter((s) => s.source === 'manual')
			.map((s) => s.name.toLowerCase())

		const uniqueSkills = aiSkills.filter(
			(s) => !manualNames.includes(s.name.toLowerCase())
		)

		for (const skill of uniqueSkills) {
			await addSkill.mutateAsync(skill)
		}

		queryClient.invalidateQueries({ queryKey: ['skills', userId] })
	}

	return (
		<div className="min-h-screen p-6">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-semibold text-gray-800">Your Skills</h2>
				<button
					onClick={handleGenerateSkills}
					disabled={generating}
					className={`text-sm px-3 py-1 rounded transition ${
						generating
							? 'bg-blue-400 text-white cursor-not-allowed'
							: 'bg-blue-600 text-white hover:bg-blue-700'
					}`}
				>
					{generating ? (
						<div className="flex items-center gap-2">
							<Spinner size={16} colorClass="text-white" />
							Generating...
						</div>
					) : (
						'Generate from Experience'
					)}
				</button>
			</div>

			{adding ? (
				<div className="bg-white shadow-md rounded-lg p-4 border border-gray-100 mb-4">
					<SkillForm
						formType="add"
						skill={newSkill}
						setSkill={setNewSkill}
						onSave={handleAdd}
						onCancel={() => {
							setAdding(false)
							setNewSkill(emptySkill)
						}}
						loading={loading}
					/>
				</div>
			) : (
				<AddCard onClick={() => setAdding(true)}>+ Add New Skill</AddCard>
			)}

			{isLoading ? (
				<Spinner />
			) : (
				<div className="grid gap-4">
					{skills.map((skill) => (
						<SkillCard
							key={skill.id}
							userId={userId || ''}
							skill={skill}
							onDelete={() =>
								queryClient.invalidateQueries({
									queryKey: ['skills', userId || undefined],
								})
							}
							onUpdate={() =>
								queryClient.invalidateQueries({
									queryKey: ['skills', userId || undefined],
								})
							}
						/>
					))}
				</div>
			)}
		</div>
	)
}
