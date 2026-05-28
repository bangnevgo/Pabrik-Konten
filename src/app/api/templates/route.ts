import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET
export async function GET() {
  try {
    const templates = await db.template.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Templates GET error:', error)
    return NextResponse.json({ error: 'Gagal memuat template' }, { status: 500 })
  }
}

// POST - Create template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, contentType, prompt, tone, platform, audience, language, length, isDefault } = body

    if (!name || !contentType || !prompt) {
      return NextResponse.json({ error: 'Nama, tipe konten, dan prompt wajib diisi' }, { status: 400 })
    }

    const template = await db.template.create({
      data: {
        name,
        contentType,
        prompt,
        tone: tone || null,
        platform: platform || null,
        audience: audience || null,
        language: language || 'id',
        length: length || null,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Templates POST error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan template' }, { status: 500 })
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 })

    await db.template.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Templates DELETE error:', error)
    return NextResponse.json({ error: 'Gagal menghapus template' }, { status: 500 })
  }
}
