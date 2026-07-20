import os
import json

base = 'C:/Users/samar/OneDrive/Desktop/Final_Project/truck-wagon-ai-platform/frontend'

def ensure_dir(path):
    os.makedirs(os.path.join(base, path), exist_ok=True)

ensure_dir('src/components/ui')
ensure_dir('src/components/dashboard')
ensure_dir('src/layouts')
ensure_dir('src/lib')

# lib/utils.ts
utils_ts = """import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
"""
with open(os.path.join(base, 'src', 'lib', 'utils.ts'), 'w') as f:
    f.write(utils_ts)

# UI Components (Simplified versions of shadcn components to guarantee compilation without external radix bugs if any)
# Button
button_tsx = """import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "button" : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
"""
with open(os.path.join(base, 'src', 'components', 'ui', 'button.tsx'), 'w') as f:
    f.write(button_tsx)

# Card
card_tsx = """import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
"""
with open(os.path.join(base, 'src', 'components', 'ui', 'card.tsx'), 'w') as f:
    f.write(card_tsx)

# Badge
badge_tsx = """import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-success text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
export { Badge, badgeVariants }
"""
with open(os.path.join(base, 'src', 'components', 'ui', 'badge.tsx'), 'w') as f:
    f.write(badge_tsx)

# Dashboard Layout
dashboard_layout = """"use client"
import React from 'react';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Truck, Activity, FileText, Video, Settings, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();
  const pathname = usePathname();

  const nav = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Live Monitoring', icon: Video, href: '/live' },
    { name: 'Analytics', icon: Activity, href: '/analytics' },
    { name: 'History', icon: Truck, href: '/history' },
    { name: 'Reports', icon: FileText, href: '/reports' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={cn("fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r", sidebarOpen ? "w-64" : "w-20")}>
        <div className="h-full px-3 py-4 flex flex-col">
          <div className="mb-8 flex items-center justify-center font-bold text-xl h-10 text-primary">
            {sidebarOpen ? 'Vantage AI' : 'V'}
          </div>
          <ul className="space-y-2 font-medium flex-1">
            {nav.map((item) => {
              const active = pathname && pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link href={item.href} className={cn("flex items-center p-2 rounded-lg group", active ? "bg-slate-900 text-white" : "text-gray-900 hover:bg-gray-100")}>
                    <item.icon className="w-6 h-6 flex-shrink-0" />
                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn("flex-1 flex flex-col transition-all", sidebarOpen ? "ml-64" : "ml-20")}>
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Truck & Wagon Detection Platform</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
"""
with open(os.path.join(base, 'src', 'layouts', 'DashboardLayout.tsx'), 'w') as f:
    f.write(dashboard_layout)

# Dashboard Page
dashboard_page = """"use client"
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_KPI, MOCK_VEHICLES } from '@/constants/mockData';
import { Badge } from '@/components/ui/badge';
import { Truck, Box, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const kpis = [
    { title: 'Total Detected', value: MOCK_KPI.totalDetected, icon: Truck, color: 'text-blue-500' },
    { title: 'Loaded Vehicles', value: MOCK_KPI.loadedCount, icon: Box, color: 'text-emerald-500' },
    { title: 'Empty Vehicles', value: MOCK_KPI.emptyCount, icon: Box, color: 'text-amber-500' },
    { title: 'System Accuracy', value: MOCK_KPI.avgAccuracy + '%', icon: Target, color: 'text-purple-500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={kpi.title}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono">{kpi.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Live Feed Placeholder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 relative overflow-hidden">
                <Zap className="h-8 w-8 mb-2 absolute opacity-20" />
                <span>Camera Feed Active</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Detections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_VEHICLES.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50">
                    <div>
                      <div className="font-medium font-mono">{v.id}</div>
                      <div className="text-xs text-slate-500">{new Date(v.timestamp).toLocaleTimeString()}</div>
                    </div>
                    <Badge variant={v.state === 'Loaded' ? 'success' : 'secondary'}>{v.state}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
"""
os.makedirs(os.path.join(base, 'src', 'app', 'dashboard'), exist_ok=True)
with open(os.path.join(base, 'src', 'app', 'dashboard', 'page.tsx'), 'w') as f:
    f.write(dashboard_page)

# Update root page to redirect to dashboard
root_page = """import { redirect } from 'next/navigation';
export default function Page() {
  redirect('/dashboard');
}
"""
with open(os.path.join(base, 'src', 'app', 'page.tsx'), 'w') as f:
    f.write(root_page)

print("UI components and pages generated successfully.")
