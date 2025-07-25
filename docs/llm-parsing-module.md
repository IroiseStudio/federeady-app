# 🧠 LLM Parsing Module

## Overview

The LLM Parsing Module enables client-side extraction of structured data from unstructured user input using any Large Language Model (LLM) provider. It is designed to be reusable, lightweight, and cost-efficient, supporting use cases such as transforming freeform text into structured fields for profile building.

This module powers features like parsing pasted federal experience descriptions into structured job fields (`title`, `agency`, `description`, etc.) in the FedEReady application.

---

## ✨ Features

- ✅ **Provider-Agnostic**: Compatible with OpenAI, Mistral, AWS Bedrock, etc.
- ✅ **Instance-Based Routing**: Supports different agents/models per task
- ✅ **Prompt Management**: Prompts defined locally or by external LLM services
- ✅ **Flexible Output Modes**: Supports `raw` text or validated `json` parsing
- ✅ **Client-Side Rate Limiting**: Usage caps per client to control costs
- ✅ **Modular and Extendable**: Each component can evolve independently

---

## 🔧 Core Use Case

**Input**: A freeform pasted job description from USAJobs  
**Output**: A validated JSON object like:

```json
{
	"title": "Program Analyst",
	"agency": "Department of Veterans Affairs",
	"description": "Responsible for coordinating and analyzing program operations...",
	"level": "GS-11",
	"start_date": "2019-06",
	"end_date": "2023-01"
}
```

---

## 🏗️ Architecture

```txt
[React Frontend App]
  |
  |-- [ParserModule.ts]
         |
         ├── ProviderAdapterFactory
         │     ├── OpenAIAdapter
         │     ├── MistralAdapter
         │     └── BedrockAdapter
         |
         ├── PromptManager
         │     └── Loads templates or references external agents
         |
         ├── OutputParser
         │     ├── RawParser
         │     └── JSONValidator
         |
         └── RateLimiter
               └── Tracks usage per client (via localStorage)
```

---

## 📦 Module Interface

```ts
type Provider = 'openai' | 'mistral' | 'bedrock'

interface ParseOptions {
	provider: Provider
	instanceId: string
	promptId: string
	input: string
	mode?: 'json' | 'raw'
	maxTokens?: number
}

async function parseWithLLM(opts: ParseOptions): Promise<ParsedOutput>
```

---

## 🧠 Prompt Format Example

```txt
Extract the following fields as JSON:
- title
- agency
- description
- level (optional)
- start_date (optional)
- end_date (optional)

If a field is missing, return null.
Text: {{input}}
```

Prompts can be managed:

- Locally (e.g., Markdown or TS templates)
- On the LLM service (e.g., OpenAI Assistants or Bedrock Agents)

---

## 🔒 Client Usage Control

To control cost and avoid abuse:

- Parsing is limited to N calls per month
- Usage is tracked in `localStorage`
- Future plans include syncing usage with Supabase if the user is logged in

---

## 🔮 Extensibility Ideas

| Feature            | Description                                   |
| ------------------ | --------------------------------------------- |
| Multi-turn support | Enable follow-up parsing workflows            |
| Prompt versioning  | Avoid breaking changes with stored prompts    |
| Streaming support  | Live updates from LLMs that support streaming |
| Fallback providers | Retry with secondary LLM if the first fails   |

---

## 🚀 Why It Matters

This module demonstrates thoughtful modular architecture, cost-aware client design, and scalable prompt-driven parsing—all key skills in modern AI-enhanced app development.
