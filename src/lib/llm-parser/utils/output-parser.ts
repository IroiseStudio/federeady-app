export function parseRaw(response: string): string {
	return response
}

export function parseJson(response: string): any {
	try {
		const cleaned = response
			.trim()
			.replace(/^```(?:json)?/i, '')
			.replace(/```$/, '')
			.trim()

		return JSON.parse(cleaned)
	} catch (e) {
		console.warn('⚠️ Failed to parse JSON:', e)
		return null
	}
}
