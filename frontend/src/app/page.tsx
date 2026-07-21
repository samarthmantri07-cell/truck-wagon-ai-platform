'use client';

import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Eye, FileText, Shield, BarChart3, Camera, ArrowRight,
  ChevronDown, Cpu, Radio, Database, GitMerge, CheckCircle2, Truck,
} from 'lucide-react';
import { MOCK_CHART_DATA, MOCK_KPI } from '@/constants/mockData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import HeroScene from '@/components/hero/HeroScene';

/* ═══════════════════════════════════════════════════════════════
   TITLE REVEAL — Cinematic word-by-word clip animation
   ══════════════════════════════════════════════════════════════ */
function WordReveal({ text, delay = 0, className = '' }: {
  text: string; delay?: number; className?: string;
}) {
  return (
    <span className={`${className} inline`} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden leading-tight mr-[0.22em] last:mr-0">
          <motion.span
            className="inline-block"
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAV
   ══════════════════════════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 md:px-16 h-16 transition-all duration-500 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-topbar'
          : 'bg-transparent'
      }`}
    >
      <span className="font-semibold text-base tracking-tight">Vantage AI</span>
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        {['platform', 'how-it-works', 'analytics', 'applications'].map(id => (
          <a key={id} href={`#${id}`} className="hover:text-foreground transition-colors capitalize">
            {id.replace('-', ' ')}
          </a>
        ))}
      </div>
      <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-all hover:-translate-y-px">
        Employee Login
      </Link>
    </motion.nav>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO — The crown jewel
   ══════════════════════════════════════════════════════════════ */
function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  /* Scroll parallax */
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const textY    = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const bgScale  = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroOpa  = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scrollZ  = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /* Mouse spring physics */
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const springX = useSpring(rawX, { stiffness: 35, damping: 18, mass: 0.6 });
  const springY = useSpring(rawY, { stiffness: 35, damping: 18, mass: 0.6 });

  /* Title parallax */
  const titleX = useTransform(springX, [0, 1], [-10, 10]);
  const titleY = useTransform(springY, [0, 1], [-5,  5]);

  /* Button tilt */
  const btnRX = useTransform(springY, [0, 1], [ 4, -4]);
  const btnRY = useTransform(springX, [0, 1], [-5,  5]);

  const [mp, setMp] = useState({ x: 0.5, y: 0.5 });
  const [sz, setSz] = useState(0);

  useEffect(() => scrollZ.on('change', v => setSz(v)), [scrollZ]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (!r) return;
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top)  / r.height;
    rawX.set(nx); rawY.set(ny);
    setMp({ x: nx, y: ny });
  }, [rawX, rawY]);

  return (
    <section
      ref={heroRef}
      onMouseMove={onMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* ── ALL BACKGROUND LAYERS (behind everything) ── */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: bgScale, willChange: 'transform' }}
      >
        <HeroScene />
        
        {/* Bottom gradient into page to blend 3D canvas smoothly into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[hsl(40,20%,97%)] to-transparent pointer-events-none z-10" />
      </motion.div>

      {/* ── FOREGROUND — Title + CTA ── */}
      <motion.div
        style={{ y: textY, opacity: heroOpa, willChange: 'transform, opacity' }}
        className="relative z-10 px-6 max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.84, y: 12 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-white/50 backdrop-blur-md text-xs font-medium text-muted-foreground mb-14 shadow-sm"
        >
          <span className="live-dot" />
          System Operational &nbsp;·&nbsp; {MOCK_KPI.activeCameras} cameras active
        </motion.div>

        {/* Headline — two-line, word-by-word reveal */}
        <motion.div style={{ x: titleX, y: titleY, willChange: 'transform' }}>
          <h1 className="text-display-xl md:text-display-2xl font-semibold tracking-tight text-balance leading-[1.04]">
            {/* Line 1 */}
            <span className="block">
              <WordReveal text="Next Generation" delay={0.30} />
            </span>
            {/* Line 2 — muted, clip reveal */}
            <span className="block overflow-hidden mt-1">
              <motion.span
                className="block text-muted-foreground font-normal text-shimmer"
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%',   opacity: 1 }}
                transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              >
                AI Vehicle Detection
              </motion.span>
            </span>
          </h1>
        </motion.div>

        {/* Decorative expanding line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 w-20 h-px origin-center"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(59,118,240,0.5), transparent)' }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.85, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-body-xl text-muted-foreground max-w-2xl text-balance"
        >
          Industrial Computer Vision Platform for real-time Truck &amp; Wagon
          detection, OCR recognition, and operational analytics.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.75, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {/* Primary — has tilt + glow */}
          <motion.a
            href="#platform"
            style={{
              rotateX: btnRX,
              rotateY: btnRY,
              transformPerspective: 700,
              willChange: 'transform',
            }}
            whileHover={{ scale: 1.04, y: -3, boxShadow: '0 8px 32px rgba(59,118,240,0.25)' }}
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-foreground text-background text-sm font-medium shadow-md"
          >
            Explore Platform <ArrowRight className="w-4 h-4" />
          </motion.a>

          {/* Secondary */}
          <motion.div
            whileHover={{ scale: 1.025, y: -2 }}
            whileTap={{ scale: 0.975 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border bg-white/60 backdrop-blur-md text-foreground text-sm font-medium hover:bg-white/80 transition-colors"
            >
              Employee Login
            </Link>
          </motion.div>

          {/* Ghost */}
          <motion.a
            href="#analytics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            whileHover={{ x: 3 }}
            className="inline-flex items-center gap-1 px-3 py-3.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View Demo
          </motion.a>
        </motion.div>

        {/* Scroll nudge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.9 }}
          className="mt-24 flex flex-col items-center gap-2 text-muted-foreground/50"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED HELPERS — for sections below
   ══════════════════════════════════════════════════════════════ */
function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
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

function SectionLabel({ children, light = false }: {
  children: React.ReactNode; light?: boolean;
}) {
  return <p className={`label-xs mb-5 ${light ? 'text-background/40' : 'text-brand'}`}>{children}</p>;
}

function CinemaSection({ id, children, className = '' }: {
  id?: string; children: React.ReactNode; className?: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0.3]);
  const y       = useTransform(scrollYProgress, [0, 0.15], [40, 0]);
  return (
    <motion.section id={id} ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BELOW-HERO SECTIONS (unchanged)
   ══════════════════════════════════════════════════════════════ */
function StatsStrip() {
  const stats = [
    { label: 'Vehicles Detected Today', value: '1,432' },
    { label: 'Detection Accuracy',      value: '96.4%' },
    { label: 'Active Cameras',          value: '6'     },
    { label: 'System Uptime',           value: '99.8%' },
  ];
  return (
    <CinemaSection className="border-y border-border bg-card/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <FadeUp key={s.label} delay={i * 0.08} className="px-8 py-4 text-center border-r border-border last:border-0">
            <div className="text-display-sm font-semibold font-mono text-foreground">{s.value}</div>
            <div className="mt-1 text-body-sm text-muted-foreground">{s.label}</div>
          </FadeUp>
        ))}
      </div>
    </CinemaSection>
  );
}

function Platform() {
  const items = [
    { icon: Eye,       title: 'Real-Time Detection',   desc: 'AI-powered vision identifies trucks and wagons in milliseconds. Every vehicle classified the instant it enters the frame.' },
    { icon: Truck,     title: 'Load Classification',   desc: 'Automatically distinguishes loaded from empty vehicles with 96%+ accuracy — eliminating manual inspection entirely.' },
    { icon: Camera,    title: 'OCR Recognition',       desc: 'Reads vehicle license plates and wagon numbers in real time. Integrated with gate control for automated logging.' },
    { icon: BarChart3, title: 'Operational Analytics', desc: 'Throughput trends, gate activity, shift reports, and anomaly detection — all in one unified dashboard.' },
    { icon: Shield,    title: 'Industrial Security',   desc: 'Unauthorized vehicle alerts, perimeter breach detection, and real-time supervisor notifications.' },
    { icon: FileText,  title: 'Automated Reports',     desc: 'Shift reports, daily summaries, and compliance documents generated automatically. Export to PDF or Excel.' },
  ];
  return (
    <CinemaSection id="platform" className="py-36 px-6 max-w-7xl mx-auto">
      <FadeUp className="text-center mb-24">
        <SectionLabel>The Platform</SectionLabel>
        <h2 className="text-display-md font-semibold text-balance">One platform. Complete visibility.</h2>
        <p className="mt-5 text-body-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          Every gate. Every vehicle. Every shift. Monitored, classified, and logged — automatically.
        </p>
      </FadeUp>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <FadeUp key={item.title} delay={i * 0.07}>
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 16px 48px -8px rgba(0,0,0,0.12)' }}
              transition={{ duration: 0.3 }}
              className="group p-8 rounded-2xl border border-border bg-card h-full cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:bg-brand/10 transition-colors">
                <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-colors" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          </FadeUp>
        ))}
      </div>
    </CinemaSection>
  );
}

function HowAIWorks() {
  const steps = [
    { icon: Camera,   label: 'Camera Input',   desc: 'RTSP / USB cameras stream live video'       },
    { icon: Cpu,      label: 'AI Inference',   desc: 'YOLOv8 detects vehicles in real time'        },
    { icon: GitMerge, label: 'Classification', desc: 'Loaded vs Empty at 96%+ accuracy'            },
    { icon: Radio,    label: 'OCR Extraction', desc: 'Plate & wagon IDs extracted'                 },
    { icon: Database, label: 'Data Logging',   desc: 'Events stored with full metadata'            },
    { icon: FileText, label: 'Reports',        desc: 'Automated shift & compliance reports'        },
  ];
  return (
    <CinemaSection id="how-it-works" className="py-36 bg-muted/40 border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-24">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-display-md font-semibold text-balance">From camera to report in under 50ms.</h2>
          <p className="mt-5 text-body-lg text-muted-foreground max-w-xl mx-auto text-balance">
            A complete pipeline — no human in the loop required.
          </p>
        </FadeUp>
        <div className="relative">
          <div className="hidden lg:block absolute top-8 left-[calc(8.33%+20px)] right-[calc(8.33%+20px)] h-px bg-border" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {steps.map((step, i) => (
              <FadeUp key={step.label} delay={i * 0.1} className="text-center">
                <motion.div
                  whileHover={{ scale: 1.06, y: -3 }}
                  className="relative mx-auto mb-5 w-16 h-16 rounded-2xl border border-border bg-card flex items-center justify-center shadow-card"
                >
                  <step.icon className="w-7 h-7 text-foreground" />
                  <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </motion.div>
                <div className="text-sm font-semibold text-foreground mb-1">{step.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{step.desc}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </CinemaSection>
  );
}

function AnalyticsPreview() {
  return (
    <CinemaSection id="analytics" className="py-36 px-6 max-w-7xl mx-auto">
      <FadeUp className="text-center mb-24">
        <SectionLabel>Analytics</SectionLabel>
        <h2 className="text-display-md font-semibold text-balance">Intelligence built into every shift.</h2>
        <p className="mt-5 text-body-lg text-muted-foreground max-w-xl mx-auto text-balance">
          Real-time throughput, accuracy trends, and gate activity — all at a glance.
        </p>
      </FadeUp>
      <FadeUp delay={0.1}>
        <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-8 py-5 border-b border-border">
            <div>
              <div className="text-sm font-semibold text-foreground">Throughput · Today</div>
              <div className="text-xs text-muted-foreground mt-0.5">Loaded vs Empty by hour</div>
            </div>
            <div className="flex items-center gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-brand inline-block" />Loaded</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-muted-foreground/60 inline-block" />Empty</span>
            </div>
          </div>
          <div className="h-72 p-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="lgL2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3B76F0" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#3B76F0" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="lgE2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#94A3B8" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#94A3B8" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: '12px' }} />
                <Area type="monotone" dataKey="loaded" stroke="#3B76F0" strokeWidth={2.5} fill="url(#lgL2)" name="Loaded" dot={false} />
                <Area type="monotone" dataKey="empty"  stroke="#94A3B8" strokeWidth={2}   fill="url(#lgE2)" name="Empty"  dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 divide-x divide-border border-t border-border">
            {[
              { label: 'Total Detected', value: '1,432' },
              { label: 'Loaded',         value: '845'   },
              { label: 'Empty',          value: '587'   },
              { label: 'Avg Accuracy',   value: '96.4%' },
            ].map(k => (
              <div key={k.label} className="px-6 py-4 text-center">
                <div className="text-lg font-semibold font-mono text-foreground">{k.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{k.label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </CinemaSection>
  );
}

function Applications() {
  const apps = [
    { name: 'Logistics Yards',      desc: 'Track every truck entering and leaving. Automate gate logs.' },
    { name: 'Railway Terminals',    desc: 'Monitor wagon loads in real time. OCR wagon IDs automatically.' },
    { name: 'Manufacturing Plants', desc: 'Track raw material delivery and finished goods dispatch.' },
    { name: 'Warehouses',           desc: 'Complete inbound / outbound vehicle visibility at all docks.' },
    { name: 'Border Security',      desc: 'Identify and flag unauthorized vehicles at controlled checkpoints.' },
  ];
  return (
    <CinemaSection id="applications" className="py-36 bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="mb-24">
          <SectionLabel light>Industrial Applications</SectionLabel>
          <h2 className="text-display-md font-semibold text-balance max-w-xl">Built for the real world.</h2>
          <p className="mt-5 text-body-lg text-background/60 max-w-lg text-balance">
            Deployed across logistics, rail, and manufacturing environments where precision and uptime are non-negotiable.
          </p>
        </FadeUp>
        <div className="space-y-px">
          {apps.map((app, i) => (
            <FadeUp key={app.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ paddingLeft: '1.5rem' }}
                transition={{ duration: 0.3 }}
                className="group flex items-start justify-between py-7 border-t border-background/10 hover:border-background/25 transition-colors cursor-default"
              >
                <div className="flex items-start gap-8">
                  <span className="text-sm font-mono text-background/30 mt-0.5 w-6">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="text-base font-semibold text-background mb-1">{app.name}</div>
                    <div className="text-body-sm text-background/50">{app.desc}</div>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-background/20 group-hover:text-background/60 transition-colors flex-shrink-0 mt-0.5" />
              </motion.div>
            </FadeUp>
          ))}
          <div className="border-t border-background/10" />
        </div>
      </div>
    </CinemaSection>
  );
}

function CTA() {
  return (
    <CinemaSection className="py-36 px-6">
      <FadeUp className="max-w-4xl mx-auto text-center">
        <SectionLabel>Ready to deploy</SectionLabel>
        <h2 className="text-display-lg font-semibold text-balance">
          Modernize your industrial<br />vehicle monitoring.
        </h2>
        <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto text-balance">
          Enterprise-grade AI detection with zero manual intervention. Purpose-built for industrial environments.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-foreground text-background text-sm font-medium shadow-md hover:shadow-lg transition-shadow">
              Employee Login <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.a href="#platform" whileHover={{ scale: 1.02, y: -1 }} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all">
            Explore Platform
          </motion.a>
        </div>
      </FadeUp>
    </CinemaSection>
  );
}

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

/* ═══════════════════════════════════════════════════════════════
   ROOT PAGE
   ══════════════════════════════════════════════════════════════ */
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
