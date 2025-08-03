import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { JobMatch } from '@/types/job-match'

export function useSaveMatch() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: JobMatch) => {
			const { error } = await supabase
				.from('job_matches')
				.upsert(payload, { onConflict: 'id' }) // inserts or updates
			if (error) throw new Error(error.message)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['jobMatches'] })
		},
	})
}
