'use client';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Truck, Activity, Eye, FileText, Shield, Zap,
  BarChart3, Camera, ArrowRight, ChevronDown,
  Cpu, Radio, Database, GitMerge, CheckCircle2,
} from 'lucide-react';
import { MOCK_CHART_DATA, MOCK_KPI } from '@/constants/mockData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';

/* ─── Helpers ────────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="label-xs text-brand mb-5">{children}</p>
  );
}

/* ─── Nav ─────────────────────────────────────────────────── */
function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 md:px-16 h-16 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <span className="font-semibold text-base tracking-tight">Vantage AI</span>
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#platform" className="hover:text-foreground transition-colors">Platform</a>
        <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
        <a href="#analytics" className="hover:text-foreground transition-colors">Analytics</a>
        <a href="#applications" className="hover:text-foreground transition-colors">Applications</a>
      </div>
      <Link
        href="/login"
        className="text-sm font-medium px-4 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors"
      >
        Employee Login
      </Link>
    </nav>
  );
}

/* ─── Hero ─────────────────────────────────────────────────── */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Subtle grid backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: 0.35,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background pointer-events-none" />

      <motion.div style={{ opacity, y }} className="relative z-10 max-w-5xl mx-auto">
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground mb-10"
        >
          <span className="live-dot" />
          System Operational · {MOCK_KPI.activeCameras} cameras active
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-display-xl md:text-display-2xl font-semibold tracking-tight text-foreground text-balance leading-[1.05]"
        >
          Next Generation<br />
          <span className="text-muted-foreground font-normal">AI Vehicle Detection</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 text-body-xl text-muted-foreground max-w-2xl mx-auto text-balance"
        >
          Industrial Computer Vision Platform for real-time Truck & Wagon detection,
          OCR recognition, and operational analytics.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="#platform"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Explore Platform <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Employee Login
          </Link>
          <a
            href="#analytics"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View Demo
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-20 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Stats Strip ─────────────────────────────────────────── */
function StatsStrip() {
  const stats = [
    { label: 'Vehicles Detected Today', value: '1,432' },
    { label: 'Detection Accuracy', value: '96.4%' },
    { label: 'Active Cameras', value: '6' },
    { label: 'System Uptime', value: '99.8%' },
  ];
  return (
    <section className="border-y border-border bg-card">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-px">
        {stats.map((s, i) => (
          <FadeUp key={s.label} delay={i * 0.08} className="px-8 py-4 text-center first:pl-0 last:pr-0">
            <div className="text-display-sm font-semibold font-mono text-foreground">{s.value}</div>
            <div className="mt-1 text-body-sm text-muted-foreground">{s.label}</div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ─── Platform Section ─────────────────────────────────────── */
function Platform() {
  const items = [
    {
      icon: Eye,
      title: 'Real-Time Detection',
      desc: 'AI-powered vision identifies trucks and wagons in milliseconds. Every vehicle classified the instant it enters the frame.',
    },
    {
      icon: Truck,
      title: 'Load Classification',
      desc: 'Automatically distinguishes loaded from empty vehicles with 96%+ accuracy — eliminating manual inspection entirely.',
    },
    {
      icon: Camera,
      title: 'OCR Recognition',
      desc: 'Reads vehicle license plates and wagon numbers in real time. Integrated with gate control systems for automated logging.',
    },
    {
      icon: BarChart3,
      title: 'Operational Analytics',
      desc: 'Throughput trends, gate activity, shift reports, and anomaly detection — all in one unified dashboard.',
    },
    {
      icon: Shield,
      title: 'Industrial Security',
      desc: 'Unauthorized vehicle alerts, perimeter breach detection, and real-time supervisor notifications.',
    },
    {
      icon: FileText,
      title: 'Automated Reports',
      desc: 'Shift reports, daily summaries, and compliance documents generated automatically. Export to PDF or Excel.',
    },
  ];

  return (
    <section id="platform" className="py-36 px-6 max-w-7xl mx-auto">
      <FadeUp className="text-center mb-24">
        <SectionLabel>The Platform</SectionLabel>
        <h2 className="text-display-md font-semibold text-foreground text-balance">
          One platform. Complete visibility.
        </h2>
        <p className="mt-5 text-body-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          Every gate. Every vehicle. Every shift. Monitored, classified, and
          logged — automatically.
        </p>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <FadeUp key={item.title} delay={i * 0.07}>
            <div className="group p-8 rounded-2xl border border-border bg-card card-hover h-full">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:bg-brand/10 transition-colors">
                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ─── How AI Works ─────────────────────────────────────────── */
function HowAIWorks() {
  const steps = [
    { icon: Camera,   label: 'Camera Input',     desc: 'RTSP / USB cameras stream live video' },
    { icon: Cpu,      label: 'AI Inference',      desc: 'YOLOv8 model detects vehicles in real time' },
    { icon: GitMerge, label: 'Classification',    desc: 'Loaded vs Empty determined at 96%+ accuracy' },
    { icon: Radio,    label: 'OCR Extraction',    desc: 'License plates and wagon IDs extracted' },
    { icon: Database, label: 'Data Logging',      desc: 'Events stored with full metadata' },
    { icon: FileText, label: 'Reports',           desc: 'Automated shift and compliance reports' },
  ];

  return (
    <section id="how-it-works" className="py-36 bg-muted/40 border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-24">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-display-md font-semibold text-balance">
            From camera to report in under 50ms.
          </h2>
          <p className="mt-5 text-body-lg text-muted-foreground max-w-xl mx-auto text-balance">
            A complete pipeline — no human in the loop required.
          </p>
        </FadeUp>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-8 left-[calc(8.33%+20px)] right-[calc(8.33%+20px)] h-px bg-border" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {steps.map((step, i) => (
              <FadeUp key={step.label} delay={i * 0.1} className="text-center">
                <div className="relative mx-auto mb-5 w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center shadow-card">
                  <step.icon className="w-7 h-7 text-foreground" />
                  <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">{step.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{step.desc}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Analytics Preview ─────────────────────────────────────── */
function AnalyticsPreview() {
  return (
    <section id="analytics" className="py-36 px-6 max-w-7xl mx-auto">
      <FadeUp className="text-center mb-24">
        <SectionLabel>Analytics</SectionLabel>
        <h2 className="text-display-md font-semibold text-balance">
          Intelligence built into every shift.
        </h2>
        <p className="mt-5 text-body-lg text-muted-foreground max-w-xl mx-auto text-balance">
          Real-time throughput, accuracy trends, and gate activity — all at a glance.
        </p>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-border">
            <div>
              <div className="text-sm font-semibold text-foreground">Throughput · Today</div>
              <div className="text-xs text-muted-foreground mt-0.5">Loaded vs Empty vehicles by hour</div>
            </div>
            <div className="flex items-center gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-foreground inline-block" />Loaded</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-muted-foreground inline-block" />Empty</span>
            </div>
          </div>

          <div className="h-72 p-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradLoaded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(220,20%,10%)" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="hsl(220,20%,10%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradEmpty" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(220,10%,60%)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="hsl(220,10%,60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid hsl(var(--border))',
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="loaded" stroke="hsl(220,20%,10%)" strokeWidth={2} fill="url(#gradLoaded)" name="Loaded" dot={false} />
                <Area type="monotone" dataKey="empty"  stroke="hsl(220,10%,60%)" strokeWidth={2} fill="url(#gradEmpty)"  name="Empty"  dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-4 divide-x divide-border border-t border-border">
            {[
              { label: 'Total Detected', value: '1,432' },
              { label: 'Loaded', value: '845' },
              { label: 'Empty', value: '587' },
              { label: 'Avg Accuracy', value: '96.4%' },
            ].map((k) => (
              <div key={k.label} className="px-6 py-4 text-center">
                <div className="text-lg font-semibold font-mono text-foreground">{k.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{k.label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  );
}

/* ─── Applications ─────────────────────────────────────────── */
function Applications() {
  const apps = [
    { name: 'Logistics Yards',    desc: 'Track every truck entering and leaving. Automate gate logs.' },
    { name: 'Railway Terminals',  desc: 'Monitor wagon loads in real time. OCR wagon IDs automatically.' },
    { name: 'Manufacturing Plants', desc: 'Track raw material delivery and finished goods dispatch.' },
    { name: 'Warehouses',         desc: 'Complete inbound / outbound vehicle visibility at all docks.' },
    { name: 'Border Security',    desc: 'Identify and flag unauthorized vehicles at controlled checkpoints.' },
  ];

  return (
    <section id="applications" className="py-36 bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="mb-24">
          <p className="label-xs text-background/40 mb-5">Industrial Applications</p>
          <h2 className="text-display-md font-semibold text-balance max-w-xl">
            Built for the real world.
          </h2>
          <p className="mt-5 text-body-lg text-background/60 max-w-lg text-balance">
            Deployed across logistics, rail, and manufacturing environments where
            precision and uptime are non-negotiable.
          </p>
        </FadeUp>

        <div className="space-y-px">
          {apps.map((app, i) => (
            <FadeUp key={app.name} delay={i * 0.08}>
              <div className="group flex items-start justify-between py-7 border-t border-background/10 hover:border-background/30 transition-colors cursor-default">
                <div className="flex items-start gap-8">
                  <span className="text-sm font-mono text-background/30 mt-0.5 w-6">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="text-base font-semibold text-background mb-1">{app.name}</div>
                    <div className="text-body-sm text-background/50">{app.desc}</div>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-background/20 group-hover:text-background/60 transition-colors flex-shrink-0 mt-0.5" />
              </div>
            </FadeUp>
          ))}
          <div className="border-t border-background/10" />
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ──────────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="py-36 px-6">
      <FadeUp className="max-w-4xl mx-auto text-center">
        <SectionLabel>Ready to deploy</SectionLabel>
        <h2 className="text-display-lg font-semibold text-balance">
          Modernize your industrial<br />vehicle monitoring.
        </h2>
        <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto text-balance">
          Enterprise-grade AI detection with zero manual intervention.
          Purpose-built for industrial environments.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Employee Login <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#platform"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all"
          >
            Explore Platform
          </a>
        </div>
      </FadeUp>
    </section>
  );
}

/* ─── Footer ───────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground text-sm">Vantage AI</span>
        <span>Industrial Vehicle Detection Platform — Enterprise Edition</span>
        <span>&copy; 2026 Vantage AI. All rights reserved.</span>
      </div>
    </footer>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <StatsStrip />
      <Platform />
      <HowAIWorks />
      <AnalyticsPreview />
      <Applications />
      <CTA />
      <Footer />
    </div>
  );
}
