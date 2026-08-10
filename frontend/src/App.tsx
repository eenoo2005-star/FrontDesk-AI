import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Activity,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Command,
  Headphones,
  Inbox,
  LayoutDashboard,
  MessageCircle,
  MoreHorizontal,
  Search,
  Settings,
  Sparkles,
  Users,
  Wifi,
  Zap,
} from 'lucide-react'

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const trafficData = [
  { time: '08:00', conversations: 3 },
  { time: '09:00', conversations: 5 },
  { time: '10:00', conversations: 8 },
  { time: '11:00', conversations: 6 },
  { time: '12:00', conversations: 11 },
  { time: '13:00', conversations: 9 },
  { time: '14:00', conversations: 14 },
  { time: '15:00', conversations: 12 },
  { time: '16:00', conversations: 17 },
]

const appointments = [
  {
    time: '09:30',
    name: 'Ahmed Ali',
    service: 'Teeth Cleaning',
    state: 'Confirmed',
  },
  {
    time: '11:00',
    name: 'Sara Khaled',
    service: 'Consultation',
    state: 'Confirmed',
  },
  {
    time: '14:30',
    name: 'Omar Salem',
    service: 'Teeth Cleaning',
    state: 'Pending',
  },
  {
    time: '16:00',
    name: 'Mariam Hassan',
    service: 'Follow-up',
    state: 'Confirmed',
  },
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Conversations', icon: MessageCircle, badge: '06' },
  { label: 'Schedule', icon: CalendarDays },
  { label: 'Customers', icon: Users },
]

function App() {
  const [active, setActive] = useState('Overview')

  return (
    <div className="min-h-screen overflow-hidden bg-[#070807] text-[#F4F5F2]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[28%] top-[-20%] h-[600px] w-[600px] rounded-full bg-lime-300/[0.035] blur-[140px]" />
        <div className="absolute bottom-[-30%] right-[-10%] h-[700px] w-[700px] rounded-full bg-emerald-400/[0.025] blur-[160px]" />
      </div>

      <div className="relative flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-[236px] shrink-0 border-r border-white/[0.06] lg:flex lg:flex-col">
          <div className="flex h-[88px] items-center px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-lime-300/20 bg-lime-300/[0.07]">
                <Command className="h-4 w-4 text-lime-200" />
              </div>

              <div>
                <div className="text-[14px] font-semibold tracking-[-0.01em]">
                  FrontDesk
                </div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-white/30">
                  Intelligence
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pt-8">
            <p className="mb-3 px-3 text-[9px] font-medium uppercase tracking-[0.22em] text-white/25">
              Workspace
            </p>

            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = active === item.label

                return (
                  <button
                    key={item.label}
                    onClick={() => setActive(item.label)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] transition ${
                      isActive
                        ? 'bg-white/[0.07] text-white'
                        : 'text-white/40 hover:bg-white/[0.035] hover:text-white/70'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? 'text-lime-200' : ''
                        }`}
                      />
                      {item.label}
                    </span>

                    {item.badge && (
                      <span className="rounded-full bg-lime-200/10 px-2 py-0.5 text-[9px] text-lime-200">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-white/45">
                  <Sparkles className="h-3.5 w-3.5 text-lime-200" />
                  AI Receptionist
                </div>

                <span className="flex items-center gap-1 text-[9px] text-lime-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-300 shadow-[0_0_10px_rgba(190,242,100,.8)]" />
                  LIVE
                </span>
              </div>

              <div className="text-[22px] font-medium tracking-[-0.04em]">
                98.7%
              </div>

              <div className="mt-1 text-[10px] text-white/30">
                Automation health
              </div>

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-[98%] rounded-full bg-lime-200/70" />
              </div>
            </div>

            <button className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] text-white/35 hover:bg-white/[0.035]">
              <Settings className="h-4 w-4" />
              System settings
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">
          {/* TOP BAR */}
          <header className="flex h-[88px] items-center justify-between border-b border-white/[0.06] px-6 xl:px-9">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                Operations Center
              </p>
              <h1 className="mt-1 text-[16px] font-medium tracking-[-0.02em]">
                Front desk overview
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[10px] text-white/40 md:flex">
                <Wifi className="h-3 w-3 text-lime-200" />
                All systems operational
              </div>

              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.07] text-white/40 hover:text-white">
                <Search className="h-4 w-4" />
              </button>

              <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#E8E8E2] text-[11px] font-semibold text-black">
                SI
              </div>
            </div>
          </header>

          <div className="p-5 xl:p-8">

            {/* HERO */}
            <section className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
              <div>
                <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.19em] text-white/25">
                  <span className="h-px w-7 bg-lime-200/60" />
                  Sunday operations
                </div>

                <h2 className="max-w-[700px] text-[32px] font-light leading-[1.08] tracking-[-0.045em] md:text-[42px]">
                  Your front desk is running
                  <span className="text-white/25"> autonomously.</span>
                </h2>

                <p className="mt-3 max-w-[580px] text-[12px] leading-5 text-white/32">
                  FrontDesk AI is handling conversations, appointment intent,
                  scheduling and customer follow-up across WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-7 border-l border-white/[0.07] pl-6">
                <div>
                  <div className="text-[26px] font-light tracking-[-0.04em]">
                    18
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/25">
                    Conversations
                  </div>
                </div>

                <div>
                  <div className="text-[26px] font-light tracking-[-0.04em]">
                    14
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/25">
                    Booked
                  </div>
                </div>

                <div>
                  <div className="text-[26px] font-light tracking-[-0.04em] text-lime-200">
                    78%
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/25">
                    Conversion
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.45fr_.85fr]">

              {/* LIVE CONVERSATION */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-[#0C0E0C]"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,.7)]" />
                      <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                        Live conversation
                      </span>
                    </div>

                    <div className="mt-2 text-[13px] text-white/65">
                      WhatsApp · Shahin Test
                    </div>
                  </div>

                  <button className="text-white/25 hover:text-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative min-h-[346px] p-6">
                  <div className="absolute bottom-0 left-[50%] h-[200px] w-[360px] -translate-x-1/2 rounded-full bg-lime-200/[0.025] blur-[70px]" />

                  <div className="relative space-y-5">
                    <div className="flex justify-end">
                      <div className="max-w-[78%] rounded-[22px] rounded-br-md bg-white/[0.07] px-5 py-4">
                        <p
                          dir="rtl"
                          className="text-[14px] leading-6 text-white/82"
                        >
                          أريد حجز تنظيف أسنان غداً الساعة السادسة مساءً
                        </p>

                        <div className="mt-2 text-right text-[9px] text-white/22">
                          12:41
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-lime-300/15 bg-lime-300/[0.06]">
                        <Sparkles className="h-3 w-3 text-lime-200" />
                      </div>

                      <div className="max-w-[78%]">
                        <div className="rounded-[22px] rounded-tl-md border border-lime-200/10 bg-lime-200/[0.035] px-5 py-4">
                          <p
                            dir="rtl"
                            className="text-[14px] leading-6 text-white/75"
                          >
                            تم تأكيد حجز تنظيف أسنان غداً في الساعة 18:00.
                          </p>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-[9px] text-white/25">
                          <Zap className="h-3 w-3 text-lime-200" />
                          Intent detected · Appointment booked · 1.2s
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-6 right-6 flex items-center gap-2 border-t border-white/[0.05] pt-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
                      <Headphones className="h-3.5 w-3.5 text-white/30" />
                    </div>

                    <div className="text-[10px] text-white/25">
                      AI handling this conversation automatically
                    </div>

                    <div className="ml-auto flex items-center gap-1 text-[9px] text-lime-200/60">
                      <Activity className="h-3 w-3" />
                      ACTIVE
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* SYSTEM PANEL */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="rounded-[26px] border border-white/[0.07] bg-[#0C0E0C] p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                      Intelligence pulse
                    </p>
                    <p className="mt-2 text-[13px] text-white/65">
                      Automation activity
                    </p>
                  </div>

                  <Activity className="h-4 w-4 text-lime-200" />
                </div>

                <div className="mt-8 h-[145px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                      <defs>
                        <linearGradient
                          id="conversationGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#d9f99d"
                            stopOpacity={0.22}
                          />
                          <stop
                            offset="100%"
                            stopColor="#d9f99d"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <Tooltip
                        cursor={false}
                        contentStyle={{
                          background: '#111311',
                          border: '1px solid rgba(255,255,255,.08)',
                          borderRadius: '12px',
                          fontSize: '10px',
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="conversations"
                        stroke="#d9f99d"
                        strokeWidth={1.5}
                        fill="url(#conversationGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                    <div className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                      Avg response
                    </div>
                    <div className="mt-2 text-[20px] font-light">
                      1.2
                      <span className="ml-1 text-[10px] text-white/25">sec</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.055] bg-white/[0.025] p-4">
                    <div className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                      AI resolved
                    </div>
                    <div className="mt-2 text-[20px] font-light">
                      94
                      <span className="ml-1 text-[10px] text-white/25">%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3 border-t border-white/[0.055] pt-5">
                  {[
                    ['WhatsApp Cloud', 'Connected'],
                    ['Ollama / Qwen', 'Online'],
                    ['Laravel API', 'Healthy'],
                    ['PostgreSQL', 'Healthy'],
                  ].map(([label, state]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[10px] text-white/35">{label}</span>

                      <span className="flex items-center gap-1.5 text-[9px] text-white/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-lime-300/80" />
                        {state}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* BOTTOM */}
            <section className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">
              <div className="rounded-[26px] border border-white/[0.07] bg-[#0C0E0C] p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                      Today
                    </p>
                    <h3 className="mt-2 text-[14px] text-white/70">
                      Appointment flow
                    </h3>
                  </div>

                  <button className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white">
                    Full schedule
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="space-y-1">
                  {appointments.map((appointment, index) => (
                    <div
                      key={appointment.time}
                      className="group grid grid-cols-[70px_1fr_auto] items-center rounded-xl px-2 py-3 transition hover:bg-white/[0.025]"
                    >
                      <div className="font-mono text-[11px] text-white/28">
                        {appointment.time}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                          <div className="h-2 w-2 rounded-full border border-white/20 bg-[#0C0E0C]" />

                          {index !== appointments.length - 1 && (
                            <div className="absolute left-1 top-2 h-8 w-px bg-white/[0.06]" />
                          )}
                        </div>

                        <div>
                          <div className="text-[12px] text-white/70">
                            {appointment.name}
                          </div>
                          <div className="mt-0.5 text-[9px] text-white/24">
                            {appointment.service}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[8px] ${
                          appointment.state === 'Confirmed'
                            ? 'bg-lime-200/[0.06] text-lime-100/60'
                            : 'bg-white/[0.04] text-white/30'
                        }`}
                      >
                        {appointment.state === 'Confirmed' && (
                          <Check className="h-2.5 w-2.5" />
                        )}

                        {appointment.state}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-white/[0.07] bg-[#0C0E0C] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                      Next appointment
                    </p>
                    <div className="mt-3 text-[28px] font-light tracking-[-0.05em]">
                      14:30
                    </div>
                  </div>

                  <Clock3 className="h-4 w-4 text-white/25" />
                </div>

                <div className="mt-6 border-t border-white/[0.06] pt-5">
                  <div className="text-[13px] text-white/70">Omar Salem</div>
                  <div className="mt-1 text-[10px] text-white/30">
                    Teeth Cleaning · 60 min
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime-200/[0.06]">
                      <Inbox className="h-3 w-3 text-lime-200" />
                    </div>

                    <div>
                      <div className="text-[9px] text-white/45">
                        Booked by FrontDesk AI
                      </div>
                      <div className="text-[8px] text-white/20">
                        via WhatsApp
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App