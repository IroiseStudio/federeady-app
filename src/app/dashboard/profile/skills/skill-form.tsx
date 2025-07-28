import { useState } from 'react'
import { SkillInput } from '@/types/skill'

interface SkillFormProps {
	skill: SkillInput
	setSkill: (s: SkillInput) => void
	onSave: () => void
	loading: boolean
	formType?: 'add' | 'edit'
	onCancel?: () => void
}

export function SkillForm({
	skill,
	setSkill,
	onSave,
	loading,
	formType = 'add',
	onCancel,
}: SkillFormProps) {
	const [showWarning, setShowWarning] = useState(false)

	const handleSave = () => {
		if (!skill.name?.trim()) {
			skill.source = 'manual'
			setShowWarning(true)
			setTimeout(() => setShowWarning(false), 3000)
			return
		}
		onSave()
	}

	return (
		<div>
			{onCancel && (
				<div className="flex justify-end mb-4">
					<button
						onClick={onCancel}
						className="text-sm text-gray-500 hover:underline"
					>
						Cancel
					</button>
				</div>
			)}

			<div className="grid gap-3">
				<input
					className="input"
					placeholder="Skill Name *"
					value={skill.name}
					onChange={(e) => setSkill({ ...skill, name: e.target.value })}
				/>

				{/* <select
					className="input"
					value={skill.source}
					onChange={(e) =>
						setSkill({ ...skill, source: e.target.value as 'manual' | 'llm' })
					}
				>
					<option value="manual">Manual</option>
					<option value="llm">AI</option>
				</select> */}

				{showWarning && (
					<div className="text-sm text-red-600">
						⚠️ Please enter a skill name.
					</div>
				)}

				<button
					onClick={handleSave}
					disabled={loading}
					className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-4 py-2 rounded w-full hover:opacity-90 disabled:opacity-50"
				>
					{loading
						? 'Saving...'
						: formType === 'edit'
						? 'Save Changes'
						: 'Save Skill'}
				</button>
			</div>
		</div>
	)
}
