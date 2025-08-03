export function sanitizeInput(text: string): string {
	return text
		.replace(/\s+/g, ' ') // collapse all whitespace
		.replace(/\[.*?\]\(.*?\)/g, '') // remove markdown links
		.replace(/https?:\/\/\S+/g, '') // strip raw URLs
		.replace(/[^\x00-\x7F]/g, '') // remove non-ASCII characters (optional)
		.trim()
}
