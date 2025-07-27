import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { UserRole } from '@/types/user'

export function useUserRole() {
	const [role, setRole] = useState<UserRole | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchRole = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()

			const userId = session?.user.id
			if (!userId) {
				setRole(null)
				setLoading(false)
				return
			}

			const { data, error } = await supabase
				.from('users')
				.select('role')
				.eq('id', userId)
				.single()

			if (!error && data?.role) {
				setRole(data.role as UserRole)
			}

			setLoading(false)
		}

		fetchRole()
	}, [])

	return { role, loading }
}
