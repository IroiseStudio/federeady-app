'use client'

import Spinner from '@/app/components/ui/spinner'
import { PromptCard } from './prompt-card'
import { AddPromptButton } from './add-prompt-button'
import { usePrompts } from '@/app/hooks/use-prompts'
import { useUser } from '@/app/hooks/use-user'
import { UserRole } from '@/types/user'
import { redirect } from 'next/navigation'

export default function AIActionsPage() {
	const { data: prompts, isLoading, refetch } = usePrompts()
	const { user, loading } = useUser()

	if (loading)
		return <div className="p-4 text-gray-500">Checking access...</div>

	if (user?.role !== UserRole.Admin) {
		redirect('/dashboard') // or show a 403 message
	}

	return (
		<div className="space-y-6">
			<h1 className="text-xl text-gray-800">AI Actions</h1>

			{isLoading ? (
				<Spinner />
			) : (
				prompts?.map((prompt) => (
					<PromptCard key={prompt.id} prompt={prompt} onSave={refetch} />
				))
			)}

			<AddPromptButton onCreate={refetch} />
		</div>
	)
}
