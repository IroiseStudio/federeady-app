import { supabase } from '@/lib/supabase'

/**
 * Updates links between a skill and its related experiences.
 * Deletes old links for this skill and user, then inserts the new ones.
 */
export async function useUpdateSkillExperienceLinks({
	userId,
	skillId,
	experienceIds,
}: {
	userId: string
	skillId: string
	experienceIds: string[]
}) {
	// Sanity check
	if (!userId || !skillId) return

	// Step 1: Remove existing links for this skill and user
	const { error: deleteError } = await supabase
		.from('skill_experience_links')
		.delete()
		.eq('user_id', userId)
		.eq('skill_id', skillId)

	if (deleteError) throw new Error(deleteError.message)

	// Step 2: Insert new links, deduplicated
	const uniqueExpIds = [...new Set(experienceIds)]

	const inserts = uniqueExpIds.map((expId) => ({
		user_id: userId,
		skill_id: skillId,
		experience_id: expId,
	}))

	if (inserts.length === 0) return

	const { error: insertError } = await supabase
		.from('skill_experience_links')
		.insert(inserts)

	if (insertError) throw new Error(insertError.message)
}
