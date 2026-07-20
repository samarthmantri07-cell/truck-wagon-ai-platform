"use client"
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
