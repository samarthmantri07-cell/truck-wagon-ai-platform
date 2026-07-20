import os
import json

base = 'C:/Users/samar/OneDrive/Desktop/Final_Project/truck-wagon-ai-platform/frontend'

def ensure_dir(path):
    os.makedirs(os.path.join(base, path), exist_ok=True)

# 1. Error Pages
ensure_dir('src/app/not-found')
not_found_tsx = """import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <h1 className="text-9xl font-bold font-mono text-slate-200">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
      <p className="mt-2 text-slate-500 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
      <Button asChild className="mt-8">
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
"""
with open(os.path.join(base, 'src', 'app', 'not-found.tsx'), 'w') as f:
    f.write(not_found_tsx)

# 2. Live Monitoring Page
ensure_dir('src/app/live')
live_page_tsx = """"use client"
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_VEHICLES } from '@/constants/mockData';
import { motion } from 'framer-motion';

export default function LiveMonitoring() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Live Monitoring</h2>
          <p className="text-muted-foreground">Real-time camera feed and tracking</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success" className="animate-pulse">● System Live</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <Card className="h-[70vh] border-0 ring-1 ring-slate-200 shadow-xl overflow-hidden bg-slate-900">
             <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
               <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 4 }}>
                  <div className="text-xl font-mono tracking-widest uppercase">Connecting to RTSP Stream...</div>
               </motion.div>
             </div>
          </Card>
        </div>
        
        <div className="xl:col-span-1 space-y-6">
          <Card className="h-[70vh] flex flex-col">
            <CardHeader className="border-b bg-slate-50 py-4">
              <CardTitle className="text-sm">Event Stream</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {MOCK_VEHICLES.map((v, i) => (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ delay: i * 0.15 }}
                  key={v.id + i} 
                  className="p-3 border rounded-lg bg-white shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono font-bold text-slate-800">{v.id}</span>
                    <Badge variant={v.state === 'Loaded' ? 'success' : 'secondary'}>{v.state}</Badge>
                  </div>
                  <div className="text-xs text-slate-500">Camera: {v.camera}</div>
                  <div className="text-xs text-slate-500">Time: {new Date(v.timestamp).toLocaleTimeString()}</div>
                  <div className="text-xs text-slate-500 mt-2">Confidence: {(v.confidence * 100).toFixed(1)}%</div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
"""
with open(os.path.join(base, 'src', 'app', 'live', 'page.tsx'), 'w') as f:
    f.write(live_page_tsx)

# 3. Analytics Page
ensure_dir('src/app/analytics')
analytics_page_tsx = """"use client"
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_CHART_DATA } from '@/constants/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Analytics & Trends</h2>
        <p className="text-muted-foreground">Historical data and throughput metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Throughput Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="loaded" stroke="#10B981" strokeWidth={3} dot={false} name="Loaded" />
                <Line type="monotone" dataKey="empty" stroke="#64748B" strokeWidth={3} dot={false} name="Empty" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hourly Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="loaded" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} name="Loaded" />
                <Bar dataKey="empty" stackId="a" fill="#0F172A" radius={[4, 4, 0, 0]} name="Empty" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
"""
with open(os.path.join(base, 'src', 'app', 'analytics', 'page.tsx'), 'w') as f:
    f.write(analytics_page_tsx)

# 4. Auth Layout & Login Page
ensure_dir('src/layouts')
auth_layout = """export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col bg-slate-900 text-white p-12 justify-between">
        <div>
          <div className="text-2xl font-bold font-mono tracking-tight">Vantage AI</div>
          <p className="mt-4 text-slate-400 text-lg max-w-md">Next Generation Enterprise Computer Vision Platform for Logistics & Freight.</p>
        </div>
        <div className="space-y-4">
          <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
          <p className="text-slate-300">"Automating the physical world with absolute precision."</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
"""
with open(os.path.join(base, 'src', 'layouts', 'AuthLayout.tsx'), 'w') as f:
    f.write(auth_layout)

ensure_dir('src/app/login')
login_page_tsx = """"use client"
import AuthLayout from '@/layouts/AuthLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Login() {
  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-none bg-transparent lg:bg-white lg:shadow-xl lg:border lg:p-4">
          <CardHeader className="space-y-3">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-2 lg:hidden">
              <Truck className="w-6 h-6" />
            </div>
            <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
            <p className="text-sm text-slate-500">Enter your credentials to access the dashboard</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input type="email" placeholder="admin@enterprise.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                </div>
                <input type="password" placeholder="••••••••" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
              </div>
            </div>
            <Button className="w-full" asChild>
              <Link href="/dashboard">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </AuthLayout>
  );
}
"""
with open(os.path.join(base, 'src', 'app', 'login', 'page.tsx'), 'w') as f:
    f.write(login_page_tsx)

print("Additional pages and layouts generated successfully.")
