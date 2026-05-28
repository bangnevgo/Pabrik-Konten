'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { RefreshCw, Copy, Save, ArrowRight, Sparkles } from 'lucide-react'
import { PresetIcon, IconBox, PremiumNavIcon } from '@/components/premium-icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useContentStore, type HistoryItem } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

const formatOptions = [
  { id: 'instagram', label: 'Instagram Caption', preset: 'instagram', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300' },
  { id: 'twitter', label: 'Twitter Thread', preset: 'twitter', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300' },
  { id: 'blog', label: 'Artikel Blog', preset: 'blog', color: 'bg-rose-100 text-rose-800 dark:bg-orange-900/50 dark:text-orange-300' },
  { id: 'email', label: 'Email Newsletter', preset: 'email', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' },
  { id: 'tiktok', label: 'Skrip TikTok', preset: 'video', color: 'bg-rose-100 text-rose-800 dark:bg-orange-900/50 dark:text-orange-300' },
  { id: 'linkedin', label: 'LinkedIn Post', preset: 'linkedin', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300' },
  { id: 'youtube', label: 'Deskripsi YouTube', preset: 'youtube', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300' },
]

export function RepurposeEngine() {
  const { isGenerating, setIsGenerating, history, repurposeSource, setRepurposeSource } = useContentStore()
  const { toast } = useToast()
  const [sourceContent, setSourceContent] = useState(repurposeSource || '')
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['social', 'email', 'video'])
  const [tone, setTone] = useState('')
  const [language, setLanguage] = useState('id')
  const [generatedContent, setGeneratedContent] = useState('')
  const [parsedFormats, setParsedFormats] = useState<{ name: string; content: string }[]>([])
  const [selectedFromLibrary, setSelectedFromLibrary] = useState('')

  useEffect(() => {
    if (repurposeSource) {
      setSourceContent(repurposeSource)
    }
  }, [repurposeSource])

  const handleToggleFormat = (formatId: string) => {
    setSelectedFormats(prev =>
      prev.includes(formatId)
        ? prev.filter(f => f !== formatId)
        : [...prev, formatId]
    )
  }

  const handleSelectFromLibrary = (id: string) => {
    const item = history.find(h => h.id === id)
    if (item) {
      setSourceContent(item.result)
      setSelectedFromLibrary(id)
    }
  }

  const handleGenerate = async () => {
    if (!sourceContent.trim() || selectedFormats.length === 0) return
    setIsGenerating(true)
    setGeneratedContent('')
    setParsedFormats([])
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'repurpose',
          sourceContent,
          targetFormats: selectedFormats,
          tone: tone || undefined,
          language,
        }),
      })
      const data = await res.json()
      if (data.content) {
        setGeneratedContent(data.content)
        // Parse the content into formats
        const sections = data.content.split('---FORMAT---')
        const formats: { name: string; content: string }[] = []
        sections.forEach(section => {
          const lines = section.trim().split('\n')
          const nameMatch = lines[0]?.match(/^##\s*\[?(.+?)\]?$/)
          if (nameMatch) {
            formats.push({ name: nameMatch[1].trim(), content: lines.slice(1).join('\n').trim() })
          } else if (section.trim()) {
            formats.push({ name: `Format ${formats.length + 1}`, content: section.trim() })
          }
        })
        if (formats.length === 0) {
          formats.push({ name: 'Konten Hasil Repurpose', content: data.content })
        }
        setParsedFormats(formats)
      }
    } catch {
      toast({ title: 'Gagal', description: 'Terjadi kesalahan saat repurpose konten.', variant: 'destructive' })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: 'Berhasil disalin!', description: 'Konten telah disalin ke clipboard.' })
    } catch {
      toast({ title: 'Gagal menyalin', variant: 'destructive' })
    }
  }

  const handleSaveFormat = async (formatName: string, formatContent: string) => {
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: 'social',
          title: `[Repurpose] ${formatName}`,
          prompt: sourceContent.slice(0, 200),
          result: formatContent,
          tone: tone || null,
          language,
          status: 'draft',
          sourceContentId: selectedFromLibrary || null,
        }),
      })
      if (res.ok) {
        toast({ title: 'Berhasil disimpan!', description: 'Konten telah disimpan ke perpustakaan.' })
      }
    } catch {
      toast({ title: 'Gagal menyimpan', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="border-rose-200/50 dark:border-orange-900/50">
          <CardHeader>
            <CardTitle className="text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <PresetIcon preset="repurpose" size="md" variant="gradient" /> Mesin Repurpose Konten
            </CardTitle>
            <p className="text-sm text-muted-foreground">Ubah satu konten menjadi berbagai format untuk platform yang berbeda</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visual Flow */}
            <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="flex-1 max-w-[160px] p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-center border border-rose-200 dark:border-orange-800">
                <p className="text-xs font-medium text-rose-700 dark:text-rose-400">Konten Sumber</p>
              </div>
              <ArrowRight className="size-5 text-rose-500 shrink-0" />
              <div className="flex-1 flex flex-wrap gap-1.5 justify-center">
                {selectedFormats.map(f => {
                  const opt = formatOptions.find(o => o.id === f)
                  return opt ? (
                    <Badge key={f} variant="secondary" className={`text-[10px] ${opt.color}`}>
                      {opt.label.split(' ').pop()}
                    </Badge>
                  ) : null
                })}
              </div>
            </div>

            {/* Source Content */}
            <div className="space-y-2">
              <Label>Konten Sumber</Label>
              {history.length > 0 && (
                <Select value={selectedFromLibrary} onValueChange={handleSelectFromLibrary}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih dari perpustakaan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {history.slice(0, 20).map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title} ({item.contentType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Textarea
                placeholder="Tempel konten yang ingin di-repurpose di sini..."
                value={sourceContent}
                onChange={(e) => { setSourceContent(e.target.value); setSelectedFromLibrary('') }}
                rows={6}
              />
            </div>

            {/* Target Formats */}
            <div className="space-y-2">
              <Label>Format Target</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {formatOptions.map((format) => (
                  <label
                    key={format.id}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      selectedFormats.includes(format.id)
                        ? 'border-rose-400 bg-orange-50 dark:bg-orange-900/30 dark:border-orange-700'
                        : 'border-muted hover:border-rose-200 dark:hover:border-orange-800'
                    }`}
                  >
                    <Checkbox
                      checked={selectedFormats.includes(format.id)}
                      onCheckedChange={() => handleToggleFormat(format.id)}
                    />
                    <PremiumNavIcon preset={format.preset as any} active={selectedFormats.includes(format.id)} size="xs" />
                    <span className="text-xs font-medium">{format.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gaya Bahasa (Opsional)</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Otomatis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profesional</SelectItem>
                    <SelectItem value="casual">Santai</SelectItem>
                    <SelectItem value="persuasive">Persuasif</SelectItem>
                    <SelectItem value="informative">Informatif</SelectItem>
                    <SelectItem value="humorous">Humoris</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bahasa</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !sourceContent.trim() || selectedFormats.length === 0}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white gap-2"
            >
              <RefreshCw className={`size-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Sedang Memproses...' : 'Repurpose Sekarang'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      {isGenerating && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border-rose-200/50 dark:border-orange-900/50">
              <CardContent className="p-6">
                <Skeleton className="h-5 w-40 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {!isGenerating && parsedFormats.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="text-lg font-semibold text-rose-700 dark:text-rose-400">Hasil Repurpose</h3>
          {parsedFormats.map((format, idx) => (
            <Card key={idx} className="border-rose-200/50 dark:border-orange-900/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-rose-700 dark:text-rose-400">{format.name}</h4>
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(format.content)} className="gap-1.5">
                      <Copy className="size-3.5" /> Salin
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSaveFormat(format.name, format.content)} className="gap-1.5">
                      <Save className="size-3.5" /> Simpan
                    </Button>
                  </div>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-orange-700 dark:prose-headings:text-orange-400">
                  <ReactMarkdown>{format.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {!isGenerating && generatedContent && parsedFormats.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-rose-200/50 dark:border-orange-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-rose-700 dark:text-rose-400">Hasil Repurpose</h4>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(generatedContent)} className="gap-1.5">
                    <Copy className="size-3.5" /> Salin Semua
                  </Button>
                </div>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-orange-700 dark:prose-headings:text-orange-400">
                <ReactMarkdown>{generatedContent}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
