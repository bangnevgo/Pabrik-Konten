import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET
export async function GET() {
  try {
    const analytics = await db.analytics.findMany({
      orderBy: { date: 'desc' },
      take: 100,
      include: { content: { select: { id: true, title: true, contentType: true } } },
    })

    // Aggregate stats
    const totalViews = analytics.reduce((sum, a) => sum + a.views, 0)
    const totalLikes = analytics.reduce((sum, a) => sum + a.likes, 0)
    const totalShares = analytics.reduce((sum, a) => sum + a.shares, 0)
    const totalComments = analytics.reduce((sum, a) => sum + a.comments, 0)
    const totalClicks = analytics.reduce((sum, a) => sum + a.clicks, 0)
    const avgConversion = analytics.length > 0
      ? analytics.reduce((sum, a) => sum + a.conversionRate, 0) / analytics.length
      : 0

    // Best performing content types
    const byType: Record<string, { views: number; likes: number; shares: number; count: number }> = {}
    analytics.forEach(a => {
      const type = a.content?.contentType || 'unknown'
      if (!byType[type]) byType[type] = { views: 0, likes: 0, shares: 0, count: 0 }
      byType[type].views += a.views
      byType[type].likes += a.likes
      byType[type].shares += a.shares
      byType[type].count += 1
    })

    return NextResponse.json({
      analytics,
      summary: { totalViews, totalLikes, totalShares, totalComments, totalClicks, avgConversion },
      byType,
    })
  } catch (error) {
    console.error('Analytics GET error:', error)
    return NextResponse.json({ error: 'Gagal memuat analytics' }, { status: 500 })
  }
}

// POST - Add analytics data (simulate incoming performance data)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId, platform, views, likes, shares, comments, clicks, conversionRate } = body

    if (!contentId || !platform) {
      return NextResponse.json({ error: 'Content ID dan platform wajib diisi' }, { status: 400 })
    }

    const entry = await db.analytics.create({
      data: {
        contentId,
        platform,
        views: views || 0,
        likes: likes || 0,
        shares: shares || 0,
        comments: comments || 0,
        clicks: clicks || 0,
        conversionRate: conversionRate || 0,
      },
    })

    return NextResponse.json({ entry })
  } catch (error) {
    console.error('Analytics POST error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan analytics' }, { status: 500 })
  }
}
