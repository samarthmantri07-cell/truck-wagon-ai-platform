"use client"
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-muted-foreground">Manage your settings settings and data.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>System Settings Module</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg bg-slate-50 text-slate-400 font-medium">
            This module is successfully initialized with the design system.
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
