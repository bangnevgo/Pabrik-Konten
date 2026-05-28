'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Copy, Save, RefreshCw, Check, Edit3, Tag, RefreshCw as RepurposeIcon, Calendar, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
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
import { useContentStore, type ContentType } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

interface OutputDisplayProps {
  content: string
  isGenerating: boolean
  onRegenerate: () => void
  contentType: ContentType
  formData: {
    prompt: string
    tone: string
    platform?: string
    targetAudience: string
    language: string
    length: string
  }
}

export function OutputDisplay({
  content,
  isGenerating,
  onRegenerate,
  contentType,
  formData,
}: OutputDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [tags, setTags] = useState('')
  const [status, setStatus] = useState('draft')
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [schedulePlatform, setSchedulePlatform] = useState('instagram')
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [scheduleDate, setScheduleDate] = useState('')
  const [savedContentId, setSavedContentId] = useState<string | null>(null)
  const { addHistoryItem, setActiveView, setRepurposeSource } = useContentStore()
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editMode ? editContent : content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({ title: 'Berhasil disalin!', description: 'Konten telah disalin ke clipboard.' })
    } catch {
      toast({ title: 'Gagal menyalin', variant: 'destructive' })
    }
  }

  const handleSave = async () => {
    try {
      const title = content.split('\n')[0]?.replace(/^#+\s*/, '') || formData.prompt.slice(0, 50)
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          title,
          prompt: formData.prompt,
          result: content,
          tone: formData.tone,
          platform: formData.platform,
          audience: formData.targetAudience,
          language: formData.language,
          length: formData.length,
          status,
          tags: tags || null,
        }),
      })

      if (!res.ok) throw new Error('Gagal menyimpan')

      const data = await res.json()
      addHistoryItem(data.item)
      setSavedContentId(data.item.id)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast({ title: 'Berhasil disimpan!', description: 'Konten telah disimpan ke perpustakaan.' })
    } catch {
      toast({ title: 'Gagal menyimpan', variant: 'destructive' })
    }
  }

  const handleSaveEdit = async () => {
    if (!savedContentId) {
      toast({ title: 'Simpan dulu', description: 'Simpan konten terlebih dahulu sebelum mengedit.' })
      return
    }
    try {
      const res = await fetch('/api/history', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: savedContentId,
          editedResult: editContent,
          tags,
          newVersion: editContent,
        }),
      })
      if (res.ok) {
        setEditMode(false)
        toast({ title: 'Versi baru disimpan!', description: 'Perubahan disimpan sebagai versi baru.' })
      }
    } catch {
      toast({ title: 'Gagal menyimpan', variant: 'destructive' })
    }
  }

  const handleRepurpose = () => {
    setRepurposeSource(content)
    setActiveView('repurpose')
  }

  const handleSchedule = async () => {
    if (!savedContentId || !scheduleDate) {
      toast({ title: 'Simpan dulu', description: 'Simpan konten terlebih dahulu sebelum menjadwalkan.' })
      return
    }
    try {
      const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`)
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: savedContentId,
          platform: schedulePlatform,
          scheduledAt: scheduledAt.toISOString(),
        }),
      })
      if (res.ok) {
        setScheduleDialogOpen(false)
        toast({ title: 'Dijadwalkan!', description: 'Konten berhasil dijadwalkan.' })
      }
    } catch {
      toast({ title: 'Gagal menjadwalkan', variant: 'destructive' })
    }
  }

  if (isGenerating) {
    return (
      <Card className="h-full border-emerald-200 dark:border-emerald-900">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Sedang menghasilkan konten...
            </span>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!content) {
    return (
      <Card className="h-full border-dashed border-2 border-muted-foreground/25">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
          <div className="text-5xl mb-4">✨</div>
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Hasil Konten Akan Muncul Di Sini
          </h3>
          <p className="text-sm text-muted-foreground">
            Isi form di sebelah kiri dan klik &quot;Hasilkan Konten&quot; untuk memulai
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-emerald-200 dark:border-emerald-900">
        <CardContent className="p-6">
          {/* Edit / Preview Toggle */}
          {editMode ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={14}
                className="font-mono text-sm"
              />
              <Button onClick={handleSaveEdit} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Save className="size-3.5 mr-1.5" /> Simpan sebagai Versi Baru
              </Button>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-emerald-700 dark:prose-headings:text-emerald-400 prose-a:text-emerald-600 dark:prose-a:text-emerald-400">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
              {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              {copied ? 'Tersalin!' : 'Salin'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5">
              {saved ? <Check className="size-3.5 text-emerald-500" /> : <Save className="size-3.5" />}
              {saved ? 'Tersimpan!' : 'Simpan'}
            </Button>
            <Button variant="outline" size="sm" onClick={onRegenerate} className="gap-1.5">
              <RefreshCw className="size-3.5" /> Hasilkan Ulang
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setEditMode(!editMode); if (!editMode) setEditContent(content) }}
              className="gap-1.5"
            >
              <Edit3 className="size-3.5" /> {editMode ? 'Lihat Mode' : 'Edit'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRepurpose} className="gap-1.5">
              <RepurposeIcon className="size-3.5" /> Repurpose
            </Button>
            <Button variant="outline" size="sm" onClick={() => setScheduleDialogOpen(true)} className="gap-1.5">
              <Calendar className="size-3.5" /> Jadwalkan
            </Button>
          </div>

          {/* Tags & Status Row (shown after save) */}
          {saved && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t space-y-3"
            >
              <div className="flex flex-wrap gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="approved">Disetujui</SelectItem>
                      <SelectItem value="scheduled">Dijadwalkan</SelectItem>
                      <SelectItem value="published">Dipublikasi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 flex-1 min-w-[200px]">
                  <Label className="text-xs">Tag (pisahkan dengan koma)</Label>
                  <Input
                    placeholder="seo, teknologi, tutorial"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Jadwalkan Konten</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={schedulePlatform} onValueChange={setSchedulePlatform}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter / X</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Waktu</Label>
              <Select value={scheduleTime} onValueChange={setScheduleTime}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map(t => (
                    <SelectItem key={t} value={t}>{t} WIB</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSchedule}
              disabled={!savedContentId || !scheduleDate}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Send className="size-4" /> Jadwalkan
            </Button>
            {!savedContentId && (
              <p className="text-xs text-muted-foreground text-center">Simpan konten terlebih dahulu sebelum menjadwalkan</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
