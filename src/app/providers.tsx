'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionContextProvider supabaseClient={supabase}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</SessionContextProvider>
	)
}
