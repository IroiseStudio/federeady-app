import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { JobMatch } from '@/types/job-match'

export function useMatches(userId?: string) {
	return useQuery<JobMatch[]>({
		queryKey: ['jobMatches', userId],
		queryFn: async () => {
			if (!userId) return []
			const { data, error } = await supabase
				.from('job_matches')
				.select('*')
				.eq('user_id', userId)
				.order('created_at', { ascending: false })

			if (error) throw new Error(error.message)
			return data ?? []
		},
		enabled: !!userId,
	})
}
