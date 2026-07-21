'use client';
import AuthLayout from '@/layouts/AuthLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Lock, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const loginSchema = z.object({
  username: z.string().min(1, 'Employee ID is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.login);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError('');
      const response = await login(data);
      setAuth({ id: response.id, username: response.username, role: response.role }, response.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm mx-auto"
      >
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && <div className="p-2 text-sm text-red-500 bg-red-50 rounded">{error}</div>}
              
              <div className="space-y-1.5">
                <label className="label-xs" htmlFor="emp-id">Employee ID</label>
                <Input
                  id="emp-id"
                  type="text"
                  placeholder="admin"
                  {...register('username')}
                  className="h-11 bg-muted/40 border-border focus:bg-card transition-colors"
                />
                {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
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
                  {...register('password')}
                  className="h-11 bg-muted/40 border-border focus:bg-card transition-colors"
                />
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'} <ArrowRight className="w-4 h-4" />
                </button>
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
