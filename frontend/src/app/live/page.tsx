"use client"
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
          <Badge variant="success" className="animate-pulse">System Live</Badge>
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
