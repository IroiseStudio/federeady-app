import { supabase } from '@/lib/supabase'

export function AddPromptButton({ onCreate }: { onCreate: () => void }) {
	const handleCreate = async () => {
		const { data, error } = await supabase.from('prompts').insert({
			id: crypto.randomUUID(),
			label: 'New Prompt',
			description: '',
			content: 'Enter prompt here...',
			version: 1,
		})
		onCreate()
	}

	return (
		<button onClick={handleCreate} className="btn btn-accent">
			+ Add New Prompt
		</button>
	)
}
