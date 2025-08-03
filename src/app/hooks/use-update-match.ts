import { supabase } from '@/lib/supabase'
import { JobMatch } from '@/types/job-match'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateMatch() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: Partial<JobMatch> & { id: string }) => {
			const { error } = await supabase
				.from('job_matches')
				.update(payload)
				.eq('id', payload.id)
			if (error) throw new Error(error.message)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['jobMatches'] })
		},
	})
}
