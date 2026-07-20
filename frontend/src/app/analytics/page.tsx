'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { MOCK_CHART_DATA, MOCK_KPI } from '@/constants/mockData';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const CHART_STYLE = {
  contentStyle: {
    borderRadius: '10px',
    border: '1px solid hsl(var(--border))',
    background: 'hsl(var(--card))',
    color: 'hsl(var(--foreground))',
    fontSize: '11px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
};

function ChartCard({
  title, subtitle, children, delay = 0,
}: { title: string; subtitle?: string; children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-border">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

const PIE_DATA = [
  { name: 'Loaded', value: 845,  color: 'hsl(220,20%,10%)' },
  { name: 'Empty',  value: 587,  color: 'hsl(220,13%,82%)' },
];

const ACCURACY_DATA = MOCK_CHART_DATA.map(d => ({ ...d, target: 95 }));

export default function Analytics() {
  return (
    <DashboardLayout title="Analytics & Trends">
      <div className="mb-8">
        <h1 className="text-display-sm font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Throughput trends, accuracy metrics, and gate activity for today&apos;s shift.
        </p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Detected',   value: '1,432' },
          { label: 'Loaded Vehicles',  value: '845' },
          { label: 'Empty Vehicles',   value: '587' },
          { label: 'Avg Accuracy',     value: '96.4%' },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="p-5 rounded-xl border border-border bg-card"
          >
            <div className="label-xs mb-3">{k.label}</div>
            <div className="text-2xl font-semibold font-mono">{k.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Throughput Over Time" subtitle="Loaded vs Empty vehicles by hour" delay={0.1}>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aLoaded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(220,20%,10%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(220,20%,10%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip {...CHART_STYLE} />
                <Area type="monotone" dataKey="loaded" stroke="hsl(220,20%,10%)" strokeWidth={2} fill="url(#aLoaded)" name="Loaded" dot={false} />
                <Line type="monotone" dataKey="empty"  stroke="hsl(220,10%,65%)" strokeWidth={1.5} dot={false} name="Empty" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Detection Accuracy" subtitle="vs 95% target threshold" delay={0.15}>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ACCURACY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} domain={[90, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip {...CHART_STYLE} />
                <Line type="monotone" dataKey="accuracy" stroke="hsl(220,20%,10%)" strokeWidth={2} dot={{ r: 3 }} name="Accuracy %" />
                <Line type="monotone" dataKey="target"   stroke="hsl(0,72%,51%)"   strokeWidth={1} strokeDasharray="4 4" dot={false} name="Target 95%" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Hourly Distribution" subtitle="Stacked vehicle count" delay={0.2} >
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CHART_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip {...CHART_STYLE} cursor={{ fill: 'hsl(var(--muted))', radius: 4 }} />
                <Bar dataKey="loaded" stackId="a" fill="hsl(220,20%,10%)"  radius={[0,0,4,4]} name="Loaded" />
                <Bar dataKey="empty"  stackId="a" fill="hsl(220,13%,82%)" radius={[4,4,0,0]} name="Empty" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Load Ratio" subtitle="Loaded vs Empty split" delay={0.25}>
          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={80}
                  paddingAngle={3} dataKey="value"
                  animationBegin={200} animationDuration={800}
                >
                  {PIE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...CHART_STYLE} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="System Performance" subtitle="Real-time metrics" delay={0.3}>
          <div className="space-y-4 py-2">
            {[
              { label: 'Inference Speed', value: '28 ms avg', pct: 72 },
              { label: 'Detection FPS',   value: '30.2 fps',  pct: 100 },
              { label: 'Model Accuracy',  value: '96.4%',     pct: 96  },
              { label: 'Camera Uptime',   value: '99.8%',     pct: 99  },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                  <span className="text-xs font-mono font-semibold text-foreground">{m.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-foreground"
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
