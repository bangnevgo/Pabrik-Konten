import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET
export async function GET() {
  try {
    const schedules = await db.schedule.findMany({
      orderBy: { scheduledAt: 'asc' },
      include: { content: true },
    })
    return NextResponse.json({ schedules })
  } catch (error) {
    console.error('Schedule GET error:', error)
    return NextResponse.json({ error: 'Gagal memuat jadwal' }, { status: 500 })
  }
}

// POST - Create schedule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId, platform, scheduledAt } = body

    if (!contentId || !platform || !scheduledAt) {
      return NextResponse.json({ error: 'Content ID, platform, dan waktu wajib diisi' }, { status: 400 })
    }

    const schedule = await db.schedule.create({
      data: { contentId, platform, scheduledAt: new Date(scheduledAt) },
      include: { content: true },
    })

    return NextResponse.json({ schedule })
  } catch (error) {
    console.error('Schedule POST error:', error)
    return NextResponse.json({ error: 'Gagal membuat jadwal' }, { status: 500 })
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })

    await db.schedule.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Schedule DELETE error:', error)
    return NextResponse.json({ error: 'Gagal menghapus jadwal' }, { status: 500 })
  }
}
