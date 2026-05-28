'use client'

import dynamic from 'next/dynamic'

const ContentFactory = dynamic(
  () => import('@/components/content-factory').then((mod) => mod.ContentFactory),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="text-sm text-muted-foreground">Memuat Pabrik Konten...</p>
        </div>
      </div>
    ),
  }
)

export default function Home() {
  return <ContentFactory />
}
