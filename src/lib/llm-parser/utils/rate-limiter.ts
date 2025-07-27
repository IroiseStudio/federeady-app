const USAGE_KEY = 'llm_parse_usage'
const MONTHLY_LIMIT = 30

export function incrementUsage(): void {
	const data = getUsageData()
	const now = new Date()

	if (!isSameMonth(data.timestamp, now)) {
		// Reset if it's a new month
		setUsageData({ count: 1, timestamp: now })
	} else {
		setUsageData({ count: data.count + 1, timestamp: now })
	}
}

export function getUsageCount(): number {
	const data = getUsageData()
	const now = new Date()
	return isSameMonth(data.timestamp, now) ? data.count : 0
}

export function isQuotaExceeded(): boolean {
	return getUsageCount() >= MONTHLY_LIMIT
}

// Internal utils
function getUsageData(): { count: number; timestamp: Date } {
	try {
		const raw = localStorage.getItem(USAGE_KEY)
		if (!raw) return { count: 0, timestamp: new Date(0) }
		const parsed = JSON.parse(raw)
		return { count: parsed.count, timestamp: new Date(parsed.timestamp) }
	} catch {
		return { count: 0, timestamp: new Date(0) }
	}
}

function setUsageData(data: { count: number; timestamp: Date }): void {
	localStorage.setItem(
		USAGE_KEY,
		JSON.stringify({
			count: data.count,
			timestamp: data.timestamp.toISOString(),
		})
	)
}

function isSameMonth(a: Date, b: Date): boolean {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}
