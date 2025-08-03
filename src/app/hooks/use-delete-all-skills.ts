import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useDeleteAllSkills(userId: string | undefined) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async () => {
			if (!userId) throw new Error('User ID is missing')

			const { error } = await supabase
				.from('skills')
				.delete()
				.eq('user_id', userId)

			if (error) throw new Error(error.message)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['skills', userId] })
		},
	})
}
