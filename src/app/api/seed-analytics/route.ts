import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    const contents = await db.contentHistory.findMany({ take: 10 })

    if (contents.length === 0) {
      return NextResponse.json({ error: 'Belum ada konten. Buat konten terlebih dahulu.' }, { status: 400 })
    }

    const platforms = ['instagram', 'twitter', 'facebook', 'linkedin', 'tiktok', 'youtube']
    const entries = []

    for (const content of contents) {
      const numEntries = 2 + Math.floor(Math.random() * 2)
      for (let i = 0; i < numEntries; i++) {
        const platform = platforms[Math.floor(Math.random() * platforms.length)]
        const views = Math.floor(Math.random() * 10000) + 100
        const likes = Math.floor(views * (Math.random() * 0.1 + 0.01))
        const shares = Math.floor(likes * (Math.random() * 0.3))
        const comments = Math.floor(likes * (Math.random() * 0.2))
        const clicks = Math.floor(views * (Math.random() * 0.05))
        const conversionRate = Math.random() * 5

        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * 30))

        const entry = await db.analytics.create({
          data: { contentId: content.id, platform, views, likes, shares, comments, clicks, conversionRate, date }
        })
        entries.push(entry)
      }
    }

    return NextResponse.json({ message: `Berhasil membuat ${entries.length} data analytics demo`, count: entries.length })
  } catch (error) {
    console.error('Seed analytics error:', error)
    return NextResponse.json({ error: 'Gagal membuat data demo' }, { status: 500 })
  }
}
