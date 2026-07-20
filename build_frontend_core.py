import os

base = 'C:/Users/samar/OneDrive/Desktop/Final_Project/truck-wagon-ai-platform/frontend'
os.makedirs(os.path.join(base, 'src', 'store'), exist_ok=True)
os.makedirs(os.path.join(base, 'src', 'constants'), exist_ok=True)
os.makedirs(os.path.join(base, 'src', 'utils'), exist_ok=True)
os.makedirs(os.path.join(base, 'src', 'types'), exist_ok=True)
os.makedirs(os.path.join(base, 'src', 'styles'), exist_ok=True)

# 1. Globals CSS
globals_css = """@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 98%;
    --foreground: 222.2 47.4% 11.2%;
    
    --card: 0 0% 100%;
    --card-foreground: 222.2 47.4% 11.2%;
    
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 47.4% 11.2%;
    
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 47.4% 11.2%;
    
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased font-sans;
  }
}
"""
with open(os.path.join(base, 'src', 'styles', 'globals.css'), 'w') as f:
    f.write(globals_css)

# 2. Tailwind Config
tailwind_config = """import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/layouts/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#0EA5E9',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-jetbrains-mono)'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
"""
with open(os.path.join(base, 'tailwind.config.ts'), 'w') as f:
    f.write(tailwind_config)

# 3. Layout with fonts
layout_tsx = """import '@/styles/globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata = {
  title: 'AI Truck & Wagon Detection',
  description: 'Enterprise AI Platform for Logistics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-gray-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
"""
with open(os.path.join(base, 'src', 'app', 'layout.tsx'), 'w') as f:
    f.write(layout_tsx)

# 4. Mock Data
mock_data_ts = """export const MOCK_VEHICLES = [
  { id: 'TRK-901', type: 'Truck', state: 'Loaded', confidence: 0.98, timestamp: '2026-07-20T10:15:30Z', camera: 'Gate A' },
  { id: 'WGN-204', type: 'Wagon', state: 'Empty', confidence: 0.95, timestamp: '2026-07-20T10:14:12Z', camera: 'Rail Yard 1' },
  { id: 'TRK-902', type: 'Truck', state: 'Empty', confidence: 0.99, timestamp: '2026-07-20T10:12:05Z', camera: 'Gate B' },
  { id: 'WGN-205', type: 'Wagon', state: 'Loaded', confidence: 0.88, timestamp: '2026-07-20T10:10:45Z', camera: 'Rail Yard 1' },
];

export const MOCK_KPI = {
  totalDetected: 1432,
  loadedCount: 845,
  emptyCount: 587,
  avgAccuracy: 96.4,
  systemFps: 30.2,
};

export const MOCK_CHART_DATA = [
  { time: '08:00', loaded: 40, empty: 24 },
  { time: '09:00', loaded: 30, empty: 13 },
  { time: '10:00', loaded: 20, empty: 38 },
  { time: '11:00', loaded: 27, empty: 39 },
  { time: '12:00', loaded: 18, empty: 48 },
  { time: '13:00', loaded: 23, empty: 38 },
  { time: '14:00', loaded: 34, empty: 43 },
];

export const MOCK_ALERTS = [
  { id: 1, type: 'Warning', message: 'Camera "Gate A" framerate dropped to 15 FPS.', time: '10 mins ago' },
  { id: 2, type: 'Error', message: 'Unauthorized vehicle detected at Loading Bay 4.', time: '1 hour ago' },
];
"""
with open(os.path.join(base, 'src', 'constants', 'mockData.ts'), 'w') as f:
    f.write(mock_data_ts)

# 5. Stores
use_ui_store_ts = """import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
}));
"""
with open(os.path.join(base, 'src', 'store', 'useUIStore.ts'), 'w') as f:
    f.write(use_ui_store_ts)

print("Core frontend files generated.")
