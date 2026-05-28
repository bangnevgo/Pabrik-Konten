'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { PresetIcon } from '@/components/premium-icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OutputDisplay } from '@/components/output-display'
import { useContentStore } from '@/lib/store'

export function EmailGenerator() {
  const { isGenerating, setIsGenerating, generatedContent, setGeneratedContent } = useContentStore()
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('professional')
  const [targetAudience, setTargetAudience] = useState('')
  const [language, setLanguage] = useState('id')
  const [length, setLength] = useState('medium')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setGeneratedContent('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: 'email',
          prompt,
          tone,
          targetAudience,
          language,
          length,
        }),
      })
      const data = await res.json()
      if (data.content) {
        setGeneratedContent(data.content)
      }
    } catch {
      setGeneratedContent('')
    } finally {
      setIsGenerating(false)
    }
  }

  const formData = { prompt, tone, targetAudience, language, length }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-rose-200/50 dark:border-orange-900/50">
          <CardHeader>
            <CardTitle className="text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <PresetIcon preset="email" size="md" variant="gradient" /> Email Marketing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-topic">Tujuan / Topik Email</Label>
              <Textarea
                id="email-topic"
                placeholder="Contoh: Newsletter bulanan tentang tips produktivitas kerja"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email-audience">Target Penerima</Label>
                <Input
                  id="email-audience"
                  placeholder="Contoh: pelanggan existing, prospek B2B"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Panjang Email</Label>
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
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white gap-2"
            >
              <Sparkles className="size-4" />
              {isGenerating ? 'Sedang Menghasilkan...' : 'Hasilkan Email'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <OutputDisplay
          content={generatedContent}
          isGenerating={isGenerating}
          onRegenerate={handleGenerate}
          contentType="email"
          formData={formData}
        />
      </motion.div>
    </div>
  )
}
