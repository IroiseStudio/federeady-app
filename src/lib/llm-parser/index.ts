import { getPromptById } from './prompt-manager'
import { getAdapter } from './adapters/openai-adapter'
import { parseRaw, parseJson } from './utils/output-parser'
import { isQuotaExceeded, incrementUsage } from './utils/rate-limiter'

type Provider = 'openai' | 'mistral' | 'bedrock'

export interface ParseOptions {
	provider: Provider
	instanceId: string
	promptId: string
	input: string
	mode?: 'json' | 'raw'
	maxTokens?: number
}

export async function parseWithLLM(opts: ParseOptions): Promise<any> {
	if (isQuotaExceeded()) {
		throw new Error('Monthly usage limit reached')
	}

	const {
		provider,
		instanceId,
		promptId,
		input,
		mode = 'json',
		maxTokens,
	} = opts
	const template = await getPromptById(promptId)
	const prompt = template.replace('{{input}}', input.trim())
	const adapter = getAdapter(provider)
	const response = await adapter.invoke(prompt, { instanceId, maxTokens })

	incrementUsage()

	return mode === 'json' ? parseJson(response) : parseRaw(response)
}
