import { create } from 'zustand'

export type ContentType = 'blog' | 'social' | 'marketing' | 'email' | 'product' | 'video'
export type AppView = 'create' | 'repurpose' | 'batch' | 'templates' | 'library' | 'calendar' | 'analytics'

export interface HistoryItem {
  id: string
  contentType: string
  title: string
  prompt: string
  result: string
  editedResult?: string | null
  tone: string | null
  platform: string | null
  audience: string | null
  language: string | null
  length: string | null
  status: string
  sourceContentId?: string | null
  tags?: string | null
  createdAt: string
  updatedAt: string
  versions?: ContentVersionItem[]
}

export interface ContentVersionItem {
  id: string
  contentId: string
  version: number
  result: string
  createdAt: string
}

export interface TemplateItem {
  id: string
  name: string
  contentType: string
  prompt: string
  tone: string | null
  platform: string | null
  audience: string | null
  language: string
  length: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface ScheduleItem {
  id: string
  contentId: string
  platform: string
  scheduledAt: string
  status: string
  createdAt: string
  content?: HistoryItem
}

export interface AnalyticsItem {
  id: string
  contentId: string
  platform: string
  views: number
  likes: number
  shares: number
  comments: number
  clicks: number
  conversionRate: number
  date: string
  createdAt: string
  content?: HistoryItem
}

interface ContentStore {
  // Navigation
  activeView: AppView
  setActiveView: (view: AppView) => void

  // Content generation tab
  activeTab: ContentType
  setActiveTab: (tab: ContentType) => void

  // Generation
  isGenerating: boolean
  setIsGenerating: (val: boolean) => void
  generatedContent: string
  setGeneratedContent: (content: string) => void

  // History
  history: HistoryItem[]
  setHistory: (items: HistoryItem[]) => void
  addHistoryItem: (item: HistoryItem) => void
  removeHistoryItem: (id: string) => void

  // History filter
  historyFilter: ContentType | 'all'
  setHistoryFilter: (filter: ContentType | 'all') => void

  // Selected history item
  selectedHistoryItem: HistoryItem | null
  setSelectedHistoryItem: (item: HistoryItem | null) => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Templates
  templates: TemplateItem[]
  setTemplates: (items: TemplateItem[]) => void

  // Schedules
  schedules: ScheduleItem[]
  setSchedules: (items: ScheduleItem[]) => void

  // Analytics
  analytics: AnalyticsItem[]
  setAnalytics: (items: AnalyticsItem[]) => void

  // Repurpose source
  repurposeSource: string
  setRepurposeSource: (source: string) => void
}

export const useContentStore = create<ContentStore>((set) => ({
  activeView: 'create',
  setActiveView: (view) => set({ activeView: view }),

  activeTab: 'blog',
  setActiveTab: (tab) => set({ activeTab: tab }),

  isGenerating: false,
  setIsGenerating: (val) => set({ isGenerating: val }),
  generatedContent: '',
  setGeneratedContent: (content) => set({ generatedContent: content }),

  history: [],
  setHistory: (items) => set({ history: items }),
  addHistoryItem: (item) => set((state) => ({ history: [item, ...state.history] })),
  removeHistoryItem: (id) => set((state) => ({ history: state.history.filter((h) => h.id !== id) })),

  historyFilter: 'all',
  setHistoryFilter: (filter) => set({ historyFilter: filter }),

  selectedHistoryItem: null,
  setSelectedHistoryItem: (item) => set({ selectedHistoryItem: item }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  templates: [],
  setTemplates: (items) => set({ templates: items }),

  schedules: [],
  setSchedules: (items) => set({ schedules: items }),

  analytics: [],
  setAnalytics: (items) => set({ analytics: items }),

  repurposeSource: '',
  setRepurposeSource: (source) => set({ repurposeSource: source }),
}))
