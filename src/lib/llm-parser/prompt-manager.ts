import { supabase } from '@/lib/supabase'

export async function getPromptById(id: string): Promise<string> {
	const { data, error } = await supabase
		.from('prompts')
		.select('content')
		.eq('id', id)
		.single()

	if (error || !data) {
		throw new Error(`Prompt "${id}" not found in Supabase`)
	}

	return data.content
}
