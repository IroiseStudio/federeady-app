export function parseRaw<T = string>(response: string): T {
	return response as T
}

export function parseJson<T = unknown>(response: string): T | null {
	try {
		const cleaned = response
			.trim()
			.replace(/^```(?:json)?/i, '')
			.replace(/```$/, '')
			.trim()

		return JSON.parse(cleaned) as T
	} catch (e) {
		console.warn('⚠️ Failed to parse JSON:', e)
		return null
	}
}
