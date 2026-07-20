'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Video, BarChart3, Clock,
  FileText, Camera, Settings, User,
  Bell, ChevronLeft, Menu, AlertTriangle,
  Cpu,
} from 'lucide-react';
import { MOCK_EMPLOYEE, MOCK_ALERTS } from '@/constants/mockData';

const NAV_ITEMS = [
  { label: 'Console',    icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Live Feed',  icon: Video,            href: '/live' },
  { label: 'Analytics',  icon: BarChart3,        href: '/analytics' },
  { label: 'History',    icon: Clock,            href: '/history' },
  { label: 'Reports',    icon: FileText,         href: '/reports' },
  { label: 'Cameras',    icon: Camera,           href: '/cameras' },
  { label: 'Settings',   icon: Settings,         href: '/settings' },
  { label: 'Profile',    icon: User,             href: '/profile' },
];

interface Props { children: React.ReactNode; title?: string }

export default function DashboardLayout({ children, title }: Props) {
  const pathname  = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const activeAlerts = MOCK_ALERTS.filter(a => a.severity === 'error' || a.severity === 'warning').length;

  return (
    <div className="min-h-screen flex bg-background">

      {/* ─── Sidebar ──────────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 232 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 z-40 h-screen flex flex-col bg-card border-r border-border shadow-sidebar overflow-hidden"
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center flex-shrink-0">
              <Cpu className="w-3.5 h-3.5 text-background" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-semibold tracking-tight truncate"
                >
                  Vantage AI
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href) ?? false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative',
                  active
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Employee footer */}
        <div className="border-t border-border p-3 flex-shrink-0">
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold flex-shrink-0">
              {MOCK_EMPLOYEE.avatarInitials}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0"
                >
                  <div className="text-xs font-semibold text-foreground truncate">{MOCK_EMPLOYEE.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{MOCK_EMPLOYEE.designation}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* ─── Main ─────────────────────────────────────────── */}
      <motion.div
        animate={{ marginLeft: collapsed ? 68 : 232 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {/* Topbar */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur flex items-center justify-between px-5 sticky top-0 z-30 shadow-topbar">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed(c => !c)}
              className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            {title && (
              <h1 className="text-sm font-semibold text-foreground hidden sm:block">{title}</h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Live status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-xs text-muted-foreground">
              <span className="live-dot" />
              System Live · {MOCK_EMPLOYEE.gate}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground relative"
              >
                <Bell className="w-4 h-4" />
                {activeAlerts > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error" />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-10 w-80 rounded-xl border border-border bg-card shadow-modal overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <div className="text-sm font-semibold">Alerts</div>
                      <div className="text-xs text-muted-foreground">{activeAlerts} requiring attention</div>
                    </div>
                    <div className="divide-y divide-border max-h-64 overflow-y-auto">
                      {MOCK_ALERTS.map(alert => (
                        <div key={alert.id} className="px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors">
                          <AlertTriangle className={cn(
                            'w-3.5 h-3.5 mt-0.5 flex-shrink-0',
                            alert.severity === 'error' ? 'text-error' : alert.severity === 'warning' ? 'text-warning' : 'text-info'
                          )} />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-foreground">{alert.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{alert.message}</div>
                            <div className="text-[10px] text-muted-foreground/70 mt-1">{alert.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold flex-shrink-0">
              {MOCK_EMPLOYEE.avatarInitials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
