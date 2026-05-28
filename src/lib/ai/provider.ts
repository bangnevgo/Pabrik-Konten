import { getAIConfig, activeProvider } from './config'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionResult {
  content: string
}

export interface AIClient {
  chat(messages: ChatMessage[]): Promise<ChatCompletionResult>
}

// --- Z.AI provider (existing, uses z-ai-web-dev-sdk) ---

class ZAIClient implements AIClient {
  async chat(messages: ChatMessage[]): Promise<ChatCompletionResult> {
    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = new ZAI()
    const model = getAIConfig().model

    const response = await zai.chat.completions.create({
      model: model || 'default',
      messages: messages as any,
    })

    return { content: response.choices?.[0]?.message?.content || '' }
  }
}

// --- OpenAI-compatible provider (OpenRouter, NVIDIA, OpenCode, etc.) ---

class OpenAICompatibleClient implements AIClient {
  private baseUrl: string
  private apiKey: string
  private model: string

  constructor() {
    const cfg = getAIConfig()
    this.baseUrl = cfg.baseUrl.replace(/\/+$/, '')
    this.apiKey = cfg.apiKey
    this.model = cfg.model
  }

  async chat(messages: ChatMessage[]): Promise<ChatCompletionResult> {
    const url = `${this.baseUrl}/chat/completions`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        ...(activeProvider === 'openrouter'
          ? {
              'HTTP-Referer':
                process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              'X-Title': 'Pabrik Konten',
            }
          : {}),
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Unknown error')
      throw new Error(
        `AI provider error (${res.status}): ${errText}`
      )
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || ''
    return { content }
  }
}

// --- Factory ---

let cachedClient: AIClient | null = null

export function getAIClient(): AIClient {
  if (!cachedClient) {
    if (activeProvider === 'zai') {
      cachedClient = new ZAIClient()
    } else {
      cachedClient = new OpenAICompatibleClient()
    }
  }
  return cachedClient
}

export function resetAIClient(): void {
  cachedClient = null
}
