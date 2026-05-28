export interface AIProviderConfig {
  id: string
  name: string
  baseUrl: string
  apiKey: string
  model: string
}

const PROVIDER_DEFAULTS: Record<string, { baseUrl: string; model: string }> = {
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'google/gemini-2.0-flash-001',
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
  },
  nvidia: {
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    model: 'meta/llama-3.1-70b-instruct',
  },
  opencode: {
    baseUrl: 'https://opencode.ai/api/v1',
    model: 'gpt-4o-mini',
  },
  zai: {
    baseUrl: '', // uses z-ai-web-dev-sdk
    model: 'default',
  },
}

const activeProvider = (process.env.AI_PROVIDER || 'openrouter').toLowerCase()

function resolveConfig(): AIProviderConfig {
  const defaults = PROVIDER_DEFAULTS[activeProvider] || PROVIDER_DEFAULTS.openrouter
  const apiKey = process.env.AI_API_KEY || ''

  return {
    id: activeProvider,
    name: activeProvider,
    baseUrl: process.env.AI_BASE_URL || defaults.baseUrl,
    apiKey,
    model: process.env.AI_MODEL || defaults.model,
  }
}

let cachedConfig: AIProviderConfig | null = null

export function getAIConfig(): AIProviderConfig {
  if (!cachedConfig) {
    cachedConfig = resolveConfig()
  }
  return cachedConfig
}

export function resetAIConfig(): void {
  cachedConfig = null
}

export { activeProvider }
