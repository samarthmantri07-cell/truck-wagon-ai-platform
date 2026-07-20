'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';

type Tab = 'camera' | 'ai' | 'notifications' | 'system';

const TABS: { id: Tab; label: string }[] = [
  { id: 'camera',        label: 'Camera' },
  { id: 'ai',            label: 'AI Model' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'system',        label: 'System' },
];

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-border last:border-0">
      <div className="max-w-xs">
        <div className="text-sm font-medium text-foreground">{label}</div>
        {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
      </div>
      <div className="flex-shrink-0 ml-8">{children}</div>
    </div>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn(v => !v)}
      className={cn(
        'w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0',
        on ? 'bg-foreground' : 'bg-muted'
      )}
    >
      <span className={cn(
        'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200',
        on ? 'left-6' : 'left-1'
      )} />
    </button>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('camera');

  return (
    <DashboardLayout title="Settings">
      <div className="mb-8">
        <h1 className="text-display-sm font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Configure cameras, AI parameters, and system preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-border">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors relative',
              activeTab === t.id
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
            {activeTab === t.id && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
              />
            )}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-2xl"
      >
        {activeTab === 'camera' && (
          <div className="rounded-2xl border border-border bg-card px-6">
            <Row label="Primary Camera Source" desc="Select the default input stream.">
              <select className="h-9 pl-3 pr-8 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Laptop Camera (Default)</option>
                <option>RTSP Stream</option>
              </select>
            </Row>
            <Row label="RTSP Stream URL" desc="Connect an IP camera via RTSP protocol.">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  defaultValue="rtsp://192.168.1.10:554/cam1"
                  className="h-9 px-3 rounded-lg border border-border bg-muted/40 text-xs font-mono text-foreground w-52 focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button className="h-9 px-4 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors">
                  Connect
                </button>
              </div>
            </Row>
            <Row label="Auto-Reconnect" desc="Automatically reconnect on stream drop.">
              <Toggle defaultChecked={true} />
            </Row>
            <Row label="Record Detections" desc="Save video clips of each detection event.">
              <Toggle />
            </Row>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="rounded-2xl border border-border bg-card px-6">
            <Row label="Detection Confidence Threshold" desc="Minimum confidence to log a detection event.">
              <div className="flex items-center gap-3">
                <input type="range" min="50" max="99" defaultValue="80" className="w-28 accent-foreground" />
                <span className="text-sm font-mono font-semibold w-10 text-right">80%</span>
              </div>
            </Row>
            <Row label="Model Version" desc="Active YOLOv8 model weights.">
              <select className="h-9 pl-3 pr-8 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>YOLOv8m — v3.2.1</option>
                <option>YOLOv8n — v3.2.0 (fast)</option>
                <option>YOLOv8l — v3.2.1 (accurate)</option>
              </select>
            </Row>
            <Row label="Enable OCR" desc="Extract vehicle plate numbers and wagon IDs.">
              <Toggle defaultChecked={true} />
            </Row>
            <Row label="Load Classification" desc="Distinguish loaded from empty vehicles.">
              <Toggle defaultChecked={true} />
            </Row>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="rounded-2xl border border-border bg-card px-6">
            <Row label="Unauthorized Vehicle Alerts" desc="Notify when an unknown vehicle is detected.">
              <Toggle defaultChecked={true} />
            </Row>
            <Row label="Camera Fault Alerts" desc="Alert when a camera drops below 20 FPS.">
              <Toggle defaultChecked={true} />
            </Row>
            <Row label="Low Confidence Warnings" desc="Warn when detection confidence is below threshold.">
              <Toggle />
            </Row>
            <Row label="Shift Change Reminder" desc="Remind supervisors 15 min before shift end.">
              <Toggle defaultChecked={true} />
            </Row>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="rounded-2xl border border-border bg-card px-6">
            <Row label="Language" desc="Platform display language.">
              <select className="h-9 pl-3 pr-8 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>English</option>
                <option>Hindi</option>
                <option>Urdu</option>
              </select>
            </Row>
            <Row label="Theme" desc="Light or dark mode preference.">
              <select className="h-9 pl-3 pr-8 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>System</option>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </Row>
            <Row label="Data Retention" desc="How long to keep detection history.">
              <select className="h-9 pl-3 pr-8 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </Row>
            <Row label="Export Format" desc="Default file format for exports.">
              <select className="h-9 pl-3 pr-8 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>PDF</option>
                <option>Excel (.xlsx)</option>
                <option>CSV</option>
              </select>
            </Row>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all hover:-translate-y-0.5 active:translate-y-0">
            Save Changes
          </button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
