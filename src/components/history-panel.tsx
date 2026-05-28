'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Eye, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useContentStore, type ContentType, type HistoryItem } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

const contentTypeLabels: Record<string, string> = {
  blog: '📝 Artikel',
  social: '📱 Sosmed',
  marketing: '🎯 Marketing',
  email: '✉️ Email',
  product: '🛍️ Produk',
  video: '🎬 Video',
}

const contentTypeColors: Record<string, string> = {
  blog: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
  social: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  marketing: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  email: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
  product: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
  video: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
}

export function HistoryPanel() {
  const {
    history,
    setHistory,
    removeHistoryItem,
    historyFilter,
    setHistoryFilter,
    setSelectedHistoryItem,
    setActiveTab,
    setGeneratedContent,
  } = useContentStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [historyFilter])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (historyFilter !== 'all') {
        params.set('contentType', historyFilter)
      }
      const res = await fetch(`/api/history?${params.toString()}`)
      const data = await res.json()
      setHistory(data.history || [])
    } catch {
      console.error('Gagal memuat riwayat')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/history?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal menghapus')
      removeHistoryItem(id)
      toast({
        title: 'Berhasil dihapus',
        description: 'Konten telah dihapus dari riwayat.',
      })
    } catch {
      toast({
        title: 'Gagal menghapus',
        description: 'Tidak dapat menghapus konten.',
        variant: 'destructive',
      })
    }
  }

  const handleView = (item: HistoryItem) => {
    setSelectedHistoryItem(item)
    setActiveTab(item.contentType as ContentType)
    setGeneratedContent(item.result)
  }

  const filteredHistory = history

  return (
    <Card className="border-violet-200/50 dark:border-violet-900/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-violet-700 dark:text-violet-400 flex items-center gap-2">
            📋 Riwayat Konten
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <Select value={historyFilter} onValueChange={(v) => setHistoryFilter(v as ContentType | 'all')}>
              <SelectTrigger className="w-[140px]" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="blog">Artikel</SelectItem>
                <SelectItem value="social">Sosmed</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="product">Produk</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm">Belum ada riwayat konten</p>
            <p className="text-xs mt-1">Konten yang disimpan akan muncul di sini</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {filteredHistory.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="group rounded-lg border p-3 hover:border-violet-300 dark:hover:border-violet-700 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 ${contentTypeColors[item.contentType] || ''}`}
                      >
                        {contentTypeLabels[item.contentType] || item.contentType}
                      </Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6"
                          onClick={() => handleView(item)}
                          title="Lihat konten"
                        >
                          <Eye className="size-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 text-destructive hover:text-destructive"
                              title="Hapus konten"
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus konten?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Konten &quot;{item.title}&quot; akan dihapus permanen dan tidak dapat dikembalikan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
                                className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium line-clamp-2 mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.prompt}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
