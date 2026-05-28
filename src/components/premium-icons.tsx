'use client'

import type { LucideIcon } from 'lucide-react'
import {
  FileText, Smartphone, Megaphone, Mail, ShoppingBag, Video,
  RefreshCw, Package, LayoutTemplate, Library, CalendarDays,
  BarChart3, Sparkles, Factory, Lightbulb, Inbox,
  Instagram, Twitter, Linkedin, Youtube,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Gradient icon container — the "premium" look
interface IconBoxProps {
  icon: LucideIcon
  className?: string
  iconClassName?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'size-7 rounded-md [&>svg]:size-3.5',
  md: 'size-8 rounded-lg [&>svg]:size-4',
  lg: 'size-10 rounded-xl [&>svg]:size-5',
}

export function IconBox({ icon: Icon, className, iconClassName, size = 'md' }: IconBoxProps) {
  return (
    <div className={cn(
      'inline-flex items-center justify-center shrink-0',
      sizeMap[size],
      className
    )}>
      <Icon className={cn(iconClassName)} />
    </div>
  )
}

// Pre-built gradient presets for each content type / section
export const iconPresets = {
  blog: {
    icon: FileText,
    gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-emerald-500/25 shadow-sm',
    light: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  },
  social: {
    icon: Smartphone,
    gradient: 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-pink-500/25 shadow-sm',
    light: 'bg-pink-50 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400',
  },
  marketing: {
    icon: Megaphone,
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/25 shadow-sm',
    light: 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  },
  email: {
    icon: Mail,
    gradient: 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-sky-500/25 shadow-sm',
    light: 'bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400',
  },
  product: {
    icon: ShoppingBag,
    gradient: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-violet-500/25 shadow-sm',
    light: 'bg-violet-50 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400',
  },
  video: {
    icon: Video,
    gradient: 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-rose-500/25 shadow-sm',
    light: 'bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
  },
  repurpose: {
    icon: RefreshCw,
    gradient: 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-teal-500/25 shadow-sm',
    light: 'bg-teal-50 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400',
  },
  batch: {
    icon: Package,
    gradient: 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-cyan-500/25 shadow-sm',
    light: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400',
  },
  templates: {
    icon: LayoutTemplate,
    gradient: 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/25 shadow-sm',
    light: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400',
  },
  library: {
    icon: Library,
    gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/25 shadow-sm',
    light: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  },
  calendar: {
    icon: CalendarDays,
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/25 shadow-sm',
    light: 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  },
  analytics: {
    icon: BarChart3,
    gradient: 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-fuchsia-500/25 shadow-sm',
    light: 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/40 dark:text-fuchsia-400',
  },
  create: {
    icon: Sparkles,
    gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/25 shadow-sm',
    light: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  },
  factory: {
    icon: Factory,
    gradient: 'bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-emerald-500/25 shadow-sm',
    light: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  },
  lightbulb: {
    icon: Lightbulb,
    gradient: 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-amber-400/25 shadow-sm',
    light: 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  },
  inbox: {
    icon: Inbox,
    gradient: 'bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-gray-400/25 shadow-sm',
    light: 'bg-gray-50 text-gray-500 dark:bg-gray-800/40 dark:text-gray-400',
  },
  instagram: {
    icon: Instagram,
    gradient: 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-pink-500/25 shadow-sm',
    light: 'bg-pink-50 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400',
  },
  twitter: {
    icon: Twitter,
    gradient: 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-sky-400/25 shadow-sm',
    light: 'bg-sky-50 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400',
  },
  linkedin: {
    icon: Linkedin,
    gradient: 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-blue-600/25 shadow-sm',
    light: 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  },
  youtube: {
    icon: Youtube,
    gradient: 'bg-gradient-to-br from-red-500 to-red-700 text-white shadow-red-500/25 shadow-sm',
    light: 'bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-400',
  },
} as const

// Shortcut to render a preset IconBox
interface PresetIconProps {
  preset: keyof typeof iconPresets
  size?: 'sm' | 'md' | 'lg'
  variant?: 'gradient' | 'light'
  className?: string
}

export function PresetIcon({ preset, size = 'md', variant = 'gradient', className }: PresetIconProps) {
  const p = iconPresets[preset]
  return (
    <IconBox
      icon={p.icon}
      size={size}
      className={cn(variant === 'gradient' ? p.gradient : p.light, className)}
    />
  )
}
