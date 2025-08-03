'use client'
import { useState } from 'react'
import { parseWithLLM } from '@/lib/llm-parser'
import { sanitizeInput } from '@/lib/llm-parser/utils/sanitize'
import Spinner from '@/app/components/ui/spinner'
import { JobMatch } from '@/types/job-match'

export type FullJobMatchResult = JobMatch & {
	job_text: string
	title?: string
	url?: string
	due_date?: string
}

type Props = {
	skills: string[]
	onResult: (res: FullJobMatchResult) => void
}

export function JobInputForm({ skills, onResult }: Props) {
	const [jobText, setJobText] = useState('')
	const [url, setUrl] = useState('')
	const [dueDate, setDueDate] = useState('')
	const [loading, setLoading] = useState(false)

	async function handleAnalyze() {
		if (!jobText || skills.length === 0) {
			alert('Paste a job description and make sure you have saved skills.')
			return
		}

		setLoading(true)
		const input = {
			job_description: sanitizeInput(jobText),
			user_skills: skills,
		}

		try {
			const result = await parseWithLLM<JobMatch>({
				provider: 'openai',
				instanceId: 'gpt-4',
				promptId: 'match-skills-to-jd',
				input: JSON.stringify(input),
				mode: 'json',
			})

			console.log('LLM Result:', result)

			if (!result || typeof result !== 'object')
				throw new Error('Invalid LLM result')

			onResult({
				...result,
				job_text: jobText,
				url,
				due_date: dueDate,
			})
		} catch (err) {
			console.error(err)
			alert('Error analyzing match. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="space-y-4 mb-6">
			<textarea
				className="input"
				rows={8}
				placeholder="Paste the job description here..."
				value={jobText}
				onChange={(e) => setJobText(e.target.value)}
			/>
			<input
				className="input"
				type="text"
				placeholder="Job URL (optional)"
				value={url}
				onChange={(e) => setUrl(e.target.value)}
			/>

			<div className="flex-1">
				<label className="text-sm text-gray-700">Due Date</label>
				<input
					className="input"
					type="date"
					value={dueDate}
					onChange={(e) => setDueDate(e.target.value)}
				/>
			</div>
			<button
				disabled={loading}
				onClick={handleAnalyze}
				className={`text-sm px-3 py-1 rounded transition ${
					loading
						? 'bg-blue-400 text-white cursor-not-allowed'
						: 'bg-blue-600 text-white hover:bg-blue-700'
				}`}
			>
				{loading ? (
					<div className="flex items-center gap-2">
						<Spinner size={16} colorClass="text-white" />
						Analyzing...
					</div>
				) : (
					'Analyze Match'
				)}
			</button>
		</div>
	)
}
