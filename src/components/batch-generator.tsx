'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Sparkles, Copy, Save, Check, FileText, Smartphone, Megaphone, Mail, ShoppingBag, Video } from 'lucide-react'
import { PresetIcon } from '@/components/premium-icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useContentStore, type ContentType } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

const contentTypes: { id: ContentType; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'blog', label: 'Artikel Blog', icon: <FileText className="size-4" />, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' },
  { id: 'social', label: 'Media Sosial', icon: <Smartphone className="size-4" />, color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300' },
  { id: 'marketing', label: 'Copy Marketing', icon: <Megaphone className="size-4" />, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' },
  { id: 'email', label: 'Email Marketing', icon: <Mail className="size-4" />, color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300' },
  { id: 'product', label: 'Deskripsi Produk', icon: <ShoppingBag className="size-4" />, color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300' },
  { id: 'video', label: 'Skrip Video', icon: <Video className="size-4" />, color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300' },
]

export function BatchGenerator() {
  const { isGenerating, setIsGenerating } = useContentStore()
  const { toast } = useToast()
  const [prompt, setPrompt] = useState('')
  const [selectedFormats, setSelectedFormats] = useState<ContentType[]>(['blog', 'social', 'email'])
  const [tone, setTone] = useState('professional')
  const [targetAudience, setTargetAudience] = useState('')
  const [language, setLanguage] = useState('id')
  const [length, setLength] = useState('medium')
  const [results, setResults] = useState<Record<string, string>>({})
  const [generatingFormats, setGeneratingFormats] = useState<Set<string>>(new Set())

  const handleToggleFormat = (formatId: ContentType) => {
    setSelectedFormats(prev =>
      prev.includes(formatId)
        ? prev.filter(f => f !== formatId)
        : [...prev, formatId]
    )
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || selectedFormats.length === 0) return
    setIsGenerating(true)
    setResults({})
    setGeneratingFormats(new Set(selectedFormats))
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'batch',
          prompt,
          targetFormats: selectedFormats,
          tone,
          targetAudience,
          language,
          length,
        }),
      })
      const data = await res.json()
      if (data.results) {
        setResults(data.results)
      }
    } catch {
      toast({ title: 'Gagal', description: 'Terjadi kesalahan saat batch generation.', variant: 'destructive' })
    } finally {
      setIsGenerating(false)
      setGeneratingFormats(new Set())
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

  const handleSave = async (formatName: string, content: string) => {
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: formatName,
          title: `[Batch] ${prompt.slice(0, 50)}`,
          prompt,
          result: content,
          tone,
          targetAudience,
          language,
          length,
          status: 'draft',
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
        <Card className="border-emerald-200/50 dark:border-emerald-900/50">
          <CardHeader>
            <CardTitle className="text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <PresetIcon preset="batch" size="md" variant="gradient" /> Generator Batch
            </CardTitle>
            <p className="text-sm text-muted-foreground">Buat beberapa jenis konten sekaligus dari satu brief</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Brief */}
            <div className="space-y-2">
              <Label>Brief / Topik</Label>
              <Textarea
                placeholder="Contoh: Peluncuran aplikasi manajemen keuangan baru dengan fitur AI yang membantu mengatur budget bulanan secara otomatis"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
              <Label>Format Konten</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {contentTypes.map((ct) => (
                  <label
                    key={ct.id}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedFormats.includes(ct.id)
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-700'
                        : 'border-muted hover:border-emerald-200 dark:hover:border-emerald-800'
                    }`}
                  >
                    <Checkbox
                      checked={selectedFormats.includes(ct.id)}
                      onCheckedChange={() => handleToggleFormat(ct.id)}
                    />
                    {ct.icon}
                    <span className="text-xs font-medium">{ct.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Common Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Gaya Bahasa</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
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
                <Label>Target Audiens</Label>
                <Input
                  placeholder="Umum, profesional muda..."
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Bahasa</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Indonesia</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Panjang</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Pendek</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="long">Panjang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || selectedFormats.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Sparkles className="size-4" />
              {isGenerating ? 'Sedang Menghasilkan...' : `Hasilkan Semua (${selectedFormats.length} Format)`}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Grid */}
      {(isGenerating || Object.keys(results).length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {selectedFormats.map((format, idx) => {
            const typeInfo = contentTypes.find(c => c.id === format)
            const content = results[format]
            const isThisGenerating = generatingFormats.has(format)

            return (
              <motion.div
                key={format}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Card className="border-emerald-200/50 dark:border-emerald-900/50 h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {typeInfo?.icon}
                        <span className="font-medium text-sm text-emerald-700 dark:text-emerald-400">
                          {typeInfo?.label}
                        </span>
                      </div>
                      {content && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="size-7" onClick={() => handleCopy(content)}>
                            <Copy className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-7" onClick={() => handleSave(format, content)}>
                            <Save className="size-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {isThisGenerating ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    ) : content ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-emerald-700 dark:prose-headings:text-emerald-400 max-h-80 overflow-y-auto">
                        <ReactMarkdown>{content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        Menunggu hasil...
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
