export function parseRaw(response: string): string {
	return response
}

export function parseJson(response: string): any {
	try {
		return JSON.parse(response)
	} catch (e) {
		console.warn('⚠️ Failed to parse JSON:', e)
		return null
	}
}
