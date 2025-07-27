export interface LLMAdapter {
	invoke(
		prompt: string,
		opts: { instanceId: string; maxTokens?: number }
	): Promise<string>
}
