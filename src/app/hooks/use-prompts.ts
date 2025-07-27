import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type Prompt = {
	id: string
	label: string
	description: string
	content: string
	llm_task?: string | null
	version: number
	updated_at?: string | null
}

export function usePrompts() {
	return useQuery<Prompt[]>({
		queryKey: ['prompts'],
		queryFn: async () => {
			const { data, error } = await supabase.from('prompts').select('*')
			if (error) throw new Error(error.message)
			return data ?? []
		},
	})
}
