import { OpenAI } from 'openai' // assumes openai npm package is installed
import { LLMAdapter } from './types'

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '' // For client-side

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })

export const OpenAIAdapter: LLMAdapter = {
	async invoke(prompt: string, { instanceId, maxTokens = 500 }) {
		const res = await openai.chat.completions.create({
			model: instanceId, // e.g., 'gpt-3.5-turbo' or your assistant ID
			messages: [
				{ role: 'system', content: 'You are a helpful parsing assistant.' },
				{ role: 'user', content: prompt },
			],
			temperature: 0,
			max_tokens: maxTokens,
		})

		return res.choices?.[0]?.message?.content ?? ''
	},
}

export function getAdapter(provider: string): LLMAdapter {
	if (provider === 'openai') return OpenAIAdapter
	throw new Error(`Unsupported provider: ${provider}`)
}
