'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Eye, Heart, Share2, MessageCircle, MousePointerClick, TrendingUp,
  Database, BarChart3, PieChart as PieChartIcon, RefreshCw, Plus
} from 'lucide-react'
import { PresetIcon, PremiumStatIcon } from '@/components/premium-icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
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
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useContentStore, type AnalyticsItem } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

const COLORS = ['#10b981', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

const contentTypeLabels: Record<string, string> = {
  blog: 'Artikel',
  social: 'Sosmed',
  marketing: 'Marketing',
  email: 'Email',
  product: 'Produk',
  video: 'Video',
}

const platformLabels: Record<string, string> = {
  instagram: 'Instagram',
  twitter: 'Twitter/X',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}

interface AnalyticsSummary {
  totalViews: number
  totalLikes: number
  totalShares: number
  totalComments: number
  totalClicks: number
  avgConversion: number
}

interface ByTypeData {
  views: number
  likes: number
  shares: number
  count: number
}

export function AnalyticsDashboard() {
  const { history, setHistory } = useContentStore()
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<AnalyticsItem[]>([])
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [byType, setByType] = useState<Record<string, ByTypeData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    contentId: '',
    platform: 'instagram',
    views: '',
    likes: '',
    shares: '',
    comments: '',
    clicks: '',
    conversionRate: '',
  })

  useEffect(() => {
    loadAnalytics()
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/history')
      const data = await res.json()
      setHistory(data.history || [])
    } catch {
      console.error('Gagal memuat riwayat')
    }
  }

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/analytics')
      const data = await res.json()
      setAnalytics(data.analytics || [])
      setSummary(data.summary || null)
      setByType(data.byType || {})
    } catch {
      console.error('Gagal memuat analytics')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedDemo = async () => {
    try {
      const res = await fetch('/api/seed-analytics', { method: 'POST' })
      const data = await res.json()
      toast({ title: 'Data demo dibuat!', description: `${data.count} data analytics demo telah dibuat.` })
      loadAnalytics()
    } catch {
      toast({ title: 'Gagal', description: 'Tidak dapat membuat data demo.', variant: 'destructive' })
    }
  }

  const handleAddAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: formData.contentId,
          platform: formData.platform,
          views: parseInt(formData.views) || 0,
          likes: parseInt(formData.likes) || 0,
          shares: parseInt(formData.shares) || 0,
          comments: parseInt(formData.comments) || 0,
          clicks: parseInt(formData.clicks) || 0,
          conversionRate: parseFloat(formData.conversionRate) || 0,
        }),
      })
      if (res.ok) {
        setAddDialogOpen(false)
        toast({ title: 'Data ditambahkan!' })
        loadAnalytics()
      }
    } catch {
      toast({ title: 'Gagal', variant: 'destructive' })
    }
  }

  // Prepare chart data
  const barChartData = Object.entries(byType).map(([type, data]) => ({
    name: contentTypeLabels[type] || type,
    views: data.views,
    likes: data.likes,
    shares: data.shares,
  }))

  // Platform distribution for pie chart
  const platformCounts: Record<string, number> = {}
  analytics.forEach(a => {
    platformCounts[a.platform] = (platformCounts[a.platform] || 0) + 1
  })
  const pieChartData = Object.entries(platformCounts).map(([platform, count]) => ({
    name: platformLabels[platform] || platform,
    value: count,
  }))

  // Top performing content
  const topContent = [...analytics]
    .sort((a, b) => (b.views + b.likes + b.shares) - (a.views + a.likes + a.shares))
    .slice(0, 10)

  // Generate insights
  const generateInsights = () => {
    if (!summary || Object.keys(byType).length === 0) return []
    const insights: string[] = []
    const bestType = Object.entries(byType).sort((a, b) => b[1].views - a[1].views)[0]
    if (bestType) {
      insights.push(`Format ${contentTypeLabels[bestType[0]] || bestType[0]} memiliki performa terbaik dengan total ${bestType[1].views.toLocaleString()} views.`)
    }
    const bestPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]
    if (bestPlatform) {
      insights.push(`Platform ${platformLabels[bestPlatform[0]] || bestPlatform[0]} paling banyak digunakan.`)
    }
    if (summary.avgConversion > 0) {
      insights.push(`Rata-rata conversion rate: ${summary.avgConversion.toFixed(2)}%.`)
    }
    return insights
  }

  const insights = generateInsights()

  const summaryCards = summary ? [
    { label: 'Total Views', value: summary.totalViews.toLocaleString(), icon: Eye, color: 'text-emerald-600', gradient: 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-white/10' },
    { label: 'Total Likes', value: summary.totalLikes.toLocaleString(), icon: Heart, color: 'text-pink-600', gradient: 'bg-gradient-to-br from-pink-400 via-rose-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/30 ring-1 ring-white/10' },
    { label: 'Total Shares', value: summary.totalShares.toLocaleString(), icon: Share2, color: 'text-teal-600', gradient: 'bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30 ring-1 ring-white/10' },
    { label: 'Total Komentar', value: summary.totalComments.toLocaleString(), icon: MessageCircle, color: 'text-amber-600', gradient: 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg shadow-amber-500/30 ring-1 ring-white/10' },
    { label: 'Total Klik', value: summary.totalClicks.toLocaleString(), icon: MousePointerClick, color: 'text-violet-600', gradient: 'bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 ring-1 ring-white/10' },
    { label: 'Avg. Conversion', value: `${summary.avgConversion.toFixed(2)}%`, icon: TrendingUp, color: 'text-cyan-600', gradient: 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-lg shadow-sky-500/30 ring-1 ring-white/10' },
  ] : []

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <PresetIcon preset="analytics" size="md" variant="gradient" /> Dashboard Analytics
            </h2>
            <p className="text-sm text-muted-foreground">Pantau performa konten di berbagai platform</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadAnalytics} className="gap-1.5">
              <RefreshCw className="size-3.5" /> Muat Ulang
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAddDialogOpen(true)} className="gap-1.5">
              <Plus className="size-3.5" /> Tambah Data
            </Button>
            <Button size="sm" onClick={handleSeedDemo} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
              <Database className="size-3.5" /> Data Demo
            </Button>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : analytics.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-dashed border-2 border-muted-foreground/25">
            <CardContent className="p-10 flex flex-col items-center justify-center text-center">
              <PresetIcon preset="analytics" size="lg" variant="light" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Belum Ada Data Analytics</h3>
              <p className="text-sm text-muted-foreground mb-4">Klik &quot;Data Demo&quot; untuk mengisi data contoh, atau tambahkan data secara manual</p>
              <div className="flex gap-2">
                <Button onClick={handleSeedDemo} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Database className="size-4" /> Buat Data Demo
                </Button>
                <Button variant="outline" onClick={() => setAddDialogOpen(true)} className="gap-2">
                  <Plus className="size-4" /> Tambah Manual
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* Summary Cards */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {summaryCards.map((card, idx) => (
                <Card key={idx} className="border-emerald-200/50 dark:border-emerald-900/50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <PremiumStatIcon icon={card.icon} gradient={card.gradient} size="xs" />
                      <span className="text-[10px] text-muted-foreground">{card.label}</span>
                    </div>
                    <div className={`text-lg font-bold ${card.color}`}>{card.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart - Content Type Performance */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
              <Card className="border-emerald-200/50 dark:border-emerald-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <BarChart3 className="size-4" /> Performa per Tipe Konten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="views" fill="#10b981" name="Views" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="likes" fill="#14b8a6" name="Likes" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="shares" fill="#f59e0b" name="Shares" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pie Chart - Platform Distribution */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
              <Card className="border-emerald-200/50 dark:border-emerald-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <PieChartIcon className="size-4" /> Distribusi Platform
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
              <Card className="border-emerald-200/50 dark:border-emerald-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <PresetIcon preset="lightbulb" size="sm" variant="gradient" /> Wawasan & Rekomendasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.map((insight, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Top Performing Content Table */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
            <Card className="border-emerald-200/50 dark:border-emerald-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-emerald-700 dark:text-emerald-400">Top 10 Konten Terbaik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Judul</TableHead>
                        <TableHead className="text-xs">Platform</TableHead>
                        <TableHead className="text-xs text-right">Views</TableHead>
                        <TableHead className="text-xs text-right">Likes</TableHead>
                        <TableHead className="text-xs text-right">Shares</TableHead>
                        <TableHead className="text-xs text-right">Conversion</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topContent.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="text-xs font-medium max-w-[200px] truncate">
                            {item.content?.title || 'Konten'}
                          </TableCell>
                          <TableCell className="text-xs">
                            <Badge variant="secondary" className="text-[10px]">
                              {platformLabels[item.platform] || item.platform}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-right">{item.views.toLocaleString()}</TableCell>
                          <TableCell className="text-xs text-right">{item.likes.toLocaleString()}</TableCell>
                          <TableCell className="text-xs text-right">{item.shares.toLocaleString()}</TableCell>
                          <TableCell className="text-xs text-right">{item.conversionRate.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {/* Add Analytics Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Data Analytics</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Pilih Konten</Label>
              <Select value={formData.contentId} onValueChange={(v) => setFormData(s => ({ ...s, contentId: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih konten..." />
                </SelectTrigger>
                <SelectContent>
                  {history.slice(0, 20).map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={formData.platform} onValueChange={(v) => setFormData(s => ({ ...s, platform: v }))}>
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
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Views</Label>
                <Input type="number" placeholder="0" value={formData.views} onChange={(e) => setFormData(s => ({ ...s, views: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Likes</Label>
                <Input type="number" placeholder="0" value={formData.likes} onChange={(e) => setFormData(s => ({ ...s, likes: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Shares</Label>
                <Input type="number" placeholder="0" value={formData.shares} onChange={(e) => setFormData(s => ({ ...s, shares: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Komentar</Label>
                <Input type="number" placeholder="0" value={formData.comments} onChange={(e) => setFormData(s => ({ ...s, comments: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Klik</Label>
                <Input type="number" placeholder="0" value={formData.clicks} onChange={(e) => setFormData(s => ({ ...s, clicks: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Conversion Rate (%)</Label>
                <Input type="number" step="0.1" placeholder="0" value={formData.conversionRate} onChange={(e) => setFormData(s => ({ ...s, conversionRate: e.target.value }))} />
              </div>
            </div>
            <Button
              onClick={handleAddAnalytics}
              disabled={!formData.contentId}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Simpan Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
