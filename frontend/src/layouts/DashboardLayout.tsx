"use client"
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
