import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { MatchStatus } from '@/types/job-match'

export function useUpdateMatchStatus() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ id, status }: { id: string; status: MatchStatus }) => {
			const { error } = await supabase
				.from('job_matches')
				.update({ status })
				.eq('id', id)

			if (error) throw new Error(error.message)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['jobMatches'] })
		},
	})
}
