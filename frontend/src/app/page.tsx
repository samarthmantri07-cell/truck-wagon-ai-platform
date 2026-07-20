'use client';

import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Eye, FileText, Shield, BarChart3, Camera, ArrowRight,
  ChevronDown, Cpu, Radio, Database, GitMerge, CheckCircle2,
  Truck,
} from 'lucide-react';
import { MOCK_CHART_DATA, MOCK_KPI } from '@/constants/mockData';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts';

/* ════════════════════════════════════════════════════════════
   AURORA CANVAS BACKGROUND
   Soft glowing orbs that drift slowly — Stripe / Linear style.
   Runs at requestAnimationFrame (~60 FPS), never distracts.
   ═══════════════════════════════════════════════════════════ */
function AuroraCanvas({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ── Orbs definition ── */
    const orbs = [
      { x: 0.25, y: 0.30, r: 0.48, speed: 0.00018, phase: 0.00, hue: 210, sat: 70, lit: 68, a: 0.28 },
      { x: 0.72, y: 0.25, r: 0.40, speed: 0.00013, phase: 1.05, hue: 230, sat: 65, lit: 72, a: 0.22 },
      { x: 0.50, y: 0.75, r: 0.44, speed: 0.00021, phase: 2.10, hue: 200, sat: 60, lit: 75, a: 0.20 },
      { x: 0.15, y: 0.70, r: 0.36, speed: 0.00015, phase: 3.20, hue: 220, sat: 55, lit: 78, a: 0.18 },
      { x: 0.85, y: 0.65, r: 0.38, speed: 0.00017, phase: 4.30, hue: 215, sat: 62, lit: 70, a: 0.20 },
    ];

    const draw = (ts: number) => {
      timeRef.current = ts;
      ctx.clearRect(0, 0, W, H);

      /* Subtle mouse drift factor */
      const mxFactor = (mouseX - 0.5) * 0.04;
      const myFactor = (mouseY - 0.5) * 0.04;

      orbs.forEach((orb) => {
        const t = ts * orb.speed + orb.phase;
        const cx = (orb.x + Math.sin(t * 1.3) * 0.12 + mxFactor) * W;
        const cy = (orb.y + Math.cos(t * 0.9) * 0.10 + myFactor) * H;
        const radius = orb.r * Math.min(W, H);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `hsla(${orb.hue}, ${orb.sat}%, ${orb.lit}%, ${orb.a})`);
        grad.addColorStop(0.5, `hsla(${orb.hue + 10}, ${orb.sat - 10}%, ${orb.lit + 5}%, ${orb.a * 0.5})`);
        grad.addColorStop(1, `hsla(${orb.hue}, ${orb.sat}%, ${orb.lit}%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * 1.2, radius, Math.sin(t * 0.5) * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      /* Subtle animated grid overlay */
      ctx.strokeStyle = 'rgba(59, 118, 240, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 72;
      const offsetX = (ts * 0.006) % gridSize;
      const offsetY = (ts * 0.004) % gridSize;
      for (let x = -gridSize + offsetX; x < W + gridSize; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = -gridSize + offsetY; y < H + gridSize; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, [mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}

/* ════════════════════════════════════════════════════════════
   ANIMATED HEADLINE — character-by-character reveal
   ═══════════════════════════════════════════════════════════ */
function RevealText({ text, delay = 0, className = '' }: {
  text: string; delay?: number; className?: string;
}) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.75,
              delay: delay + wi * 0.08,
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

/* ════════════════════════════════════════════════════════════
   SHARED HELPERS
   ═══════════════════════════════════════════════════════════ */
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

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`label-xs mb-5 ${light ? 'text-background/40' : 'text-brand'}`}>{children}</p>
  );
}

/* ════════════════════════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 md:px-16 h-16 transition-all duration-500 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-2xl border-b border-border/60 shadow-topbar'
          : 'bg-transparent'
      }`}
    >
      <span className="font-semibold text-base tracking-tight">Vantage AI</span>
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        {['platform', 'how-it-works', 'analytics', 'applications'].map((id) => (
          <a key={id} href={`#${id}`}
            className="hover:text-foreground transition-colors capitalize">
            {id.replace('-', ' ')}
          </a>
        ))}
      </div>
      <Link
        href="/login"
        className="text-sm font-medium px-4 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-all hover:-translate-y-px active:translate-y-0"
      >
        Employee Login
      </Link>
    </motion.nav>
  );
}

/* ════════════════════════════════════════════════════════════
   HERO — The WOW moment
   ═══════════════════════════════════════════════════════════ */
function Hero() {
  const heroRef  = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  /* Parallax layers */
  const textY    = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const bgY      = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const opacity  = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  /* Mouse tracking — smooth spring physics */
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const springConfig = { stiffness: 40, damping: 20, mass: 0.8 };
  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  /* For canvas (needs plain numbers) */
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  /* Title subtle light shift */
  const titleX = useTransform(springX, [0, 1], [-6, 6]);
  const titleY = useTransform(springY, [0, 1], [-3, 3]);

  /* Button tilt */
  const btnRotX = useTransform(springY, [0, 1], [3, -3]);
  const btnRotY = useTransform(springX, [0, 1], [-4, 4]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top)  / rect.height;
    rawX.set(nx); rawY.set(ny);
    setMousePos({ x: nx, y: ny });
  }, [rawX, rawY]);

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
    >
      {/* ── Animated Aurora Background ── */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <AuroraCanvas mouseX={mousePos.x} mouseY={mousePos.y} />

        {/* Base warm white gradient overlay — keeps text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/5 to-background/80 pointer-events-none" />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, hsl(var(--background)) 100%)',
          }}
        />
      </motion.div>

      {/* ── Foreground Content ── */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 px-6 max-w-5xl mx-auto flex flex-col items-center"
      >

        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/70 bg-card/60 backdrop-blur-sm text-xs font-medium text-muted-foreground mb-12 shadow-sm"
        >
          <span className="live-dot" />
          System Operational &nbsp;·&nbsp; {MOCK_KPI.activeCameras} cameras active
        </motion.div>

        {/* Main headline — word-by-word reveal */}
        <motion.div style={{ x: titleX, y: titleY }}>
          <h1 className="text-display-xl md:text-display-2xl font-semibold tracking-tight text-balance leading-[1.04]">
            <RevealText text="Next Generation" delay={0.35} />
            <br />
            <span className="text-muted-foreground font-normal">
              <RevealText text="AI Vehicle Detection" delay={0.55} />
            </span>
          </h1>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 w-16 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent origin-center"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-body-xl text-muted-foreground max-w-2xl text-balance"
        >
          Industrial Computer Vision Platform for real-time Truck &amp; Wagon
          detection, OCR recognition, and operational analytics.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.a
            href="#platform"
            style={{ rotateX: btnRotX, rotateY: btnRotY, transformPerspective: 600 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
          >
            Explore Platform <ArrowRight className="w-4 h-4" />
          </motion.a>
          <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/70 backdrop-blur-sm text-foreground text-sm font-medium hover:bg-card transition-all"
            >
              Employee Login
            </Link>
          </motion.div>
          <motion.a
            href="#analytics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View Demo
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-24 flex flex-col items-center gap-2 text-muted-foreground/60"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   CINEMATIC SECTION WRAPPER — Tesla scroll feel
   Each section fades the previous and slides the next.
   ═══════════════════════════════════════════════════════════ */
function CinemaSection({
  id,
  children,
  className = '',
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0.3]);
  const y       = useTransform(scrollYProgress, [0, 0.15], [40, 0]);

  return (
    <motion.section
      id={id}
      ref={ref}
      style={{ opacity, y }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ════════════════════════════════════════════════════════════
   STATS STRIP
   ═══════════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════════════
   PLATFORM FEATURES
   ═══════════════════════════════════════════════════════════ */
function Platform() {
  const items = [
    { icon: Eye,      title: 'Real-Time Detection',    desc: 'AI-powered vision identifies trucks and wagons in milliseconds. Every vehicle classified the instant it enters the frame.' },
    { icon: Truck,    title: 'Load Classification',    desc: 'Automatically distinguishes loaded from empty vehicles with 96%+ accuracy — eliminating manual inspection entirely.' },
    { icon: Camera,   title: 'OCR Recognition',        desc: 'Reads vehicle license plates and wagon numbers in real time. Integrated with gate control for automated logging.' },
    { icon: BarChart3,title: 'Operational Analytics',  desc: 'Throughput trends, gate activity, shift reports, and anomaly detection — all in one unified dashboard.' },
    { icon: Shield,   title: 'Industrial Security',    desc: 'Unauthorized vehicle alerts, perimeter breach detection, and real-time supervisor notifications.' },
    { icon: FileText, title: 'Automated Reports',      desc: 'Shift reports, daily summaries, and compliance documents generated automatically. Export to PDF or Excel.' },
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

/* ════════════════════════════════════════════════════════════
   HOW AI WORKS — Pipeline
   ═══════════════════════════════════════════════════════════ */
function HowAIWorks() {
  const steps = [
    { icon: Camera,   label: 'Camera Input',    desc: 'RTSP / USB cameras stream live video' },
    { icon: Cpu,      label: 'AI Inference',    desc: 'YOLOv8 detects vehicles in real time'  },
    { icon: GitMerge, label: 'Classification',  desc: 'Loaded vs Empty at 96%+ accuracy'      },
    { icon: Radio,    label: 'OCR Extraction',  desc: 'Plate & wagon IDs extracted'            },
    { icon: Database, label: 'Data Logging',    desc: 'Events stored with full metadata'       },
    { icon: FileText, label: 'Reports',         desc: 'Automated shift & compliance reports'   },
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

/* ════════════════════════════════════════════════════════════
   ANALYTICS PREVIEW — Full colour, animated
   ═══════════════════════════════════════════════════════════ */
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
                  <linearGradient id="lgLoaded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3B76F0" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#3B76F0" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="lgEmpty" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#94A3B8" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#94A3B8" stopOpacity={0}    />
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
                    fontSize: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                />
                <Area type="monotone" dataKey="loaded" stroke="#3B76F0" strokeWidth={2.5} fill="url(#lgLoaded)" name="Loaded" dot={false} />
                <Area type="monotone" dataKey="empty"  stroke="#94A3B8" strokeWidth={2}   fill="url(#lgEmpty)"  name="Empty"  dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 divide-x divide-border border-t border-border">
            {[
              { label: 'Total Detected', value: '1,432' },
              { label: 'Loaded',         value: '845'   },
              { label: 'Empty',          value: '587'   },
              { label: 'Avg Accuracy',   value: '96.4%' },
            ].map((k) => (
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

/* ════════════════════════════════════════════════════════════
   APPLICATIONS — Dark section
   ═══════════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════════════════════ */
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
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg"
            >
              Employee Login <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.a
            href="#platform"
            whileHover={{ scale: 1.02, y: -1 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all"
          >
            Explore Platform
          </motion.a>
        </div>
      </FadeUp>
    </CinemaSection>
  );
}

/* ════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════════════
   ROOT PAGE
   ═══════════════════════════════════════════════════════════ */
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
