'use client';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { FileText, Download, Filter, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReports, useGenerateReport } from '@/hooks/useReports';

export default function Reports() {
  const { data: reports, isLoading } = useReports();
  const { mutate: generateReport, isPending } = useGenerateReport();

  const handleDownload = (filePath: string, filename: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const url = `${baseUrl}${filePath}`;
    
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout title="Reports">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-display-sm font-semibold tracking-tight">Inspection Reports</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Automated AI inspection reports and compliance exports.
          </p>
        </div>
        <button 
          onClick={() => generateReport()}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          {isPending ? (
            <div className="w-4 h-4 rounded-full border-2 border-background border-t-transparent animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          {isPending ? 'Generating...' : 'Generate Report'}
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
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading reports...</div>
          ) : !reports || reports.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No reports generated yet. Click 'Generate Report' to create one.</div>
          ) : (
            reports.map((r, i) => {
              const dateStr = new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
              const timeStr = new Date(r.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              const filename = r.filePath.split('/').pop() || 'Inspection_Report.pdf';
              
              return (
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
                      r.inspectionStatus === 'PASSED' ? 'bg-muted' : 'bg-warning/10'
                    )}>
                      <FileText className={cn('w-5 h-5', r.inspectionStatus === 'PASSED' ? 'text-muted-foreground' : 'text-warning')} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">{r.reportId}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{dateStr} &middot; {timeStr}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 flex-shrink-0 ml-8">
                    <div className="hidden md:block text-right">
                      <div className="text-xs font-mono font-semibold text-foreground">
                        {(r.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="label-xs mt-0.5">confidence</div>
                    </div>
                    
                    <div>
                      <span className={cn(
                        'text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full',
                        r.inspectionStatus === 'PASSED' ? 'bg-brand/10 text-brand' : 'bg-warning/10 text-warning'
                      )}>
                        {r.inspectionStatus}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                        {r.vehicleType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDownload(r.filePath, filename)}
                        className="w-8 h-8 rounded-lg border border-border hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground" 
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
