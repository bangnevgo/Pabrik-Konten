import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const systemPrompts: Record<string, string> = {
  blog: `Kamu adalah penulis artikel blog profesional. Buatkan artikel blog yang menarik, informatif, dan SEO-friendly berdasarkan topik yang diberikan. Artikel harus memiliki judul, pendahuluan, beberapa subjudul, dan kesimpulan. Gunakan format markdown yang rapi.`,
  social: `Kamu adalah ahli media sosial. Buatkan postingan media sosial yang engaging dan viral sesuai platform yang ditentukan. Sertakan hashtag yang relevan dan call-to-action yang kuat. Gunakan format markdown.`,
  marketing: `Kamu adalah copywriter marketing berpengalaman. Buatkan copy marketing yang persuasif dan memikat sesuai kebutuhan. Fokus pada manfaat produk dan dorong tindakan. Gunakan format markdown yang rapi.`,
  email: `Kamu adalah spesialis email marketing. Buatkan email marketing yang efektif dengan subject line yang menarik, isi yang relevan, dan call-to-action yang jelas. Gunakan format markdown.`,
  product: `Kamu adalah penulis deskripsi produk e-commerce profesional. Buatkan deskripsi produk yang menarik, informatif, dan mendorong konversi. Sertakan fitur utama, manfaat, dan spesifikasi. Gunakan format markdown.`,
  video: `Kamu adalah scriptwriter video profesional. Buatkan skrip video yang engaging sesuai platform, dengan hook yang kuat di awal dan call-to-action di akhir. Sertakan visual cues dan timing. Gunakan format markdown.`,
}

const toneMap: Record<string, string> = {
  professional: 'profesional',
  casual: 'kasual/santai',
  persuasive: 'persuasif',
  informative: 'informatif',
  humorous: 'humoris',
}

const lengthMap: Record<string, string> = {
  short: 'pendek (200-400 kata)',
  medium: 'sedang (400-800 kata)',
  long: 'panjang (800-1500 kata)',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentType, prompt, tone, platform, targetAudience, language, length } = body

    if (!contentType || !prompt) {
      return NextResponse.json(
        { error: 'Tipe konten dan topik/deskripsi wajib diisi' },
        { status: 400 }
      )
    }

    const systemPrompt = systemPrompts[contentType] || systemPrompts.blog
    const toneDesc = toneMap[tone] || tone || 'profesional'
    const lengthDesc = lengthMap[length] || lengthMap.medium

    let userPrompt = ''

    if (language === 'en') {
      userPrompt = `Write a ${contentType} content about: "${prompt}"\n\nTone: ${tone}\nLength: ${lengthDesc}\nTarget audience: ${targetAudience || 'general'}`
      if (platform) {
        userPrompt += `\nPlatform: ${platform}`
      }
    } else {
      userPrompt = `Buatkan konten ${contentType} tentang: "${prompt}"\n\nGaya bahasa: ${toneDesc}\nPanjang: ${lengthDesc}\nTarget audiens: ${targetAudience || 'umum'}`
      if (platform) {
        userPrompt += `\nPlatform: ${platform}`
      }
    }

    const zai = new ZAI()
    const response = await zai.chat.completions.create({
      model: 'default',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })

    const generatedContent = response.choices?.[0]?.message?.content || ''

    if (!generatedContent) {
      return NextResponse.json(
        { error: 'Gagal menghasilkan konten. Silakan coba lagi.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghasilkan konten. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
