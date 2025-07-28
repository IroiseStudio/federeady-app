import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Skill } from '@/types/skill'

export function useAddSkill(userId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (skill: Partial<Skill>) => {
			const payload = {
				...skill,
				user_id: userId,
			}
			const { data, error } = await supabase
				.from('skills')
				.insert([payload])
				.select()
			if (error) throw new Error(error.message)
			return data?.[0]
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['skills', userId] })
		},
	})
}
