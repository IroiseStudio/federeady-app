import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types/user'

export function useUser() {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true)

			const { data: authData, error: authError } = await supabase.auth.getUser()
			const authUser = authData?.user

			if (authError || !authUser) {
				setUser(null)
				setLoading(false)
				return
			}

			const { data: dbUser, error: dbError } = await supabase
				.from('users')
				.select('*')
				.eq('id', authUser.id)
				.single()

			if (dbError || !dbUser) {
				setUser(null)
				setLoading(false)
				return
			}

			const mergedUser: User = {
				...dbUser,
				auth: {
					email: authUser.email,
					provider: authUser.app_metadata?.provider,
					...authUser,
				},
			}

			setUser(mergedUser)
			setLoading(false)
		}

		fetchUser()
	}, [])

	return { user, loading }
}
