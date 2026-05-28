import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - List all content history with search and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('contentType')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const tags = searchParams.get('tags')

    const where: Record<string, unknown> = {}
    if (contentType && contentType !== 'all') where.contentType = contentType
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { prompt: { contains: search } },
        { tags: { contains: search } },
      ]
    }
    if (tags) {
      where.tags = { contains: tags }
    }

    const history = await db.contentHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { versions: { orderBy: { version: 'desc' } } },
    })

    return NextResponse.json({ history })
  } catch (error) {
    console.error('History GET error:', error)
    return NextResponse.json({ error: 'Gagal memuat riwayat konten' }, { status: 500 })
  }
}

// POST - Save new content or update existing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentType, title, prompt, result, editedResult, tone, platform, audience, language, length, status, sourceContentId, tags } = body

    if (!contentType || !title || !prompt || !result) {
      return NextResponse.json({ error: 'Tipe konten, judul, topik, dan hasil wajib diisi' }, { status: 400 })
    }

    const item = await db.contentHistory.create({
      data: {
        contentType,
        title,
        prompt,
        result,
        editedResult: editedResult || null,
        tone: tone || null,
        platform: platform || null,
        audience: audience || null,
        language: language || null,
        length: length || null,
        status: status || 'draft',
        sourceContentId: sourceContentId || null,
        tags: tags || null,
        versions: {
          create: { version: 1, result }
        }
      },
      include: { versions: true }
    })

    return NextResponse.json({ item })
  } catch (error) {
    console.error('History POST error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan konten' }, { status: 500 })
  }
}

// PUT - Update content (edit, status change, new version)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, editedResult, status, tags, newVersion } = body

    if (!id) {
      return NextResponse.json({ error: 'ID konten wajib diisi' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (editedResult !== undefined) updateData.editedResult = editedResult
    if (status) updateData.status = status
    if (tags !== undefined) updateData.tags = tags

    // If new version provided, create it
    if (newVersion) {
      const currentVersions = await db.contentVersion.count({ where: { contentId: id } })
      await db.contentVersion.create({
        data: {
          contentId: id,
          version: currentVersions + 1,
          result: newVersion,
        }
      })
    }

    const item = await db.contentHistory.update({
      where: { id },
      data: updateData,
      include: { versions: { orderBy: { version: 'desc' } } }
    })

    return NextResponse.json({ item })
  } catch (error) {
    console.error('History PUT error:', error)
    return NextResponse.json({ error: 'Gagal memperbarui konten' }, { status: 500 })
  }
}

// DELETE - Delete content by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID konten wajib diisi' }, { status: 400 })
    }

    await db.contentHistory.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('History DELETE error:', error)
    return NextResponse.json({ error: 'Gagal menghapus konten' }, { status: 500 })
  }
}
