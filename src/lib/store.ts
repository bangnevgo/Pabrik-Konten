import { create } from 'zustand'

export type ContentType = 'blog' | 'social' | 'marketing' | 'email' | 'product' | 'video'

export interface GenerateParams {
  contentType: ContentType
  prompt: string
  tone: string
  platform?: string
  targetAudience: string
  language: string
  length: string
}

export interface HistoryItem {
  id: string
  contentType: string
  title: string
  prompt: string
  result: string
  tone: string | null
  platform: string | null
  audience: string | null
  language: string | null
  length: string | null
  createdAt: string
}

interface ContentStore {
  // Active tab
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

  // Selected history item for viewing
  selectedHistoryItem: HistoryItem | null
  setSelectedHistoryItem: (item: HistoryItem | null) => void
}

export const useContentStore = create<ContentStore>((set) => ({
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
}))
