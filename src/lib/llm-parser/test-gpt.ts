import { parseWithLLM, ParseOptions } from './index'

/**
 * General-purpose test function to experiment with any LLM config
 */
export async function testLLMGeneric(options: ParseOptions) {
	try {
		const result = await parseWithLLM(options)
		console.log('✅ LLM Output:', result)
	} catch (err: any) {
		console.error('❌ LLM Error:', err.message)
	}
}

const DEFAULT_INPUT = `
From October 2019 to March 2023, I worked as a Program Analyst for the Department of Veterans Affairs.
I coordinated audits, handled reporting for budget oversight, and developed internal dashboards to monitor compliance.
I was a GS-11 employee during this time.
`

export function testGPT35FedExp() {
	return testLLMGeneric({
		provider: 'openai',
		instanceId: 'gpt-3.5-turbo',
		promptId: 'federal-experience',
		input: DEFAULT_INPUT,
		mode: 'json',
	})
}

export function testGPT4FedExp(input = DEFAULT_INPUT) {
	return testLLMGeneric({
		provider: 'openai',
		instanceId: 'gpt-4',
		promptId: 'federal-experience',
		input,
		mode: 'json',
	})
}

export function testGPTRawMode() {
	return testLLMGeneric({
		provider: 'openai',
		instanceId: 'gpt-3.5-turbo',
		promptId: 'federal-experience',
		input: DEFAULT_INPUT,
		mode: 'raw',
	})
}
