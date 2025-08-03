export type JobMatch = {
	id?: string
	user_id: string
	title: string
	job_text: string
	job_url?: string | null
	due_date?: string | null
	alignment_score: number
	matching_skills: string[]
	missing_skills: string[]
	notes: string
	status: MatchStatus
	created_at?: string
}

export enum MatchStatus {
	Current = 'current',
	Passed = 'passed',
	Archived = 'archived',
}
