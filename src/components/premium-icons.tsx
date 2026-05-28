'use client'

import type { LucideIcon } from 'lucide-react'
import {
  FileText, Smartphone, Megaphone, Mail, ShoppingBag, Video,
  RefreshCw, Package, LayoutTemplate, Library, CalendarDays,
  BarChart3, Sparkles, Factory, Lightbulb, Inbox,
  Instagram, Twitter, Linkedin, Youtube,
  PenLine, Share2, Zap, Wand2, BookOpen, Clapperboard,
  Palette, Target, Layers, TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ───────────────────────────────────────────────
   Premium Icon Box — glass + glow + shimmer
   ─────────────────────────────────────────────── */

interface IconBoxProps {
  icon: LucideIcon
  className?: string
  iconClassName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  noShimmer?: boolean
}

const sizeMap = {
  xs:  'size-6 rounded-md [&>svg]:size-3',
  sm:  'size-8 rounded-lg [&>svg]:size-3.5',
  md:  'size-9 rounded-xl [&>svg]:size-4',
  lg:  'size-11 rounded-xl [&>svg]:size-5',
  xl:  'size-14 rounded-2xl [&>svg]:size-6',
}

export function IconBox({ icon: Icon, className, iconClassName, size = 'md', noShimmer }: IconBoxProps) {
  return (
    <div className={cn(
      'relative inline-flex items-center justify-center shrink-0 overflow-hidden',
      'backdrop-blur-sm',
      sizeMap[size],
      className
    )}>
      <Icon className={cn('relative z-10', iconClassName)} />
      {/* Shimmer sweep */}
      {!noShimmer && (
        <span className="icon-shimmer pointer-events-none absolute inset-0 z-20" />
      )}
    </div>
  )
}

/* ───────────────────────────────────────────────
   Icon preset definitions — richer gradients
   ─────────────────────────────────────────────── */

export const iconPresets = {
  blog: {
    icon: BookOpen,
    gradient: 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-white/10',
    light: 'bg-emerald-50/80 text-emerald-600 ring-1 ring-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-700/40',
    glow: 'shadow-emerald-500/40',
  },
  social: {
    icon: Smartphone,
    gradient: 'bg-gradient-to-br from-pink-400 via-rose-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/30 ring-1 ring-white/10',
    light: 'bg-pink-50/80 text-pink-600 ring-1 ring-pink-200/60 dark:bg-pink-900/30 dark:text-pink-400 dark:ring-pink-700/40',
    glow: 'shadow-pink-500/40',
  },
  marketing: {
    icon: Megaphone,
    gradient: 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg shadow-amber-500/30 ring-1 ring-white/10',
    light: 'bg-amber-50/80 text-amber-600 ring-1 ring-amber-200/60 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-700/40',
    glow: 'shadow-amber-500/40',
  },
  email: {
    icon: Mail,
    gradient: 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-lg shadow-sky-500/30 ring-1 ring-white/10',
    light: 'bg-sky-50/80 text-sky-600 ring-1 ring-sky-200/60 dark:bg-sky-900/30 dark:text-sky-400 dark:ring-sky-700/40',
    glow: 'shadow-sky-500/40',
  },
  product: {
    icon: ShoppingBag,
    gradient: 'bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 ring-1 ring-white/10',
    light: 'bg-violet-50/80 text-violet-600 ring-1 ring-violet-200/60 dark:bg-violet-900/30 dark:text-violet-400 dark:ring-violet-700/40',
    glow: 'shadow-violet-500/40',
  },
  video: {
    icon: Clapperboard,
    gradient: 'bg-gradient-to-br from-rose-400 via-red-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 ring-1 ring-white/10',
    light: 'bg-rose-50/80 text-rose-600 ring-1 ring-rose-200/60 dark:bg-rose-900/30 dark:text-rose-400 dark:ring-rose-700/40',
    glow: 'shadow-rose-500/40',
  },
  repurpose: {
    icon: RefreshCw,
    gradient: 'bg-gradient-to-br from-teal-400 via-cyan-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30 ring-1 ring-white/10',
    light: 'bg-teal-50/80 text-teal-600 ring-1 ring-teal-200/60 dark:bg-teal-900/30 dark:text-teal-400 dark:ring-teal-700/40',
    glow: 'shadow-teal-500/40',
  },
  batch: {
    icon: Layers,
    gradient: 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 ring-1 ring-white/10',
    light: 'bg-cyan-50/80 text-cyan-600 ring-1 ring-cyan-200/60 dark:bg-cyan-900/30 dark:text-cyan-400 dark:ring-cyan-700/40',
    glow: 'shadow-cyan-500/40',
  },
  templates: {
    icon: LayoutTemplate,
    gradient: 'bg-gradient-to-br from-indigo-400 via-violet-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/10',
    light: 'bg-indigo-50/80 text-indigo-600 ring-1 ring-indigo-200/60 dark:bg-indigo-900/30 dark:text-indigo-400 dark:ring-indigo-700/40',
    glow: 'shadow-indigo-500/40',
  },
  library: {
    icon: Library,
    gradient: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-white/10',
    light: 'bg-emerald-50/80 text-emerald-600 ring-1 ring-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-700/40',
    glow: 'shadow-emerald-500/40',
  },
  calendar: {
    icon: CalendarDays,
    gradient: 'bg-gradient-to-br from-blue-400 via-indigo-500 to-violet-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/10',
    light: 'bg-blue-50/80 text-blue-600 ring-1 ring-blue-200/60 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-700/40',
    glow: 'shadow-blue-500/40',
  },
  analytics: {
    icon: TrendingUp,
    gradient: 'bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-600 text-white shadow-lg shadow-fuchsia-500/30 ring-1 ring-white/10',
    light: 'bg-fuchsia-50/80 text-fuchsia-600 ring-1 ring-fuchsia-200/60 dark:bg-fuchsia-900/30 dark:text-fuchsia-400 dark:ring-fuchsia-700/40',
    glow: 'shadow-fuchsia-500/40',
  },
  create: {
    icon: Wand2,
    gradient: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-white/10',
    light: 'bg-emerald-50/80 text-emerald-600 ring-1 ring-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-700/40',
    glow: 'shadow-emerald-500/40',
  },
  factory: {
    icon: Zap,
    gradient: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-white/10',
    light: 'bg-emerald-50/80 text-emerald-600 ring-1 ring-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-700/40',
    glow: 'shadow-emerald-500/40',
  },
  lightbulb: {
    icon: Lightbulb,
    gradient: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 text-white shadow-lg shadow-amber-400/30 ring-1 ring-white/10',
    light: 'bg-amber-50/80 text-amber-600 ring-1 ring-amber-200/60 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-700/40',
    glow: 'shadow-amber-400/40',
  },
  inbox: {
    icon: Inbox,
    gradient: 'bg-gradient-to-br from-slate-300 via-gray-400 to-zinc-500 text-white shadow-lg shadow-gray-400/30 ring-1 ring-white/10',
    light: 'bg-gray-50/80 text-gray-500 ring-1 ring-gray-200/60 dark:bg-gray-800/30 dark:text-gray-400 dark:ring-gray-700/40',
    glow: 'shadow-gray-400/40',
  },
  instagram: {
    icon: Instagram,
    gradient: 'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 text-white shadow-lg shadow-pink-500/30 ring-1 ring-white/10',
    light: 'bg-pink-50/80 text-pink-600 ring-1 ring-pink-200/60 dark:bg-pink-900/30 dark:text-pink-400 dark:ring-pink-700/40',
    glow: 'shadow-pink-500/40',
  },
  twitter: {
    icon: Twitter,
    gradient: 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-lg shadow-sky-400/30 ring-1 ring-white/10',
    light: 'bg-sky-50/80 text-sky-600 ring-1 ring-sky-200/60 dark:bg-sky-900/30 dark:text-sky-400 dark:ring-sky-700/40',
    glow: 'shadow-sky-400/40',
  },
  linkedin: {
    icon: Linkedin,
    gradient: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/10',
    light: 'bg-blue-50/80 text-blue-600 ring-1 ring-blue-200/60 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-700/40',
    glow: 'shadow-blue-500/40',
  },
  youtube: {
    icon: Youtube,
    gradient: 'bg-gradient-to-br from-red-400 via-red-500 to-rose-700 text-white shadow-lg shadow-red-500/30 ring-1 ring-white/10',
    light: 'bg-red-50/80 text-red-600 ring-1 ring-red-200/60 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-700/40',
    glow: 'shadow-red-500/40',
  },
  sparkles: {
    icon: Sparkles,
    gradient: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-400/30 ring-1 ring-white/10',
    light: 'bg-yellow-50/80 text-yellow-600 ring-1 ring-yellow-200/60 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-700/40',
    glow: 'shadow-yellow-400/40',
  },
  palette: {
    icon: Palette,
    gradient: 'bg-gradient-to-br from-fuchsia-400 via-pink-500 to-rose-600 text-white shadow-lg shadow-fuchsia-500/30 ring-1 ring-white/10',
    light: 'bg-fuchsia-50/80 text-fuchsia-600 ring-1 ring-fuchsia-200/60 dark:bg-fuchsia-900/30 dark:text-fuchsia-400 dark:ring-fuchsia-700/40',
    glow: 'shadow-fuchsia-500/40',
  },
  target: {
    icon: Target,
    gradient: 'bg-gradient-to-br from-red-400 via-orange-500 to-amber-600 text-white shadow-lg shadow-red-400/30 ring-1 ring-white/10',
    light: 'bg-red-50/80 text-red-600 ring-1 ring-red-200/60 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-700/40',
    glow: 'shadow-red-400/40',
  },
  share: {
    icon: Share2,
    gradient: 'bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 text-white shadow-lg shadow-teal-500/30 ring-1 ring-white/10',
    light: 'bg-teal-50/80 text-teal-600 ring-1 ring-teal-200/60 dark:bg-teal-900/30 dark:text-teal-400 dark:ring-teal-700/40',
    glow: 'shadow-teal-500/40',
  },
  pen: {
    icon: PenLine,
    gradient: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-white/10',
    light: 'bg-emerald-50/80 text-emerald-600 ring-1 ring-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-700/40',
    glow: 'shadow-emerald-500/40',
  },
} as const

/* ───────────────────────────────────────────────
   PresetIcon — the main consumer
   ─────────────────────────────────────────────── */

interface PresetIconProps {
  preset: keyof typeof iconPresets
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'gradient' | 'light' | 'glow'
  className?: string
  noShimmer?: boolean
}

export function PresetIcon({ preset, size = 'md', variant = 'gradient', className, noShimmer }: PresetIconProps) {
  const p = iconPresets[preset]
  const variantClass = variant === 'glow'
    ? p.gradient
    : variant === 'gradient'
      ? p.gradient
      : p.light

  return (
    <IconBox
      icon={p.icon}
      size={size}
      noShimmer={noShimmer || variant === 'light'}
      className={cn(variantClass, variant === 'glow' && p.glow, className)}
    />
  )
}

/* ───────────────────────────────────────────────
   PremiumNavIcon — for sidebar & mobile nav
   ─────────────────────────────────────────────── */

interface PremiumNavIconProps {
  preset: keyof typeof iconPresets
  active?: boolean
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

export function PremiumNavIcon({ preset, active, size = 'sm', className }: PremiumNavIconProps) {
  const p = iconPresets[preset]
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 transition-all duration-300',
        sizeMap[size],
        active
          ? cn(p.gradient, 'scale-105')
          : cn(p.light, 'scale-100'),
        className
      )}
    >
      <p.icon className="relative z-10" />
      {active && <span className="icon-shimmer pointer-events-none absolute inset-0 z-20" />}
    </div>
  )
}

/* ───────────────────────────────────────────────
   PremiumStatIcon — for analytics cards
   ─────────────────────────────────────────────── */

interface PremiumStatIconProps {
  icon: LucideIcon
  gradient: string
  size?: 'sm' | 'md'
  className?: string
}

export function PremiumStatIcon({ icon: Icon, gradient, size = 'sm', className }: PremiumStatIconProps) {
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 overflow-hidden',
        'backdrop-blur-sm',
        sizeMap[size],
        gradient,
        'ring-1 ring-white/10',
        className
      )}
    >
      <Icon className="relative z-10" />
      <span className="icon-shimmer pointer-events-none absolute inset-0 z-20" />
    </div>
  )
}
