'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { MOCK_CHART_DATA } from '@/constants/mockData';
import {
  AreaChart, Area,
  LineChart, Line,
  BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

/* ─── Design tokens ─────────────────────────────────────────
   Professional enterprise palette — balanced, not over-saturated.
   ─────────────────────────────────────────────────────────── */
const COLORS = {
  blue:   '#3B82F6',
  green:  '#10B981',
  orange: '#F59E0B',
  red:    '#EF4444',
  purple: '#8B5CF6',
  cyan:   '#06B6D4',
  slate:  '#64748B',
};

const TOOLTIP_STYLE = {
  contentStyle: {
    borderRadius: '12px',
    border: '1px solid hsl(var(--border))',
    background: 'hsl(var(--card))',
    color: 'hsl(var(--foreground))',
    fontSize: '12px',
    boxShadow: '0 12px 40px -8px rgba(0,0,0,0.15)',
    padding: '10px 14px',
  },
  itemStyle: { padding: '2px 0' },
  labelStyle: { fontWeight: 600, marginBottom: 4 },
};

/* ─── Animated count-up number ──────────────────────────────── */
function CountUp({ target, suffix = '', duration = 1200 }: {
  target: number; suffix?: string; duration?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

/* ─── Chart wrapper with scroll reveal ──────────────────────── */
function ChartCard({
  title,
  subtitle,
  children,
  delay = 0,
  accent,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
  accent?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-border flex items-center gap-3">
        {accent && (
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: accent }} />
        )}
        <div>
          <div className="text-sm font-semibold text-foreground">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

/* ─── Custom tooltip ─────────────────────────────────────────── */
const PremiumTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card shadow-modal px-4 py-3 text-xs min-w-[130px]">
      <p className="font-semibold text-foreground mb-2 text-[11px] uppercase tracking-wide">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
            <span className="text-muted-foreground">{entry.name}</span>
          </div>
          <span className="font-mono font-semibold text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Progress bar metric ─────────────────────────────────────── */
function ProgressMetric({ label, value, pct, color }: {
  label: string; value: string; pct: number; color: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-mono font-semibold text-foreground">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

/* ─── Pie chart data ─────────────────────────────────────────── */
const PIE_DATA = [
  { name: 'Loaded',    value: 845,  color: COLORS.blue   },
  { name: 'Empty',     value: 587,  color: COLORS.slate  },
];

const GATE_DATA = [
  { name: 'Gate A',    value: 489,  color: COLORS.blue   },
  { name: 'Gate B',    value: 312,  color: COLORS.green  },
  { name: 'Gate C',    value: 198,  color: COLORS.orange },
  { name: 'Rail Yard', value: 433,  color: COLORS.purple },
];

/* radar data */
const RADAR_DATA = [
  { metric: 'Accuracy',  value: 96 },
  { metric: 'Speed',     value: 88 },
  { metric: 'Uptime',    value: 99 },
  { metric: 'OCR Rate',  value: 92 },
  { metric: 'Coverage',  value: 85 },
  { metric: 'Alerts',    value: 78 },
];

/* ─── Multi-series chart data ─────────────────────────────────── */
const MULTI_DATA = MOCK_CHART_DATA.map((d, i) => ({
  ...d,
  trucks:  Math.round(d.loaded * 0.65),
  wagons:  Math.round(d.loaded * 0.35),
  alerts:  [0, 1, 0, 2, 0, 0, 1][i] || 0,
  accuracy: d.accuracy,
}));

/* ─── Custom pie label ──────────────────────────────────────── */
const renderCustomLabel = ({
  cx, cy, midAngle, outerRadius, name, value,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="hsl(var(--muted-foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>
      {name} ({value})
    </text>
  );
};

/* ════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Analytics() {
  return (
    <DashboardLayout title="Analytics & Trends">

      {/* ── Page Header ── */}
      <div className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-display-sm font-semibold tracking-tight"
        >
          Analytics
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-1 text-body-sm text-muted-foreground"
        >
          Throughput trends, accuracy metrics, and gate activity — updated every shift.
        </motion.p>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Detected',  value: 1432, suffix: '',   color: COLORS.blue,   delay: 0    },
          { label: 'Loaded Vehicles', value: 845,  suffix: '',   color: COLORS.green,  delay: 0.07 },
          { label: 'Empty Vehicles',  value: 587,  suffix: '',   color: COLORS.orange, delay: 0.14 },
          { label: 'Avg Accuracy',    value: 96,   suffix: '.4%',color: COLORS.purple, delay: 0.21 },
        ].map((k) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: k.delay, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="p-5 rounded-xl border border-border bg-card"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: k.color }} />
              <span className="label-xs">{k.label}</span>
            </div>
            <div className="text-2xl font-semibold font-mono text-foreground">
              <CountUp target={k.value} suffix={k.suffix} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Row 1: Throughput Area + Accuracy Line ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

        <ChartCard
          title="Throughput Over Time"
          subtitle="Loaded vs Empty vehicles per hour"
          accent={COLORS.blue}
          delay={0.05}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MULTI_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS.blue}  stopOpacity={0.2} />
                    <stop offset="95%" stopColor={COLORS.blue}  stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="gradOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS.orange} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={COLORS.orange} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip content={<PremiumTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: 8 }} />
                <Area type="monotone" dataKey="loaded" stroke={COLORS.blue}   strokeWidth={2.5} fill="url(#gradBlue)"   name="Loaded" dot={false} animationDuration={1200} />
                <Area type="monotone" dataKey="empty"  stroke={COLORS.orange} strokeWidth={2}   fill="url(#gradOrange)" name="Empty"  dot={false} animationDuration={1400} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Detection Accuracy"
          subtitle="% accuracy vs 95% target threshold"
          accent={COLORS.purple}
          delay={0.12}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MULTI_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} domain={[90, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip content={<PremiumTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: 8 }} />
                <Line
                  type="monotone" dataKey="accuracy" stroke={COLORS.purple} strokeWidth={2.5}
                  dot={{ fill: COLORS.purple, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                  name="Accuracy %" animationDuration={1400}
                />
                <Line
                  type="monotone" dataKey={() => 95} stroke={COLORS.red} strokeWidth={1.5}
                  strokeDasharray="5 5" dot={false} name="Target 95%"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ── Row 2: Stacked Bar + Truck vs Wagon Line ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

        <ChartCard
          title="Hourly Vehicle Distribution"
          subtitle="Trucks vs Wagons stacked by hour"
          accent={COLORS.green}
          delay={0.18}
        >
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MULTI_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip content={<PremiumTooltip />} cursor={{ fill: 'hsl(var(--muted))', radius: 6 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: 8 }} />
                <Bar dataKey="trucks" stackId="a" fill={COLORS.blue}  radius={[0,0,4,4]} name="Trucks"  animationDuration={1000} />
                <Bar dataKey="wagons" stackId="a" fill={COLORS.cyan}  radius={[4,4,0,0]} name="Wagons"  animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Gate Activity Breakdown"
          subtitle="Vehicles processed per gate today"
          accent={COLORS.orange}
          delay={0.24}
        >
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={GATE_DATA}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={70} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip content={<PremiumTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar dataKey="value" radius={[0,6,6,0]} name="Vehicles" animationDuration={1000}>
                  {GATE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ── Row 3: Pie + Radar + Performance bars ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <ChartCard title="Load Ratio" subtitle="Loaded vs Empty split" accent={COLORS.blue} delay={0.3}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%" cy="50%"
                  innerRadius={52} outerRadius={76}
                  paddingAngle={4}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                  animationBegin={300}
                  animationDuration={1000}
                >
                  {PIE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<PremiumTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="System Health Radar" subtitle="Operational metrics" accent={COLORS.cyan} delay={0.36}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius={70}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Radar
                  dataKey="value"
                  stroke={COLORS.cyan}
                  fill={COLORS.cyan}
                  fillOpacity={0.15}
                  strokeWidth={2}
                  animationDuration={1000}
                />
                <Tooltip content={<PremiumTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="System Performance" subtitle="Real-time KPI meters" delay={0.42}>
          <div className="space-y-4 py-1">
            {[
              { label: 'Inference Speed',   value: '28 ms avg',  pct: 88,  color: COLORS.blue   },
              { label: 'Detection FPS',     value: '30.2 fps',   pct: 100, color: COLORS.green  },
              { label: 'Model Accuracy',    value: '96.4%',      pct: 96,  color: COLORS.purple },
              { label: 'Camera Uptime',     value: '99.8%',      pct: 99,  color: COLORS.cyan   },
              { label: 'OCR Success Rate',  value: '94.1%',      pct: 94,  color: COLORS.orange },
            ].map((m) => (
              <ProgressMetric key={m.label} {...m} />
            ))}
          </div>
        </ChartCard>
      </div>

    </DashboardLayout>
  );
}
