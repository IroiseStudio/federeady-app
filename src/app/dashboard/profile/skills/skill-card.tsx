'use client'

import { useState } from 'react'
import { Skill, SkillInput } from '@/types/skill'
import { useUpdateSkill } from '@/app/hooks/use-update-skill'
import { useDeleteSkill } from '@/app/hooks/use-delete-skill'
import { ConfirmDialog } from '@/app/components/dialogs/confirm-dialog'
import { SkillForm } from './skill-form'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/solid'
import { Card } from '@/app/components/ui/card'

interface SkillCardProps {
	userId: string | undefined
	skill: Skill
	getExperienceTitle?: (id: string) => string
	onDelete: () => void
	onUpdate?: () => void
}

export function SkillCard({
	userId,
	skill,
	getExperienceTitle,
	onDelete,
	onUpdate,
}: SkillCardProps) {
	const [editMode, setEditMode] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const [editedSkill, setEditedSkill] = useState<SkillInput>({
		name: skill.name,
		source: skill.source || 'manual',
		experience_id: skill.experience_id || '',
	})
	const updateSkill = useUpdateSkill(userId)
	const deleteSkill = useDeleteSkill(userId)

	const handleDelete = () => {
		deleteSkill.mutate(skill.id, {
			onSuccess: () => {
				onDelete?.()
				setShowConfirm(false)
			},
			onError: (err) => {
				console.error('Failed to delete skill:', err)
			},
		})
	}

	const handleUpdate = async () => {
		try {
			await updateSkill.mutateAsync({ ...editedSkill, id: skill.id })
			setEditMode(false)
			onUpdate?.()
		} catch (err) {
			console.error('Update failed:', err)
			alert('Failed to update skill')
		}
	}

	return (
		<Card>
			{editMode ? (
				<SkillForm
					skill={editedSkill}
					setSkill={setEditedSkill}
					onSave={handleUpdate}
					loading={false}
					formType="edit"
					onCancel={() => setEditMode(false)}
				/>
			) : (
				<>
					<div className="flex justify-between items-start">
						<div>
							<h3 className="text-md font-semibold text-gray-800">
								{skill.name}
							</h3>
							<p className="text-xs text-gray-500">
								{skill.source === 'llm' ? 'AI' : 'Manual'}
								{skill.experience_id && getExperienceTitle
									? ` · ${getExperienceTitle(skill.experience_id)}`
									: ''}
							</p>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => setEditMode(true)}
								className="text-gray-400 hover:text-blue-600 transition"
								title="Edit Skill"
							>
								<PencilIcon className="h-5 w-5" />
							</button>
							<button
								onClick={() => setShowConfirm(true)}
								className="text-gray-400 hover:text-red-600 transition"
								title="Delete Skill"
							>
								<TrashIcon className="h-5 w-5" />
							</button>
						</div>
					</div>

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
				</>
			)}
		</Card>
	)
}
