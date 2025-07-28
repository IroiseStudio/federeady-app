export interface Skill {
	id: string
	user_id: string
	experience_id: string | null
	name: string
	source?: 'llm' | 'manual'
	category?: string
	created_at?: string
}

export interface SkillInput {
	name: string
	source: 'manual' | 'llm'
	category?: string
	experience_id: string | null
}
