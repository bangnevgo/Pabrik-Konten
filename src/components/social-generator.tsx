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

export function SocialGenerator() {
  const { isGenerating, setIsGenerating, generatedContent, setGeneratedContent } = useContentStore()
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('casual')
  const [platform, setPlatform] = useState('instagram')
  const [targetAudience, setTargetAudience] = useState('')
  const [language, setLanguage] = useState('id')
  const [length, setLength] = useState('short')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setGeneratedContent('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: 'social',
          prompt,
          tone,
          platform,
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

  const formData = { prompt, tone, platform, targetAudience, language, length }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-emerald-200/50 dark:border-emerald-900/50">
          <CardHeader>
            <CardTitle className="text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <PresetIcon preset="social" size="md" variant="gradient" /> Postingan Media Sosial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="social-topic">Topik / Deskripsi Postingan</Label>
              <Textarea
                id="social-topic"
                placeholder="Contoh: Promo diskon 50% untuk produk skincare terbaru"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter / X</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="social-audience">Target Audiens</Label>
                <Input
                  id="social-audience"
                  placeholder="Gen Z, milenial"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Sparkles className="size-4" />
              {isGenerating ? 'Sedang Menghasilkan...' : 'Hasilkan Postingan'}
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
          contentType="social"
          formData={formData}
        />
      </motion.div>
    </div>
  )
}
