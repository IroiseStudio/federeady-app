import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Skill } from '@/types/skill'

export function useUpdateSkill(userId: string | undefined) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (updated: Partial<Skill> & { id: string }) => {
			const sanitizedUpdate = {
				...updated,
				experience_id: updated.experience_id || null, // ✅ convert "" to null
			}

			const { error } = await supabase
				.from('skills')
				.update(sanitizedUpdate)
				.eq('id', updated.id)

			if (error) throw new Error(error.message)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['skills', userId] })
		},
	})
}
