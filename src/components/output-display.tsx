'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Copy, Save, RefreshCw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
  const { addHistoryItem } = useContentStore()
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: 'Berhasil disalin!',
        description: 'Konten telah disalin ke clipboard.',
      })
    } catch {
      toast({
        title: 'Gagal menyalin',
        description: 'Tidak dapat menyalin ke clipboard.',
        variant: 'destructive',
      })
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
        }),
      })

      if (!res.ok) throw new Error('Gagal menyimpan')

      const data = await res.json()
      addHistoryItem(data.item)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      toast({
        title: 'Berhasil disimpan!',
        description: 'Konten telah disimpan ke riwayat.',
      })
    } catch {
      toast({
        title: 'Gagal menyimpan',
        description: 'Tidak dapat menyimpan ke riwayat.',
        variant: 'destructive',
      })
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
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-emerald-700 dark:prose-headings:text-emerald-400 prose-a:text-emerald-600 dark:prose-a:text-emerald-400">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          <div className="flex items-center gap-2 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? 'Tersalin!' : 'Salin'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="gap-1.5"
            >
              {saved ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Save className="size-3.5" />
              )}
              {saved ? 'Tersimpan!' : 'Simpan'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              className="gap-1.5"
            >
              <RefreshCw className="size-3.5" />
              Hasilkan Ulang
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
