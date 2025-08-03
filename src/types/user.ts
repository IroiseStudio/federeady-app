export enum UserRole {
	Admin = 'admin',
	User = 'user',
}

export interface User {
	id: string
	role: UserRole

	auth?: {
		email?: string
		provider?: string
		[key: string]: unknown
	}
}
