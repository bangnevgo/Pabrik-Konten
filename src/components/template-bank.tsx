'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Copy } from 'lucide-react'
import { PresetIcon, PremiumNavIcon } from '@/components/premium-icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
  DialogTrigger,
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
import { useContentStore, type ContentType, type TemplateItem } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

const contentTypeLabels: Record<string, { label: string; preset: string; color: string }> = {
  blog: { label: 'Artikel', preset: 'blog', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' },
  social: { label: 'Sosmed', preset: 'social', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300' },
  marketing: { label: 'Marketing', preset: 'marketing', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' },
  email: { label: 'Email', preset: 'email', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300' },
  product: { label: 'Produk', preset: 'product', color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300' },
  video: { label: 'Video', preset: 'video', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300' },
}

export function TemplateBank() {
  const { templates, setTemplates, setActiveView, setActiveTab } = useContentStore()
  const { toast } = useToast()
  const [filter, setFilter] = useState<ContentType | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formState, setFormState] = useState({
    name: '',
    contentType: 'blog' as ContentType,
    prompt: '',
    tone: '',
    platform: '',
    audience: '',
    language: 'id',
    length: '',
  })

  const loadTemplates = async () => {
    try {
      const res = await fetch('/api/templates')
      const data = await res.json()
      setTemplates(data.templates || [])
    } catch {
      console.error('Gagal memuat template')
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  const handleCreateTemplate = async () => {
    if (!formState.name || !formState.prompt) return
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          tone: formState.tone || null,
          platform: formState.platform || null,
          audience: formState.audience || null,
          length: formState.length || null,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setTemplates([data.template, ...templates])
        setDialogOpen(false)
        setFormState({ name: '', contentType: 'blog', prompt: '', tone: '', platform: '', audience: '', language: 'id', length: '' })
        toast({ title: 'Template dibuat!', description: 'Template baru berhasil disimpan.' })
      }
    } catch {
      toast({ title: 'Gagal', description: 'Tidak dapat membuat template.', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/templates?id=${id}`, { method: 'DELETE' })
      setTemplates(templates.filter(t => t.id !== id))
      toast({ title: 'Dihapus', description: 'Template telah dihapus.' })
    } catch {
      toast({ title: 'Gagal menghapus', variant: 'destructive' })
    }
  }

  const handleUseTemplate = (template: TemplateItem) => {
    // Navigate to create view and set the active tab
    setActiveTab(template.contentType as ContentType)
    setActiveView('create')
    toast({ title: 'Template dimuat', description: `Menggunakan template "${template.name}". Silakan isi form di halaman Buat.` })
  }

  const filteredTemplates = filter === 'all' ? templates : templates.filter(t => t.contentType === filter)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <PresetIcon preset="templates" size="md" variant="gradient" /> Bank Template
            </h2>
            <p className="text-sm text-muted-foreground">Simpan dan gunakan template prompt untuk membuat konten lebih cepat</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Plus className="size-4" /> Buat Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Buat Template Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Nama Template</Label>
                  <Input
                    placeholder="Contoh: Artikel SEO Teknologi"
                    value={formState.name}
                    onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipe Konten</Label>
                    <Select value={formState.contentType} onValueChange={(v) => setFormState(s => ({ ...s, contentType: v as ContentType }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Artikel Blog</SelectItem>
                        <SelectItem value="social">Media Sosial</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="product">Produk</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Gaya Bahasa</Label>
                    <Select value={formState.tone} onValueChange={(v) => setFormState(s => ({ ...s, tone: v }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih..." />
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
                </div>
                <div className="space-y-2">
                  <Label>Prompt Template</Label>
                  <Textarea
                    placeholder="Tulis prompt template di sini... Gunakan {{topik}}, {{audiens}}, {{platform}} sebagai placeholder variabel."
                    value={formState.prompt}
                    onChange={(e) => setFormState(s => ({ ...s, prompt: e.target.value }))}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">Variabel: {'{{topik}}'}, {'{{audiens}}'}, {'{{platform}}'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Input
                      placeholder="Instagram, YouTube..."
                      value={formState.platform}
                      onChange={(e) => setFormState(s => ({ ...s, platform: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Audiens</Label>
                    <Input
                      placeholder="Umum, Gen Z..."
                      value={formState.audience}
                      onChange={(e) => setFormState(s => ({ ...s, audience: e.target.value }))}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateTemplate}
                  disabled={!formState.name || !formState.prompt}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Simpan Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
          >
            Semua
          </Button>
          {Object.entries(contentTypeLabels).map(([key, info]) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(key as ContentType)}
              className={filter === key ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
            >
              {info.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Template Grid */}
      {filteredTemplates.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-dashed border-2 border-muted-foreground/25">
            <CardContent className="p-10 flex flex-col items-center justify-center text-center">
              <PresetIcon preset="templates" size="lg" variant="light" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Belum Ada Template</h3>
              <p className="text-sm text-muted-foreground mb-4">Buat template pertamamu untuk mempercepat pembuatan konten</p>
              <Button onClick={() => setDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Plus className="size-4" /> Buat Template Pertama
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredTemplates.map((template) => {
              const info = contentTypeLabels[template.contentType]
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-emerald-200/50 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors h-full flex flex-col">
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <PremiumNavIcon preset={info?.preset as any} active size="xs" />
                          <Badge variant="secondary" className={`text-[10px] ${info?.color || ''}`}>
                            {info?.label || template.contentType}
                          </Badge>
                          {template.isDefault && (
                            <Badge variant="secondary" className="text-[10px] bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">
                              Default
                            </Badge>
                          )}
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive">
                              <Trash2 className="size-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus template?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Template &quot;{template.name}&quot; akan dihapus permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(template.id)} className="bg-destructive text-white">
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <h4 className="font-medium text-sm mb-2">{template.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-3 flex-1">{template.prompt}</p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1.5 text-xs"
                          onClick={() => handleUseTemplate(template)}
                        >
                          <Copy className="size-3" /> Gunakan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
