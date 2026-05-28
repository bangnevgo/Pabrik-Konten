'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Trash2,
  Clock, CheckCircle, XCircle, Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useContentStore, type ScheduleItem, type HistoryItem } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'

const platformColors: Record<string, string> = {
  instagram: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  twitter: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
  facebook: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  linkedin: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
  tiktok: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
  youtube: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
  email: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
}

const statusIcons: Record<string, React.ReactNode> = {
  queued: <Clock className="size-3 text-amber-500" />,
  sent: <CheckCircle className="size-3 text-emerald-500" />,
  failed: <XCircle className="size-3 text-destructive" />,
}

const DAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

export function ContentCalendar() {
  const { schedules, setSchedules, history, setHistory } = useContentStore()
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedContentId, setSelectedContentId] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('instagram')
  const [selectedTime, setSelectedTime] = useState('09:00')

  const loadSchedules = async () => {
    try {
      const res = await fetch('/api/schedule')
      const data = await res.json()
      setSchedules(data.schedules || [])
    } catch {
      console.error('Gagal memuat jadwal')
    }
  }

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/history')
      const data = await res.json()
      setHistory(data.history || [])
    } catch {
      console.error('Gagal memuat riwayat')
    }
  }

  useEffect(() => {
    loadSchedules()
    loadHistory()
  }, [])

  const handleCreateSchedule = async () => {
    if (!selectedContentId || !selectedPlatform || !selectedDay) return
    try {
      const scheduledAt = new Date(selectedDay)
      const [hours, minutes] = selectedTime.split(':')
      scheduledAt.setHours(parseInt(hours), parseInt(minutes))

      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: selectedContentId,
          platform: selectedPlatform,
          scheduledAt: scheduledAt.toISOString(),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setSchedules([...schedules, data.schedule])
        setScheduleDialogOpen(false)
        toast({ title: 'Jadwal dibuat!', description: 'Konten berhasil dijadwalkan.' })
      }
    } catch {
      toast({ title: 'Gagal', description: 'Tidak dapat membuat jadwal.', variant: 'destructive' })
    }
  }

  const handleDeleteSchedule = async (id: string) => {
    try {
      await fetch(`/api/schedule?id=${id}`, { method: 'DELETE' })
      setSchedules(schedules.filter(s => s.id !== id))
      toast({ title: 'Jadwal dihapus' })
    } catch {
      toast({ title: 'Gagal menghapus', variant: 'destructive' })
    }
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Calendar helpers
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const getSchedulesForDay = (day: number) => {
    return schedules.filter(s => {
      const d = new Date(s.scheduledAt)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })
  }

  const isToday = (day: number) => {
    const today = new Date()
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }

  // Stats
  const totalScheduled = schedules.filter(s => s.status === 'queued').length
  const totalSent = schedules.filter(s => s.status === 'sent').length
  const totalFailed = schedules.filter(s => s.status === 'failed').length

  const platformBreakdown: Record<string, number> = {}
  schedules.forEach(s => {
    platformBreakdown[s.platform] = (platformBreakdown[s.platform] || 0) + 1
  })

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              📅 Kalender Konten
            </h2>
            <p className="text-sm text-muted-foreground">Jadwalkan dan kelola publikasi konten</p>
          </div>
          <Button onClick={() => { setSelectedDay(new Date()); setScheduleDialogOpen(true) }} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Plus className="size-4" /> Jadwalkan Konten
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-amber-200/50 dark:border-amber-900/50">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-amber-600">{totalScheduled}</div>
              <div className="text-xs text-muted-foreground">Dijadwalkan</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-200/50 dark:border-emerald-900/50">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600">{totalSent}</div>
              <div className="text-xs text-muted-foreground">Terkirim</div>
            </CardContent>
          </Card>
          <Card className="border-rose-200/50 dark:border-rose-900/50">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-rose-600">{totalFailed}</div>
              <div className="text-xs text-muted-foreground">Gagal</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Calendar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <Card className="border-emerald-200/50 dark:border-emerald-900/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="size-8" onClick={prevMonth}>
                  <ChevronLeft className="size-4" />
                </Button>
                <h3 className="text-lg font-semibold min-w-[180px] text-center">
                  {MONTHS_ID[month]} {year}
                </h3>
                <Button variant="outline" size="icon" className="size-8" onClick={nextMonth}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={goToToday} className="gap-1.5">
                <CalendarIcon className="size-3.5" /> Hari Ini
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAYS_ID.map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[80px] sm:min-h-[100px] rounded-lg bg-muted/20" />
              ))}
              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const daySchedules = getSchedulesForDay(day)
                const today = isToday(day)

                return (
                  <div
                    key={day}
                    className={`min-h-[80px] sm:min-h-[100px] rounded-lg border p-1.5 cursor-pointer transition-colors hover:border-emerald-300 dark:hover:border-emerald-700 ${
                      today ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20 dark:border-emerald-700' : 'border-muted'
                    }`}
                    onClick={() => { setSelectedDay(new Date(year, month, day)); setScheduleDialogOpen(true) }}
                  >
                    <div className={`text-xs font-medium mb-1 ${today ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {daySchedules.slice(0, 3).map(schedule => (
                        <div
                          key={schedule.id}
                          className={`text-[9px] px-1 py-0.5 rounded truncate ${platformColors[schedule.platform] || 'bg-muted'}`}
                          title={`${schedule.content?.title || 'Konten'} - ${schedule.platform}`}
                        >
                          {statusIcons[schedule.status]}
                          {' '}{schedule.content?.title?.slice(0, 12) || '...'}
                        </div>
                      ))}
                      {daySchedules.length > 3 && (
                        <div className="text-[9px] text-muted-foreground">+{daySchedules.length - 3} lagi</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Schedule List */}
      {schedules.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <Card className="border-emerald-200/50 dark:border-emerald-900/50">
            <CardHeader>
              <CardTitle className="text-sm text-emerald-700 dark:text-emerald-400">Jadwal Mendatang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {schedules
                  .filter(s => s.status === 'queued')
                  .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                  .map(schedule => (
                    <div key={schedule.id} className="flex items-center justify-between gap-3 p-2 rounded-lg border hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Badge variant="secondary" className={`text-[10px] ${platformColors[schedule.platform] || ''}`}>
                            {schedule.platform}
                          </Badge>
                          {statusIcons[schedule.status]}
                        </div>
                        <p className="text-xs font-medium truncate">{schedule.content?.title || 'Konten'}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(schedule.scheduledAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive shrink-0">
                            <Trash2 className="size-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus jadwal?</AlertDialogTitle>
                            <AlertDialogDescription>Jadwal ini akan dihapus.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteSchedule(schedule.id)} className="bg-destructive text-white">
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Jadwalkan Konten</DialogTitle>
          </DialogHeader>
          {selectedDay && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Pilih Konten</Label>
                <Select value={selectedContentId} onValueChange={setSelectedContentId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih dari perpustakaan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {history.slice(0, 30).map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title} ({item.contentType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter / X</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tanggal</Label>
                <div className="text-sm text-muted-foreground">
                  {selectedDay.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Waktu</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map(t => (
                      <SelectItem key={t} value={t}>{t} WIB</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCreateSchedule}
                disabled={!selectedContentId || !selectedPlatform}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Jadwalkan
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
