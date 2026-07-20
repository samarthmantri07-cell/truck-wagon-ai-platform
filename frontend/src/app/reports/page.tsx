'use client';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { MOCK_VEHICLES } from '@/constants/mockData';
import { FileText, Download, Filter, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const REPORT_LIST = [
  { id: 'RPT-2026-007-20', title: 'Morning Shift Report', period: 'Jul 20, 2026 · 06:00–14:00', type: 'Shift', status: 'ready',  vehicles: 487, accuracy: '96.2%' },
  { id: 'RPT-2026-007-19', title: 'Daily Summary',        period: 'Jul 19, 2026',                type: 'Daily', status: 'ready',  vehicles: 1421, accuracy: '97.1%' },
  { id: 'RPT-2026-007-18', title: 'Daily Summary',        period: 'Jul 18, 2026',                type: 'Daily', status: 'ready',  vehicles: 1388, accuracy: '96.8%' },
  { id: 'RPT-2026-W28',    title: 'Weekly Summary',       period: 'Week 28 · Jul 14–20, 2026',   type: 'Weekly', status: 'ready', vehicles: 9834, accuracy: '96.5%' },
  { id: 'RPT-2026-007-20-N', title: 'Evening Shift Report', period: 'Jul 20, 2026 · 14:00–22:00', type: 'Shift', status: 'generating', vehicles: 0, accuracy: '—' },
];

export default function Reports() {
  return (
    <DashboardLayout title="Reports">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-display-sm font-semibold tracking-tight">Reports</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Shift reports, daily summaries, and compliance exports.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all hover:-translate-y-0.5 active:translate-y-0">
          <FileText className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-border bg-card text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          <Calendar className="w-4 h-4" />
          <span>Date Range</span>
        </div>
        <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-border bg-card text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </div>
      </div>

      {/* Report list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="divide-y divide-border">
          {REPORT_LIST.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="flex items-center justify-between px-6 py-5 hover:bg-muted/30 transition-colors group"
            >
              <div className="flex items-center gap-5 min-w-0">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  r.status === 'ready' ? 'bg-muted' : 'bg-warning/10'
                )}>
                  <FileText className={cn('w-5 h-5', r.status === 'ready' ? 'text-muted-foreground' : 'text-warning')} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.period}</div>
                </div>
              </div>

              <div className="flex items-center gap-8 flex-shrink-0 ml-8">
                <div className="hidden md:block text-right">
                  <div className="text-xs font-mono font-semibold text-foreground">
                    {r.vehicles > 0 ? r.vehicles.toLocaleString() : '—'}
                  </div>
                  <div className="label-xs mt-0.5">vehicles</div>
                </div>
                <div className="hidden lg:block text-right">
                  <div className="text-xs font-mono font-semibold text-foreground">{r.accuracy}</div>
                  <div className="label-xs mt-0.5">accuracy</div>
                </div>
                <div>
                  <span className={cn(
                    'text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full',
                    r.type === 'Shift'  ? 'bg-muted text-muted-foreground' :
                    r.type === 'Daily'  ? 'bg-brand/10 text-brand' :
                    r.type === 'Weekly' ? 'bg-foreground/5 text-foreground' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {r.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {r.status === 'ready' ? (
                    <>
                      <button className="w-8 h-8 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground" title="Download PDF">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="text-xs text-warning font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                      Generating
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
