'use client'

import { useState } from 'react'
import { Prompt } from '@/types/prompt'
import { PencilIcon } from '@heroicons/react/24/solid'
import { Card } from '@/app/components/ui/card'
import { useUpdatePrompt } from '@/app/hooks/use-update-prompt'

export function PromptCard({ prompt }: { prompt: Prompt; onSave: () => void }) {
	const [form, setForm] = useState(prompt)
	const [editing, setEditing] = useState(false)
	const updatePrompt = useUpdatePrompt()
	const updateField = (key: keyof Prompt, value: string) => {
		setForm((f) => ({ ...f, [key]: value }))
	}

	const handleSave = async () => {
		try {
			await updatePrompt.mutateAsync({
				id: form.id,
				label: form.label,
				description: form.description,
				content: form.content,
				llm_task: form.llm_task,
				version: form.version,
			})
			setEditing(false)
		} catch (err) {
			console.error('Save failed:', err)
			alert('Failed to save prompt')
		}
	}

	const handleCancel = () => {
		setForm(prompt)
		setEditing(false)
	}

	return (
		<Card>
			{editing ? (
				<div className="space-y-2">
					<input
						className="font-bold text-lg w-full text-gray-700"
						value={form.label}
						onChange={(e) => updateField('label', e.target.value)}
					/>
					<textarea
						className="w-full text-sm text-gray-700"
						value={form.description}
						onChange={(e) => updateField('description', e.target.value)}
					/>
					<textarea
						className="w-full text-sm font-mono bg-gray-50 rounded p-2 text-gray-700"
						rows={10}
						value={form.content}
						onChange={(e) => updateField('content', e.target.value)}
					/>
					<div className="flex justify-end gap-3 mt-3">
						<button
							onClick={handleSave}
							className="text-blue-600 font-medium hover:underline"
						>
							Save
						</button>
						<button
							onClick={handleCancel}
							className="text-gray-400 hover:text-red-600 transition"
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<>
					<div className="flex justify-between">
						<div>
							<h3 className="text-md font-bold text-gray-800">{form.label}</h3>
							<p className="text-sm text-gray-500 mt-1">{form.description}</p>
						</div>
						<div className="text-sm text-gray-500 italic">{form.llm_task}</div>
					</div>

					<pre className="text-sm font-mono text-gray-800 bg-gray-50 rounded p-2 mt-3 whitespace-pre-wrap">
						{form.content}
					</pre>

					<div className="flex justify-end gap-3 mt-3">
						<button
							onClick={() => setEditing(true)}
							className="text-gray-400 hover:text-blue-600 transition"
							title="Edit Prompt"
						>
							<PencilIcon className="h-5 w-5" />
						</button>
						{/* Optional: Add delete icon here later */}
					</div>
				</>
			)}
		</Card>
	)
}
