import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Experience } from '@/types/experience'

export function useAddExperience(userId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (experience: Partial<Experience>) => {
			const payload = {
				...experience,
				user_id: userId,
				start_date: experience.start_date || null,
				end_date: experience.current ? null : experience.end_date || null,
			}
			const { data, error } = await supabase
				.from('experiences')
				.insert([payload])
				.select()
			if (error) throw new Error(error.message)
			return data?.[0]
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['experiences', userId],
			})
		},
	})
}
