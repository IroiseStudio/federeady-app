import { supabase } from '@/lib/supabase'

/**
 * Retrieves all experiences linked to a given skill for a user.
 */
export async function getLinkedExperiencesForSkill({
	userId,
	skillId,
}: {
	userId: string
	skillId: string
}) {
	if (!userId || !skillId) return []

	const { data, error } = await supabase
		.from('skill_experience_links')
		.select('experience_id')
		.eq('user_id', userId)
		.eq('skill_id', skillId)

	if (error) {
		console.error('Failed to fetch linked experiences:', error.message)
		return []
	}

	return data.map((d) => d.experience_id)
}
