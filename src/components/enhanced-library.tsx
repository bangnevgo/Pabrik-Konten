'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import {
  Search, Trash2, Filter, Calendar, Tag, RefreshCw, Copy, Save,
  ChevronDown, Eye, Edit3, Clock, CheckCircle, Send, FileText
} from 'lucide-react'
import { PresetIcon, IconBox } from '@/components/premium-icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useContentStore, type ContentType, type HistoryItem } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

const contentTypeLabels: Record<string, string> = {
  blog: 'Artikel',
  social: 'Sosmed',
  marketing: 'Marketing',
  email: 'Email',
  product: 'Produk',
  video: 'Video',
}

const contentTypeColors: Record<string, string> = {
  blog: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
  social: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  marketing: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  email: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
  product: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
  video: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
}

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  approved: { label: 'Disetujui', color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300' },
  scheduled: { label: 'Dijadwalkan', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' },
  published: { label: 'Dipublikasi', color: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-300' },
}

export function EnhancedLibrary() {
  const {
    history, setHistory, removeHistoryItem, historyFilter, setHistoryFilter,
    searchQuery, setSearchQuery, setActiveView, setActiveTab,
    setGeneratedContent, setRepurposeSource,
  } = useContentStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [editTags, setEditTags] = useState('')
  const [activeVersion, setActiveVersion] = useState(0)

  useEffect(() => {
    loadHistory()
  }, [historyFilter, statusFilter, searchQuery])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (historyFilter !== 'all') params.set('contentType', historyFilter)
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (searchQuery) params.set('search', searchQuery)
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
      await fetch(`/api/history?id=${id}`, { method: 'DELETE' })
      removeHistoryItem(id)
      if (selectedItem?.id === id) { setDetailOpen(false); setSelectedItem(null) }
      toast({ title: 'Berhasil dihapus', description: 'Konten telah dihapus.' })
    } catch {
      toast({ title: 'Gagal menghapus', variant: 'destructive' })
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/history', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        const data = await res.json()
        setHistory(history.map(h => h.id === id ? data.item : h))
        if (selectedItem?.id === id) setSelectedItem(data.item)
        toast({ title: 'Status diperbarui', description: `Status diubah ke "${statusLabels[status]?.label || status}".` })
      }
    } catch {
      toast({ title: 'Gagal', variant: 'destructive' })
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedItem) return
    try {
      const res = await fetch('/api/history', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedItem.id,
          editedResult: editContent,
          tags: editTags,
          newVersion: editContent !== (selectedItem.editedResult || selectedItem.result) ? editContent : undefined,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setHistory(history.map(h => h.id === selectedItem.id ? data.item : h))
        setSelectedItem(data.item)
        setEditMode(false)
        toast({ title: 'Berhasil disimpan', description: 'Perubahan telah disimpan sebagai versi baru.' })
      }
    } catch {
      toast({ title: 'Gagal menyimpan', variant: 'destructive' })
    }
  }

  const openDetail = (item: HistoryItem) => {
    setSelectedItem(item)
    setDetailOpen(true)
    setEditMode(false)
    setEditContent(item.editedResult || item.result)
    setEditTags(item.tags || '')
    setActiveVersion(0)
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: 'Berhasil disalin!' })
    } catch {
      toast({ title: 'Gagal menyalin', variant: 'destructive' })
    }
  }

  const handleRepurpose = (item: HistoryItem) => {
    setRepurposeSource(item.result)
    setActiveView('repurpose')
    setDetailOpen(false)
  }

  const displayContent = selectedItem
    ? (editMode ? editContent : (activeVersion > 0 && selectedItem.versions?.[activeVersion - 1]
        ? selectedItem.versions[activeVersion - 1].result
        : (selectedItem.editedResult || selectedItem.result)))
    : ''

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-violet-700 dark:text-violet-400 flex items-center gap-2">
              <PresetIcon preset="library" size="md" variant="gradient" /> Perpustakaan Konten
            </h2>
            <p className="text-sm text-muted-foreground">Kelola semua konten yang telah dibuat</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadHistory} className="gap-1.5">
            <RefreshCw className="size-3.5" /> Muat Ulang
          </Button>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <Card className="border-violet-200/50 dark:border-violet-900/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Cari judul, topik, atau tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={historyFilter} onValueChange={(v) => setHistoryFilter(v as ContentType | 'all')}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="blog">Artikel</SelectItem>
                    <SelectItem value="social">Sosmed</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="product">Produk</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="scheduled">Dijadwalkan</SelectItem>
                    <SelectItem value="published">Dipublikasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-dashed border-2 border-muted-foreground/25">
            <CardContent className="p-10 flex flex-col items-center justify-center text-center">
              <PresetIcon preset="inbox" size="lg" variant="light" className="mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Belum Ada Konten</h3>
              <p className="text-sm text-muted-foreground">Konten yang disimpan akan muncul di sini</p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="border-violet-200/50 dark:border-violet-900/50 hover:border-violet-300 dark:hover:border-violet-700 transition-colors cursor-pointer h-full"
                  onClick={() => openDetail(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <PresetIcon preset={item.contentType as any} size="sm" variant="light" />
                        <Badge variant="secondary" className={`text-[10px] ${contentTypeColors[item.contentType] || ''}`}>
                          {contentTypeLabels[item.contentType] || item.contentType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className={`text-[10px] ${statusLabels[item.status]?.color || ''}`}>
                          {statusLabels[item.status]?.label || item.status}
                        </Badge>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium line-clamp-2 mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.prompt}</p>
                    {item.tags && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.tags.split(',').slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400">
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-violet-700 dark:text-violet-400">{selectedItem?.title}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 mt-4">
              {/* Meta info */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className={contentTypeColors[selectedItem.contentType] || ''}>
                  {contentTypeLabels[selectedItem.contentType] || selectedItem.contentType}
                </Badge>
                <Badge variant="secondary" className={statusLabels[selectedItem.status]?.color || ''}>
                  {statusLabels[selectedItem.status]?.label || selectedItem.status}
                </Badge>
                {selectedItem.tone && (
                  <Badge variant="outline" className="text-xs">Gaya: {selectedItem.tone}</Badge>
                )}
                {selectedItem.platform && (
                  <Badge variant="outline" className="text-xs">Platform: {selectedItem.platform}</Badge>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCopy(displayContent)} className="gap-1.5">
                  <Copy className="size-3.5" /> Salin
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)} className="gap-1.5">
                  <Edit3 className="size-3.5" /> {editMode ? 'Lihat Mode' : 'Edit'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleRepurpose(selectedItem)} className="gap-1.5">
                  <RefreshCw className="size-3.5" /> Repurpose
                </Button>
                <Select onValueChange={(v) => handleStatusChange(selectedItem.id, v)}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="Ubah Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="scheduled">Dijadwalkan</SelectItem>
                    <SelectItem value="published">Dipublikasi</SelectItem>
                  </SelectContent>
                </Select>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive">
                      <Trash2 className="size-3.5" /> Hapus
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus konten?</AlertDialogTitle>
                      <AlertDialogDescription>Konten ini akan dihapus permanen.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => { handleDelete(selectedItem.id); setDetailOpen(false) }} className="bg-destructive text-white">
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Content */}
              {editMode ? (
                <div className="space-y-3">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <div className="space-y-2">
                    <Label>Tag (pisahkan dengan koma)</Label>
                    <Input
                      placeholder="contoh: seo, teknologi, tutorial"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveEdit} className="bg-violet-600 hover:bg-violet-700 text-white">
                    <Save className="size-4 mr-1.5" /> Simpan sebagai Versi Baru
                  </Button>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-violet-700 dark:prose-headings:text-violet-400 border rounded-lg p-4">
                  <ReactMarkdown>{displayContent}</ReactMarkdown>
                </div>
              )}

              {/* Version History */}
              {selectedItem.versions && selectedItem.versions.length > 0 && !editMode && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Clock className="size-4" /> Riwayat Versi
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={activeVersion === 0 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveVersion(0)}
                      className={activeVersion === 0 ? 'bg-violet-600 hover:bg-violet-700 text-white' : ''}
                    >
                      Versi Terbaru
                    </Button>
                    {selectedItem.versions.map((v, idx) => (
                      <Button
                        key={v.id}
                        variant={activeVersion === idx + 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveVersion(idx + 1)}
                        className={activeVersion === idx + 1 ? 'bg-violet-600 hover:bg-violet-700 text-white' : ''}
                      >
                        v{v.version} - {new Date(v.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
