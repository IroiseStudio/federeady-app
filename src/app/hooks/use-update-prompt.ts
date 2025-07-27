import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Prompt } from './use-prompts'

export function useUpdatePrompt() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (updated: Partial<Prompt> & { id: string }) => {
			const { error } = await supabase
				.from('prompts')
				.update({
					label: updated.label,
					description: updated.description,
					content: updated.content,
					llm_task: updated.llm_task,
					version: updated.version,
				})
				.eq('id', updated.id)

			if (error) throw new Error(error.message)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['prompts'] })
		},
	})
}
