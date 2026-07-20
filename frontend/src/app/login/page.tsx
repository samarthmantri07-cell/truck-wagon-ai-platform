'use client';
import AuthLayout from '@/layouts/AuthLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Lock, Shield } from 'lucide-react';

export default function Login() {
  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm mx-auto"
      >
        {/* Logo mark */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-foreground text-background mb-5">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-display-sm font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-body-sm text-muted-foreground">
            Sign in to access the monitoring console.
          </p>
        </div>

        <Card className="border border-border shadow-modal bg-card">
          <CardContent className="p-8">
            <form action="/dashboard" method="get" className="space-y-5">
              <div className="space-y-1.5">
                <label className="label-xs" htmlFor="emp-id">Employee ID</label>
                <Input
                  id="emp-id"
                  type="text"
                  placeholder="EMP-1047"
                  defaultValue="EMP-1047"
                  className="h-11 bg-muted/40 border-border focus:bg-card transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="label-xs" htmlFor="password">Password</label>
                  <a href="#" className="text-xs text-brand hover:underline">Forgot password?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  defaultValue="password"
                  className="h-11 bg-muted/40 border-border focus:bg-card transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  id="remember"
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-border accent-foreground cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
                  Keep me signed in
                </label>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Sign in <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Authorized personnel only. All access is monitored and logged.
        </p>
      </motion.div>
    </AuthLayout>
  );
}
