'use client'

import { motion } from 'framer-motion'
import { Factory } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/theme-toggle'
import { BlogGenerator } from '@/components/blog-generator'
import { SocialGenerator } from '@/components/social-generator'
import { MarketingGenerator } from '@/components/marketing-generator'
import { EmailGenerator } from '@/components/email-generator'
import { ProductGenerator } from '@/components/product-generator'
import { VideoGenerator } from '@/components/video-generator'
import { HistoryPanel } from '@/components/history-panel'
import { useContentStore, type ContentType } from '@/lib/store'

const tabs: { value: ContentType; label: string; icon: string }[] = [
  { value: 'blog', label: 'Artikel', icon: '📝' },
  { value: 'social', label: 'Sosmed', icon: '📱' },
  { value: 'marketing', label: 'Marketing', icon: '🎯' },
  { value: 'email', label: 'Email', icon: '✉️' },
  { value: 'product', label: 'Produk', icon: '🛍️' },
  { value: 'video', label: 'Video', icon: '🎬' },
]

export function ContentFactory() {
  const { activeTab, setActiveTab } = useContentStore()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSI0MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Factory className="size-8 sm:size-10 text-white" />
                <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  PABRIK KONTEN
                </h1>
              </div>
              <p className="text-emerald-100 text-sm sm:text-lg max-w-xl">
                Pabrik konten AI untuk semua kebutuhan kontenmu. Buat artikel, postingan sosmed, copy marketing, dan lainnya dalam sekejap.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-1"
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ContentType)}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5 mb-6">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 min-w-[80px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all text-xs sm:text-sm"
                >
                  <span className="mr-1">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          <TabsContent value="blog">
            <BlogGenerator />
          </TabsContent>
          <TabsContent value="social">
            <SocialGenerator />
          </TabsContent>
          <TabsContent value="marketing">
            <MarketingGenerator />
          </TabsContent>
          <TabsContent value="email">
            <EmailGenerator />
          </TabsContent>
          <TabsContent value="product">
            <ProductGenerator />
          </TabsContent>
          <TabsContent value="video">
            <VideoGenerator />
          </TabsContent>
        </Tabs>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8"
        >
          <HistoryPanel />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-muted-foreground">
          <p>🏭 Pabrik Konten — Didukung oleh AI untuk menghasilkan konten berkualitas</p>
        </div>
      </footer>
    </div>
  )
}
