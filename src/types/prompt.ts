export type Prompt = {
	id: string
	label: string
	description: string
	content: string
	version: number
	llm_task?: string | null
	updated_at?: string | null
}
