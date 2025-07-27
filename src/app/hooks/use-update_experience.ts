import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Experience } from '@/types/experience'

export function useUpdateExperience(userId: string | undefined) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (updated: Partial<Experience> & { id: string }) => {
			const payload = {
				...updated,
				start_date: updated.start_date || null,
				end_date: updated.current ? null : updated.end_date || null,
			}

			const { error } = await supabase
				.from('experiences')
				.update(payload)
				.eq('id', updated.id)

			if (error) throw new Error(error.message)
		},
		onSuccess: () => {
			if (userId) {
				queryClient.invalidateQueries({ queryKey: ['experiences', userId] })
			}
		},
	})
}
