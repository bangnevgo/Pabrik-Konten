# Pabrik Konten v2.0

**Full Content Factory** — Didukung oleh AI untuk menghasilkan konten berkualitas.

Pabrik Konten adalah aplikasi web berbasis AI yang memungkinkan kamu membuat, mengubah, menjadwalkan, dan menganalisis konten secara efisien. Bukan sekadar generator — ini adalah **pabrik konten** lengkap dengan mesin repurpose, batch generation, template bank, perpustakaan konten, kalender editorial, dan dashboard analytics.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?logo=prisma)
![Lucide](https://img.shields.io/badge/Lucide_React-Premium_Icons-f56565?logo=lucide)

---

## Fitur Utama

### 1. Buat Konten (Create)
Buat konten dari nol dengan 6 format berbeda:
- **Artikel Blog** — Artikel SEO-friendly dengan subjudul dan kesimpulan
- **Postingan Media Sosial** — Caption untuk Instagram, Twitter/X, Facebook, LinkedIn, TikTok
- **Copy Marketing** — Copy persuasif untuk iklan dan promosi
- **Email Marketing** — Newsletter dan email promosi dengan subject line
- **Deskripsi Produk** — Deskripsi e-commerce untuk Tokopedia, Shopee, dll
- **Skrip Video** — Script untuk YouTube, TikTok, Reels, Shorts

Setiap generator mendukung pengaturan:
- Gaya bahasa (Profesional, Santai, Persuasif, Informatif, Humoris)
- Target audiens
- Bahasa (Indonesia / English)
- Panjang konten (Pendek, Sedang, Panjang)

### 2. Mesin Repurpose
Ubah satu konten menjadi berbagai format untuk platform yang berbeda:
- Instagram Caption
- Twitter Thread
- Artikel Blog
- Email Newsletter
- Skrip TikTok
- LinkedIn Post
- Deskripsi YouTube

Pilih konten dari perpustakaan atau tempel manual, pilih format target, dan AI akan mengubah konten sumber ke setiap format dengan gaya yang sesuai.

### 3. Generator Batch
Buat beberapa jenis konten sekaligus dari satu brief — hemat waktu untuk kampanye multi-format.

### 4. Bank Template
Simpan dan gunakan ulang template prompt untuk membuat konten lebih cepat. Mendukung variabel placeholder seperti `{{topik}}`, `{{audiens}}`, `{{platform}}`.

### 5. Perpustakaan Konten (Library)
Kelola semua konten yang telah dibuat:
- **Pencarian** — Cari berdasarkan judul, topik, atau tag
- **Filter** — Filter berdasarkan tipe konten dan status (Draft, Disetujui, Dijadwalkan, Dipublikasi)
- **Edit Manual** — Edit konten dan simpan sebagai versi baru
- **Riwayat Versi** — Lacak semua perubahan pada konten
- **Tagging** — Beri tag pada konten untuk organisasi yang lebih baik
- **Approval Workflow** — Ubah status konten dari Draft → Disetujui → Dijadwalkan → Dipublikasi
- **Repurpose Cepat** — Kirim konten langsung ke mesin repurpose

### 6. Kalender Konten
Jadwalkan dan kelola publikasi konten:
- Tampilan kalender visual bulanan
- Jadwalkan konten ke platform dan waktu tertentu
- Statistik: Dijadwalkan, Terkirim, Gagal
- Navigasi antar bulan

### 7. Dashboard Analytics
Pantau performa konten di berbagai platform:
- **Statistik Ringkasan** — Views, Likes, Shares, Komentar, Klik, Conversion Rate
- **Grafik Bar** — Performa per tipe konten
- **Grafik Pie** — Distribusi platform
- **Wawasan & Rekomendasi** — AI-generated insights
- **Tabel Top 10** — Konten dengan performa terbaik
- **Data Demo** — Isi data contoh untuk testing
- **Input Manual** — Tambahkan data analytics secara manual

---

## Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| **Next.js 16** | Framework React dengan App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Komponen UI (Radix UI primitives) |
| **Prisma** | ORM untuk database SQLite |
| **Zustand** | State management |
| **Framer Motion** | Animasi dan transisi |
| **Recharts** | Grafik dan visualisasi data |
| **Lucide React** | Icon library dengan premium styling |
| **z-ai-web-dev-sdk** | AI integration untuk konten generation |
| **React Markdown** | Render markdown output |

---

## Struktur Proyek

```
src/
├── app/
│   ├── page.tsx                    # Home page (dynamic import, SSR disabled)
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles + shimmer animation
│   └── api/
│       ├── generate/route.ts       # AI content generation
│       ├── history/route.ts        # CRUD konten history
│       ├── templates/route.ts      # CRUD template
│       ├── schedule/route.ts       # CRUD jadwal
│       ├── analytics/route.ts      # Analytics data
│       └── seed-analytics/route.ts # Seed demo data
├── components/
│   ├── content-factory.tsx         # Main layout with 7-tab navigation
│   ├── premium-icons.tsx           # Premium icon system (glass + glow + shimmer)
│   ├── blog-generator.tsx          # Artikel blog generator
│   ├── social-generator.tsx        # Media sosial generator
│   ├── marketing-generator.tsx     # Copy marketing generator
│   ├── email-generator.tsx         # Email marketing generator
│   ├── product-generator.tsx       # Deskripsi produk generator
│   ├── video-generator.tsx         # Skrip video generator
│   ├── output-display.tsx          # Output display with actions
│   ├── repurpose-engine.tsx        # Mesin repurpose konten
│   ├── batch-generator.tsx         # Generator batch
│   ├── template-bank.tsx           # Bank template
│   ├── enhanced-library.tsx        # Perpustakaan konten
│   ├── content-calendar.tsx        # Kalender konten
│   ├── analytics-dashboard.tsx     # Dashboard analytics
│   ├── theme-toggle.tsx            # Dark/light mode toggle
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── store.ts                    # Zustand store
│   ├── db.ts                       # Prisma client
│   └── utils.ts                    # Utility functions
├── hooks/
│   ├── use-toast.ts                # Toast notifications
│   └── use-mobile.ts               # Mobile detection
└── prisma/
    └── schema.prisma               # Database schema (SQLite)
```

---

## Database Schema

```
ContentHistory ──┬── ContentVersion  (riwayat versi)
                 ├── Schedule        (jadwal publikasi)
                 └── Analytics       (data performa)

Template         (bank template prompt)
```

---

## Instalasi & Menjalankan

### Prasyarat
- Node.js 18+ atau Bun
- npm / bun

### Langkah-langkah

```bash
# 1. Clone repository
git clone <repo-url>
cd my-project

# 2. Install dependencies
npm install

# 3. Setup database
npx prisma db push
npx prisma generate

# 4. Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

### Script yang Tersedia

| Script | Perintah | Deskripsi |
|--------|----------|-----------|
| Dev | `npm run dev` | Jalankan development server |
| Build | `npm run build` | Build untuk production |
| Start | `npm run start` | Jalankan production server |
| DB Push | `npm run db:push` | Push schema ke database |
| DB Generate | `npm run db:generate` | Generate Prisma client |
| DB Migrate | `npm run db:migrate` | Jalankan migrasi |
| DB Reset | `npm run db:reset` | Reset database |

---

## Premium Icon System

Pabrik Konten menggunakan sistem icon premium dengan Lucide React:

- **3-stop gradients** — `from-X via-Y to-Z` untuk kedalaman visual
- **Glass morphism** — `ring-1 ring-white/10` + `backdrop-blur-sm`
- **Colored glow** — `shadow-lg shadow-{color}/30`
- **Animated shimmer** — Efek cahaya menyapu (light sweep) dengan stagger delay
- **Active state scaling** — `scale-105` pada navigasi aktif

Komponen icon yang tersedia:
- `PresetIcon` — Icon dengan preset warna per kategori
- `PremiumNavIcon` — Icon navigasi dengan state aktif
- `PremiumStatIcon` — Icon untuk kartu statistik analytics
- `IconBox` — Container icon custom

---

## Konfigurasi

### Environment Variables

Buat file `.env` di root proyek:

```env
DATABASE_URL=file:/home/z/my-project/db/custom.db
```

### Dark Mode

Aplikasi mendukung dark mode yang di-toggle via tombol di header. Tema disimpan di `localStorage` menggunakan `next-themes`.

---

## Catatan Teknis

- **SSR Disabled**: Komponen utama `ContentFactory` menggunakan `next/dynamic` dengan `ssr: false` untuk menghindari hydration mismatch dari Radix UI auto-generated IDs
- **AI Integration**: Konten generation menggunakan `z-ai-web-dev-sdk` dengan system prompt yang disesuaikan per tipe konten
- **Database**: SQLite via Prisma, cocok untuk development dan skala kecil-menengah
- **Responsive**: Layout responsif dengan sidebar desktop dan bottom navigation mobile

---

## Lisensi

Private — Hak cipta dimiliki oleh pemilik proyek.
