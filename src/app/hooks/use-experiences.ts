import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Experience } from '@/types/experience'

export function useExperiences(userId?: string) {
	return useQuery<Experience[]>({
		queryKey: ['experiences', userId],
		queryFn: async () => {
			if (!userId) return []
			const { data, error } = await supabase
				.from('experiences')
				.select('*')
				.eq('user_id', userId)
				.order('current', { ascending: false })
				.order('start_date', { ascending: false, nullsFirst: false })
			if (error) throw new Error(error.message)
			return data || []
		},
		enabled: !!userId, // don't run unless user is loaded
	})
}
