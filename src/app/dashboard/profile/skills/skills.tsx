'use client'

import { useEffect, useState } from 'react'
import { useSkills } from '@/app/hooks/use-skills'
import { useAddSkill } from '@/app/hooks/use-add-skill'
import { useExperiences } from '@/app/hooks/use-experiences'
import { useQueryClient } from '@tanstack/react-query'
import { AddCard } from '@/app/components/ui/add-card'
import { SkillCard } from './skill-card'
import { SkillForm } from './skill-form'
import { Skill, SkillInput } from '@/types/skill'
import Spinner from '@/app/components/ui/spinner'
import { supabase } from '@/lib/supabase'
import { parseWithLLM } from '@/lib/llm-parser'
import { useDeleteAllSkills } from '@/app/hooks/use-delete-all-skills'
import { ConfirmDialog } from '@/app/components/dialogs/confirm-dialog'

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
	const deleteAllSkills = useDeleteAllSkills(userId || undefined)
	const [showConfirm, setShowConfirm] = useState(false)

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

	const handleDelete = () => {
		deleteAllSkills.mutate(undefined, {
			onSuccess: () => setShowConfirm(false),
			onError: (err) => {
				console.error('Failed to delete all skills:', err)
				alert('Could not delete skills.')
			},
		})
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
			.map((exp) => {
				const parts = [
					`Title: ${exp.title}`,
					exp.gs_level ? `Level: GS-${exp.gs_level}` : null,
					exp.agency ? `Office: ${exp.agency}` : null,
					`Description: ${exp.summary || ''}`,
				]
				return parts.filter(Boolean).join('\n')
			})
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

		type ParsedSkill = {
			name: string
			experience_titles: string[] | null
		}

		// 🔒 Check for existing skills only once
		const existingAiSkills = (skills || [])
			.filter((s) => s.source === 'llm')
			.reduce((acc, s) => {
				acc[s.name.toLowerCase()] = s
				return acc
			}, {} as Record<string, Skill>)

		const manualNames = (skills || [])
			.filter((s) => s.source === 'manual')
			.map((s) => s.name.toLowerCase())

		for (const s of result as ParsedSkill[]) {
			const skillName = s.name.trim()
			const key = skillName.toLowerCase()

			if (manualNames.includes(key)) continue

			const experienceIds = (s.experience_titles || [])
				.map((title) => experiences.find((e) => e.title === title)?.id)
				.filter(Boolean)

			let skillId: string

			if (existingAiSkills[key]) {
				// 🔁 Already exists
				skillId = existingAiSkills[key].id
			} else {
				// ➕ Insert new skill
				const { data: inserted, error } = await supabase
					.from('skills')
					.insert([
						{
							user_id: userId,
							name: skillName,
							source: 'llm',
							experience_id: null,
						},
					])
					.select()
					.single()

				if (error || !inserted) {
					console.error('Error adding skill:', error)
					continue
				}

				skillId = inserted.id
				// Update the map so we don’t re-add later
				existingAiSkills[key] = inserted
			}

			if (experienceIds.length > 0) {
				const linkRows = experienceIds.map((expId) => ({
					user_id: userId,
					skill_id: skillId,
					experience_id: expId,
				}))

				const { error: linkError } = await supabase
					.from('skill_experience_links')
					.upsert(linkRows, {
						onConflict: 'skill_id,experience_id',
					})

				if (linkError) {
					console.error('Error linking skill to experiences:', linkError)
				}
			}
		}

		queryClient.invalidateQueries({ queryKey: ['skills', userId] })
	}

	return (
		<div className="min-h-screen py-6 px-4 sm:px-6 md:px-8">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-semibold text-gray-800">Your Skills</h2>
				<div className="flex gap-2">
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

					<button
						onClick={() => setShowConfirm(true)}
						className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
					>
						Delete All
					</button>
				</div>
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
							getExperienceTitle={(id) => {
								const exp = experiences.find((e) => e.id === id)
								return exp ? exp.title : ''
							}}
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

			{showConfirm && (
				<ConfirmDialog
					title="Confirm Deletion"
					message="Are you sure you want to delete this skill?"
					onConfirm={handleDelete}
					onCancel={() => setShowConfirm(false)}
					confirmText="Delete"
					cancelText="Cancel"
				/>
			)}
		</div>
	)
}
