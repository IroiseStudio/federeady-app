import { useState } from 'react'
import { ExperienceInput } from '@/types/experience'
import { parseWithLLM } from '@/lib/llm-parser'
import { isValid, format } from 'date-fns'

interface ExperienceFormProps {
	onSave: () => void
	loading: boolean
	experience: ExperienceInput
	setExperience: (e: ExperienceInput) => void
	formType?: 'add' | 'edit'
	onCancel?: () => void
}

export function ExperienceForm({
	onSave,
	loading,
	experience,
	setExperience,
	formType = 'add',
	onCancel,
}: ExperienceFormProps) {
	const [mode, setMode] = useState<'structured' | 'freeform'>('structured')
	const [showWarning, setShowWarning] = useState(false)
	const [freeformText, setFreeformText] = useState('')

	const handleSave = () => {
		if (!experience.title || !experience.agency || !experience.summary) {
			setShowWarning(true)
			setTimeout(() => setShowWarning(false), 3000)
			return
		}
		onSave()
	}

	const handleFreeformSubmit = async () => {
		if (!freeformText.trim()) return // avoid empty calls

		const result = await parseWithLLM<ExperienceInput>({
			provider: 'openai',
			instanceId: 'gpt-3.5-turbo',
			promptId: 'federal-experience',
			input: freeformText.trim(),
			mode: 'json',
		})

		console.log('LLM Result:', result)

		if (result && typeof result === 'object') {
			let isCurrent = false

			if (typeof result.end_date === 'string') {
				const lowered = result.end_date.toLowerCase()
				if (lowered.includes('present') || lowered.includes('current')) {
					isCurrent = true
				}
			}

			const normalized = {
				...result,
				start_date: normalizeDate(result.start_date) || undefined,
				end_date: isCurrent
					? undefined
					: normalizeDate(result.end_date) || undefined,
				current: isCurrent,
			}

			setExperience({
				...experience,
				...normalized,
			})

			setMode('structured')
		}
	}

	function normalizeDate(input: string | null | undefined): string | null {
		if (!input) return null

		const parsed = new Date(input)
		if (!isValid(parsed)) return null

		// Convert to YYYY-MM-DD string
		return format(parsed, 'yyyy-MM-dd')
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

			<div className="flex gap-4 border-b mb-4">
				<button
					onClick={() => setMode('structured')}
					className={`pb-2 px-1 border-b-2 text-sm font-medium ${
						mode === 'structured'
							? 'text-blue-600 border-blue-600'
							: 'text-gray-500 border-transparent hover:text-gray-700'
					}`}
				>
					Structured Form
				</button>
				<button
					onClick={() => setMode('freeform')}
					className={`pb-2 px-1 border-b-2 text-sm font-medium ${
						mode === 'freeform'
							? 'text-blue-600 border-blue-600'
							: 'text-gray-500 border-transparent hover:text-gray-700'
					}`}
				>
					Freeform (AI)
				</button>
			</div>

			{mode === 'structured' ? (
				<div className="grid gap-3">
					<input
						className="input"
						placeholder="Job Title *"
						value={experience.title}
						onChange={(e) =>
							setExperience({ ...experience, title: e.target.value })
						}
					/>
					<input
						className="input"
						placeholder="Agency *"
						value={experience.agency}
						onChange={(e) =>
							setExperience({ ...experience, agency: e.target.value })
						}
					/>
					<input
						className="input"
						placeholder="GS Level (optional)"
						value={experience.gs_level}
						onChange={(e) =>
							setExperience({ ...experience, gs_level: e.target.value })
						}
					/>
					<textarea
						className="input min-h-[100px]"
						placeholder="Summary / Description *"
						value={experience.summary}
						onChange={(e) =>
							setExperience({ ...experience, summary: e.target.value })
						}
					/>

					<div className="flex flex-col sm:flex-row gap-3">
						<div className="flex-1">
							<label className="text-sm text-gray-700">Start Date</label>
							<input
								type="date"
								className="input"
								value={experience.start_date || ''}
								onChange={(e) =>
									setExperience({
										...experience,
										start_date: e.target.value,
									})
								}
							/>
						</div>

						<div className="flex-1">
							<label className="text-sm text-gray-700 flex items-center justify-between">
								End Date
								<span className="flex items-center gap-2">
									<input
										type="checkbox"
										id="current"
										checked={experience.current}
										onChange={(e) =>
											setExperience({
												...experience,
												current: e.target.checked,
												end_date: e.target.checked ? '' : experience.end_date,
											})
										}
									/>
									<label htmlFor="current" className="text-sm text-gray-700">
										Present
									</label>
								</span>
							</label>
							{!experience.current && (
								<input
									type="date"
									className="input"
									value={experience.end_date || ''}
									onChange={(e) =>
										setExperience({
											...experience,
											end_date: e.target.value,
										})
									}
								/>
							)}
						</div>
					</div>

					{showWarning && (
						<div className="text-sm text-red-600 flex items-center gap-2">
							⚠️ Please fill in Title, Agency, and Description.
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
							: 'Save Experience'}
					</button>
				</div>
			) : (
				<div className="text-sm text-gray-600">
					<p className="mt-2 italic text-xs text-gray-400">
						Paste a job description. AI will extract the title, agency, and
						details.
					</p>
					<p className="text-xs text-red-500 mt-1">
						⚠️ You are responsible for the content you enter. Please avoid
						including any personally identifiable information (PII),
						confidential, or sensitive data.
					</p>
					<textarea
						className="input min-h-[150px]"
						placeholder="Paste your job duties or description (no PII). AI will fill out the form."
						value={freeformText}
						onChange={(e) => setFreeformText(e.target.value)}
					/>
					<button
						onClick={handleFreeformSubmit}
						className="mt-4 bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
					>
						Generate Experience
					</button>
				</div>
			)}
		</div>
	)
}
