import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Skill } from '@/types/skill'

export function useSkills(userId?: string) {
	return useQuery<Skill[]>({
		queryKey: ['skills', userId],
		queryFn: async () => {
			if (!userId) return []
			const { data, error } = await supabase
				.from('skills')
				.select('*')
				.eq('user_id', userId)
				.order('created_at', { ascending: false })
			if (error) throw new Error(error.message)
			return data || []
		},
		enabled: !!userId,
	})
}
