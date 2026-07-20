'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { MOCK_VEHICLES } from '@/constants/mockData';
import { cn } from '@/lib/utils';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 6;

export default function History() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<'all' | 'Truck' | 'Wagon' | 'Loaded' | 'Empty'>('all');

  const allRows = [...MOCK_VEHICLES, ...MOCK_VEHICLES, ...MOCK_VEHICLES]; // padded for demo
  const filtered = allRows.filter(v => {
    const matchesQuery =
      v.id.toLowerCase().includes(query.toLowerCase()) ||
      v.ocrNumber.toLowerCase().includes(query.toLowerCase()) ||
      v.gate.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      v.type === filter ||
      v.state === filter;
    return matchesQuery && matchesFilter;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

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
            placeholder="Search by ID, OCR or gate..."
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-4 h-9 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'Truck', 'Wagon', 'Loaded', 'Empty'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(0); }}
              className={cn(
                'px-3 h-9 rounded-lg text-sm font-medium transition-colors',
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
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {['Timestamp', 'Vehicle ID', 'Type', 'State', 'OCR Number', 'Gate', 'Confidence', 'Frame', 'Inference'].map(h => (
                  <th key={h} className="label-xs text-left px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((v, i) => (
                <motion.tr
                  key={v.id + i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(v.timestamp).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit', second:'2-digit' })}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs font-semibold text-foreground">{v.id}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{v.type}</td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
                      v.state === 'Loaded'
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {v.state}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-foreground">{v.ocrNumber}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{v.gate}</td>
                  <td className="px-5 py-3 font-mono text-xs text-foreground">{(v.confidence * 100).toFixed(1)}%</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{v.frameNumber.toLocaleString()}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{v.inferenceMs} ms</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
          <span className="text-xs text-muted-foreground">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-muted-foreground">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
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
