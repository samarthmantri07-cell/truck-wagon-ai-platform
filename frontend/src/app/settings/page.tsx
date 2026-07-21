'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { cn } from '@/lib/utils';
import { useUsers, useCreateUser, useDeleteUser, useUpdateUser } from '@/hooks/useUsers';
import { useAuthStore } from '@/store/useAuthStore';
import { Trash2, Edit2, ShieldAlert } from 'lucide-react';

type Tab = 'camera' | 'ai' | 'notifications' | 'system' | 'users';

const TABS: { id: Tab; label: string }[] = [
  { id: 'camera',        label: 'Camera' },
  { id: 'ai',            label: 'AI Model' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'system',        label: 'System' },
  { id: 'users',         label: 'Users & Roles' },
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
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('camera');

  // Users hooks
  const { data: users, isLoading: usersLoading } = useUsers();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: updateUser } = useUpdateUser();

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('operator');
  const [userError, setUserError] = useState('');

  // Filter tabs if not admin
  const visibleTabs = currentUser?.role === 'admin' ? TABS : TABS.filter(t => t.id !== 'users');
  
  if (currentUser?.role !== 'admin' && activeTab === 'users') {
    setActiveTab('camera');
  }

  const handleCreateUser = () => {
    if (!newUsername || !newPassword) {
      setUserError('Username and password are required');
      return;
    }
    setUserError('');
    createUser({ username: newUsername, password: newPassword, role: newRole }, {
      onSuccess: () => {
        setNewUsername('');
        setNewPassword('');
        setNewRole('operator');
      },
      onError: (err: any) => {
        setUserError(err.response?.data?.message || 'Failed to create user');
      }
    });
  };

  const handleRoleChange = (id: string, role: string) => {
    updateUser({ id, data: { role } });
  };

  return (
    <DashboardLayout title="Settings">
      <div className="mb-8">
        <h1 className="text-display-sm font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Configure cameras, AI parameters, and system preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-border overflow-x-auto no-scrollbar">
        {visibleTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap',
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
                <option>YOLO11 — v4.0.0</option>
                <option>YOLOv8m — v3.2.1</option>
                <option>YOLOv8n — v3.2.0 (fast)</option>
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

        {activeTab === 'users' && currentUser?.role === 'admin' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card px-6 py-5">
              <h3 className="text-sm font-semibold mb-4">Create New User</h3>
              {userError && <div className="text-xs text-red-500 mb-3 bg-red-50 p-2 rounded">{userError}</div>}
              <div className="flex items-end gap-3">
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Employee ID</label>
                  <input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    type="text"
                    placeholder="emp123"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Password</label>
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Role</label>
                  <select 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="operator">Operator</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button 
                  onClick={handleCreateUser}
                  disabled={isCreating}
                  className="h-9 px-4 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-sm font-semibold">User Directory</h3>
              </div>
              <div className="divide-y divide-border">
                {usersLoading ? (
                  <div className="p-6 text-sm text-center text-muted-foreground">Loading users...</div>
                ) : users?.map((u: any) => (
                  <div key={u.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold flex items-center gap-2">
                        {u.username}
                        {u.role === 'admin' && <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                        ID: {u.id}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <select 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={u.id === currentUser.id}
                        className="h-8 px-2 rounded border border-border bg-muted/40 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="operator">Operator</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button 
                        onClick={() => deleteUser(u.id)}
                        disabled={u.id === currentUser.id}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-error/10 hover:text-error transition-colors disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'users' && (
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-all hover:-translate-y-0.5 active:translate-y-0">
              Save Changes
            </button>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
