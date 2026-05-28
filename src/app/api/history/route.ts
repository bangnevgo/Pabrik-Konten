import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - List all content history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('contentType')

    const where = contentType && contentType !== 'all'
      ? { contentType }
      : {}

    const history = await db.contentHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ history })
  } catch (error) {
    console.error('History GET error:', error)
    return NextResponse.json(
      { error: 'Gagal memuat riwayat konten' },
      { status: 500 }
    )
  }
}

// POST - Save new content to history
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentType, title, prompt, result, tone, platform, audience, language, length } = body

    if (!contentType || !title || !prompt || !result) {
      return NextResponse.json(
        { error: 'Tipe konten, judul, topik, dan hasil wajib diisi' },
        { status: 400 }
      )
    }

    const item = await db.contentHistory.create({
      data: {
        contentType,
        title,
        prompt,
        result,
        tone: tone || null,
        platform: platform || null,
        audience: audience || null,
        language: language || null,
        length: length || null,
      },
    })

    return NextResponse.json({ item })
  } catch (error) {
    console.error('History POST error:', error)
    return NextResponse.json(
      { error: 'Gagal menyimpan konten' },
      { status: 500 }
    )
  }
}

// DELETE - Delete content by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID konten wajib diisi' },
        { status: 400 }
      )
    }

    await db.contentHistory.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('History DELETE error:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus konten' },
      { status: 500 }
    )
  }
}
