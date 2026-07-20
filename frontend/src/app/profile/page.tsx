'use client';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { MOCK_EMPLOYEE } from '@/constants/mockData';
import { Mail, Phone, MapPin, Clock, Shield } from 'lucide-react';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-4 border-b border-border last:border-0 flex items-center justify-between">
      <span className="label-xs">{label}</span>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  );
}

export default function Profile() {
  return (
    <DashboardLayout title="My Profile">
      <div className="mb-8">
        <h1 className="text-display-sm font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">Your employee details and current shift information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl">
        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center text-2xl font-bold mb-4">
            {MOCK_EMPLOYEE.avatarInitials}
          </div>
          <div className="text-base font-semibold text-foreground">{MOCK_EMPLOYEE.name}</div>
          <div className="text-sm text-muted-foreground mt-1">{MOCK_EMPLOYEE.designation}</div>
          <div className="mt-3 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
            On Duty
          </div>

          <div className="mt-6 w-full space-y-3 text-left">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{MOCK_EMPLOYEE.email}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>{MOCK_EMPLOYEE.phone}</span>
            </div>
          </div>

          <button className="mt-8 w-full h-9 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Edit Profile
          </button>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2 space-y-5"
        >
          <div className="rounded-2xl border border-border bg-card px-6">
            <div className="py-4 border-b border-border">
              <div className="text-sm font-semibold">Employee Information</div>
            </div>
            <Field label="Employee ID"   value={MOCK_EMPLOYEE.id} />
            <Field label="Full Name"     value={MOCK_EMPLOYEE.name} />
            <Field label="Designation"   value={MOCK_EMPLOYEE.designation} />
            <Field label="Email"         value={MOCK_EMPLOYEE.email} />
            <Field label="Phone"         value={MOCK_EMPLOYEE.phone} />
          </div>

          <div className="rounded-2xl border border-border bg-card px-6">
            <div className="py-4 border-b border-border">
              <div className="text-sm font-semibold">Current Assignment</div>
            </div>
            <div className="divide-y divide-border">
              <div className="flex items-center gap-4 py-4">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="label-xs mb-0.5">Gate Assignment</div>
                  <div className="text-sm font-semibold">{MOCK_EMPLOYEE.gate}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 py-4">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="label-xs mb-0.5">Current Shift</div>
                  <div className="text-sm font-semibold">{MOCK_EMPLOYEE.shift}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 py-4">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="label-xs mb-0.5">Access Level</div>
                  <div className="text-sm font-semibold">Shift Supervisor</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
