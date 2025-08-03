import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useDeleteMatch() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await supabase.from('job_matches').delete().eq('id', id)

			if (error) throw new Error(error.message)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['jobMatches'] })
		},
	})
}
