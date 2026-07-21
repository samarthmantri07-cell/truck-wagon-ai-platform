'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import { Search, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { useDetectionsHistory } from '@/hooks/useDetections';

const PAGE_SIZE = 10;

export default function History() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'truck' | 'wagon' | 'loaded' | 'empty'>('all');

  const getClassNameFilter = () => {
    if (filter === 'all') return undefined;
    if (filter === 'loaded') return 'loaded';
    if (filter === 'empty') return 'empty';
    if (filter === 'truck') return 'truck';
    if (filter === 'wagon') return 'wagon';
    return undefined;
  };

  const { data, isLoading } = useDetectionsHistory({
    page,
    limit: PAGE_SIZE,
    search: query || undefined,
    className: getClassNameFilter(),
  });

  const totalPages = data?.totalPages || 1;
  const rows = data?.data || [];

  return (
    <DashboardLayout title="Detection History">
      <div className="mb-8">
        <h1 className="text-display-sm font-semibold tracking-tight">History</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Complete log of all vehicle detections with full metadata.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search classes..."
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 h-9 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'truck', 'wagon', 'loaded', 'empty'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={cn(
                'px-3 h-9 rounded-lg text-sm font-medium transition-colors capitalize',
                filter === f
                  ? 'bg-foreground text-background'
                  : 'border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-border bg-card overflow-hidden relative"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Activity className="w-8 h-8 text-foreground animate-spin mb-2" />
            <div className="text-sm font-mono text-muted-foreground">Loading history...</div>
          </div>
        )}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Timestamp', 'Detection ID', 'Class', 'State', 'Confidence', 'Time (ms)'].map(h => (
                  <th key={h} className="label-xs text-left px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((v, i) => {
                const primaryObj = v.objects[0];
                const isLoaded = primaryObj?.className?.includes('loaded');
                
                return (
                  <motion.tr
                    key={v.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(v.createdAt).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit', second:'2-digit' })}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-foreground">{v.id.split('-')[0]}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground capitalize">{primaryObj?.className || 'Unknown'}</td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                        isLoaded
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      )}>
                        {isLoaded ? 'Loaded' : 'Empty'}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-foreground">
                      {primaryObj?.confidence ? `${(primaryObj.confidence * 100).toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{v.processingTimeMs}</td>
                  </motion.tr>
                );
              })}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    No detections found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
          <span className="text-xs text-muted-foreground">
            Showing Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-muted-foreground">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
