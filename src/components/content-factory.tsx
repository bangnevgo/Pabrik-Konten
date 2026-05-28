'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, ChevronRight
} from 'lucide-react'
import { PresetIcon } from '@/components/premium-icons'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/theme-toggle'
import { BlogGenerator } from '@/components/blog-generator'
import { SocialGenerator } from '@/components/social-generator'
import { MarketingGenerator } from '@/components/marketing-generator'
import { EmailGenerator } from '@/components/email-generator'
import { ProductGenerator } from '@/components/product-generator'
import { VideoGenerator } from '@/components/video-generator'
import { RepurposeEngine } from '@/components/repurpose-engine'
import { BatchGenerator } from '@/components/batch-generator'
import { TemplateBank } from '@/components/template-bank'
import { EnhancedLibrary } from '@/components/enhanced-library'
import { ContentCalendar } from '@/components/content-calendar'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'
import { useContentStore, type ContentType, type AppView } from '@/lib/store'

const navItems: { view: AppView; label: string; preset: string; description: string }[] = [
  { view: 'create', label: 'Buat Konten', preset: 'create', description: 'Buat konten baru dari nol' },
  { view: 'repurpose', label: 'Repurpose', preset: 'repurpose', description: 'Ubah konten ke format lain' },
  { view: 'batch', label: 'Batch', preset: 'batch', description: 'Buat banyak konten sekaligus' },
  { view: 'templates', label: 'Template', preset: 'templates', description: 'Bank template prompt' },
  { view: 'library', label: 'Perpustakaan', preset: 'library', description: 'Kelola semua konten' },
  { view: 'calendar', label: 'Kalender', preset: 'calendar', description: 'Jadwalkan publikasi' },
  { view: 'analytics', label: 'Analytics', preset: 'analytics', description: 'Pantau performa konten' },
]

const contentTabs: { value: ContentType; label: string; preset: string }[] = [
  { value: 'blog', label: 'Artikel', preset: 'blog' },
  { value: 'social', label: 'Sosmed', preset: 'social' },
  { value: 'marketing', label: 'Marketing', preset: 'marketing' },
  { value: 'email', label: 'Email', preset: 'email' },
  { value: 'product', label: 'Produk', preset: 'product' },
  { value: 'video', label: 'Video', preset: 'video' },
]

export function ContentFactory() {
  const { activeView, setActiveView, activeTab, setActiveTab } = useContentStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderMainContent = () => {
    switch (activeView) {
      case 'create':
        return (
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ContentType)}>
              <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5">
                {contentTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-1 min-w-[70px] data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all text-xs sm:text-sm gap-1.5"
                  >
                    <PresetIcon preset={tab.preset as any} size="sm" variant="light" className={activeTab === tab.value ? 'bg-white/20 !text-white' : ''} />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="blog"><BlogGenerator /></TabsContent>
              <TabsContent value="social"><SocialGenerator /></TabsContent>
              <TabsContent value="marketing"><MarketingGenerator /></TabsContent>
              <TabsContent value="email"><EmailGenerator /></TabsContent>
              <TabsContent value="product"><ProductGenerator /></TabsContent>
              <TabsContent value="video"><VideoGenerator /></TabsContent>
            </Tabs>
          </div>
        )
      case 'repurpose':
        return <RepurposeEngine />
      case 'batch':
        return <BatchGenerator />
      case 'templates':
        return <TemplateBank />
      case 'library':
        return <EnhancedLibrary />
      case 'calendar':
        return <ContentCalendar />
      case 'analytics':
        return <AnalyticsDashboard />
      default:
        return null
    }
  }

  const currentNav = navItems.find(n => n.view === activeView)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSI0MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-30" />
        <div className="relative flex items-center justify-between px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <PresetIcon preset="factory" size="lg" variant="gradient" className="bg-white/20 !bg-gradient-to-br !from-white/30 !to-white/10 !text-white !shadow-none" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                  PABRIK KONTEN
                </h1>
                <p className="text-emerald-100 text-[10px] sm:text-xs hidden sm:block">
                  Full Content Factory — Buat, Repurpose, Jadwalkan, Analisis
                </p>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            {currentNav && (
              <div className="hidden sm:flex items-center gap-1.5 text-emerald-100 text-xs bg-white/10 rounded-lg px-2.5 py-1.5">
                <PresetIcon preset={currentNav.preset as any} size="sm" variant="light" className="bg-white/20 !text-white" />
                <span>{currentNav.label}</span>
              </div>
            )}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
              <ThemeToggle />
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-[220px] border-r bg-card/50 shrink-0">
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeView === item.view
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <PresetIcon preset={item.preset as any} size="sm" variant={activeView === item.view ? 'gradient' : 'light'} />
                <span>{item.label}</span>
                {activeView === item.view && (
                  <ChevronRight className="size-3.5 ml-auto text-emerald-500" />
                )}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t">
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
              <PresetIcon preset="factory" size="sm" variant="light" /> Pabrik Konten v2.0
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed top-0 left-0 bottom-0 w-[280px] bg-card border-r z-50 lg:hidden shadow-xl"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <PresetIcon preset="factory" size="md" variant="gradient" />
                    <span className="font-bold text-sm">PABRIK KONTEN</span>
                  </div>
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => setSidebarOpen(false)}>
                    <X className="size-4" />
                  </Button>
                </div>
                <nav className="p-3 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.view}
                      onClick={() => { setActiveView(item.view); setSidebarOpen(false) }}
                      className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                        activeView === item.view
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <PresetIcon preset={item.preset as any} size="sm" variant={activeView === item.view ? 'gradient' : 'light'} />
                      <div className="text-left">
                        <div>{item.label}</div>
                        <div className="text-[10px] text-muted-foreground font-normal">{item.description}</div>
                      </div>
                      {activeView === item.view && (
                        <ChevronRight className="size-3.5 ml-auto text-emerald-500" />
                      )}
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {renderMainContent()}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden border-t bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-around py-1 px-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors min-w-[48px] ${
                activeView === item.view
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground'
              }`}
            >
              <PresetIcon preset={item.preset as any} size="sm" variant={activeView === item.view ? 'gradient' : 'light'} />
              <span className="truncate max-w-[56px]">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer (Desktop only) */}
      <footer className="hidden lg:block border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-sm text-muted-foreground">
          Pabrik Konten — Didukung oleh AI untuk menghasilkan konten berkualitas
        </div>
      </footer>
    </div>
  )
}
