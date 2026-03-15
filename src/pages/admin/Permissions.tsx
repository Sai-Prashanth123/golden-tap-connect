import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from '@/components/AdminLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Search, Shield, ShieldOff, Flag, Eye, Ban, CheckCircle2, Clock, AlertTriangle, MessageSquare, X } from 'lucide-react';

const reports = [
  { id: '1', type: 'Spam', reporter: 'Priya Sharma', target: 'Unknown User', reason: 'Sending bulk connection requests and spam messages to all attendees.', status: 'pending', date: '2 hours ago', severity: 'medium' },
  { id: '2', type: 'Harassment', reporter: 'Alex Chen', target: 'Demo Account', reason: 'Repeated inappropriate messages after being told to stop.', status: 'reviewing', date: '5 hours ago', severity: 'high' },
  { id: '3', type: 'Fake Profile', reporter: 'James Liu', target: 'Impersonator', reason: 'Profile is impersonating a well-known VC partner.', status: 'resolved', date: '1 day ago', severity: 'high' },
  { id: '4', type: 'Inappropriate Content', reporter: 'Sarah Mitchell', target: 'Bio Content', reason: 'Bio contains offensive language and misleading claims.', status: 'pending', date: '3 hours ago', severity: 'low' },
];

const permissionRoles = [
  { role: 'Attendee', users: 9840, permissions: ['View profile', 'Scan QR', 'Join events', 'Connect with others', 'Add notes'], restricted: ['Create events', 'Export data', 'View analytics'] },
  { role: 'FounderCard User', users: 3000, permissions: ['All Attendee perms', 'NFC tap connect', 'Priority event access', 'Highlighted in lists', 'Advanced profile'], restricted: ['Create events', 'Admin panel'] },
  { role: 'Organizer', users: 250, permissions: ['Create & manage events', 'Attendee directory', 'Lead capture', 'Analytics dashboard', 'Speaker management'], restricted: ['User management', 'Global settings'] },
  { role: 'Admin', users: 12, permissions: ['Full platform access', 'User management', 'Global settings', 'Analytics', 'Moderation'], restricted: [] },
];

const severityConfig = {
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
  reviewing: { label: 'Reviewing', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Eye },
  resolved: { label: 'Resolved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
};

const AdminPermissionsPage = () => {
  const [tab, setTab] = useState<'reports' | 'permissions'>('reports');
  const [search, setSearch] = useState('');
  const [reportStatuses, setReportStatuses] = useState<Record<string, string>>({});
  const [viewReport, setViewReport] = useState<typeof reports[0] | null>(null);

  const getStatus = (r: typeof reports[0]) => reportStatuses[r.id] || r.status;

  const filteredReports = reports.filter((r) =>
    r.reporter.toLowerCase().includes(search.toLowerCase()) ||
    r.reason.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase())
  );

  const resolveReport = (id: string) => {
    setReportStatuses((p) => ({ ...p, [id]: 'resolved' }));
  };

  const reviewReport = (id: string) => {
    setReportStatuses((p) => ({ ...p, [id]: 'reviewing' }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Permissions & Moderation</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage roles, permissions, and user reports</p>
          </div>
          <div className="flex gap-2 p-1 glass-card rounded-xl">
            {(['reports', 'permissions'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'gold-gradient-bg text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              {/* Report Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Pending', value: reports.filter((r) => (reportStatuses[r.id] || r.status) === 'pending').length, color: 'text-amber-400' },
                  { label: 'Reviewing', value: reports.filter((r) => (reportStatuses[r.id] || r.status) === 'reviewing').length, color: 'text-blue-400' },
                  { label: 'Resolved', value: reports.filter((r) => (reportStatuses[r.id] || r.status) === 'resolved').length, color: 'text-emerald-400' },
                ].map((s, i) => (
                  <GlassCard key={i} className="text-center py-4">
                    <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </GlassCard>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="gold-input w-full pl-10 text-sm" placeholder="Search reports..." />
              </div>

              {/* Report Cards */}
              <div className="space-y-3">
                {filteredReports.map((r, i) => {
                  const s = getStatus(r);
                  const sCfg = statusConfig[s as keyof typeof statusConfig] || statusConfig.pending;
                  const SIcon = sCfg.icon;
                  return (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                      <GlassCard hover>
                        <div className="flex items-start gap-4">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${r.severity === 'high' ? 'bg-red-500/20' : r.severity === 'medium' ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
                            <Flag className={`w-4 h-4 ${r.severity === 'high' ? 'text-red-400' : r.severity === 'medium' ? 'text-amber-400' : 'text-blue-400'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-foreground">{r.type}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${severityConfig[r.severity as keyof typeof severityConfig]}`}>
                                {r.severity}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border inline-flex items-center gap-1 ${sCfg.color}`}>
                                <SIcon className="w-3 h-3" /> {sCfg.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Reported by <span className="text-foreground">{r.reporter}</span> · {r.date}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{r.reason}</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button variant="gold-ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setViewReport(r)}>
                              <Eye className="w-3 h-3" />
                            </Button>
                            {s === 'pending' && (
                              <Button variant="gold-ghost" size="sm" className="h-7 px-2 text-xs text-blue-400" onClick={() => reviewReport(r.id)}>
                                <MessageSquare className="w-3 h-3" />
                              </Button>
                            )}
                            {s !== 'resolved' && (
                              <Button variant="gold-ghost" size="sm" className="h-7 px-2 text-xs text-emerald-400" onClick={() => resolveReport(r.id)}>
                                <CheckCircle2 className="w-3 h-3" />
                              </Button>
                            )}
                            <Button variant="gold-ghost" size="sm" className="h-7 px-2 text-xs text-red-400">
                              <Ban className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {tab === 'permissions' && (
            <motion.div key="permissions" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
              <p className="text-sm text-muted-foreground">Review and manage role-based permissions across the platform.</p>
              {permissionRoles.map((role, i) => (
                <motion.div key={role.role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <GlassCard>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-foreground">{role.role}</h3>
                          <p className="text-xs text-muted-foreground">{role.users.toLocaleString()} users</p>
                        </div>
                      </div>
                      <Button variant="gold-ghost" size="sm" className="text-xs">Edit Role</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-emerald-400 font-medium mb-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Allowed</p>
                        <div className="space-y-1">
                          {role.permissions.map((p) => (
                            <div key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                      {role.restricted.length > 0 && (
                        <div>
                          <p className="text-xs text-red-400 font-medium mb-2 flex items-center gap-1"><ShieldOff className="w-3 h-3" /> Restricted</p>
                          <div className="space-y-1">
                            {role.restricted.map((p) => (
                              <div key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                {p}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Report Detail Modal */}
      <AnimatePresence>
        {viewReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setViewReport(null)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-md">
              <GlassCard className="relative">
                <button onClick={() => setViewReport(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                  <h3 className="font-display text-xl font-semibold text-foreground">{viewReport.type}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    ['Reported By', viewReport.reporter],
                    ['Against', viewReport.target],
                    ['Date', viewReport.date],
                    ['Severity', viewReport.severity.charAt(0).toUpperCase() + viewReport.severity.slice(1)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="text-foreground font-medium">{v}</span>
                    </div>
                  ))}
                  <div>
                    <p className="text-muted-foreground mb-1">Description</p>
                    <p className="text-foreground text-sm leading-relaxed">{viewReport.reason}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-5">
                  <Button variant="gold-ghost" size="sm" className="flex-1 text-xs text-red-400 border-red-500/30 hover:bg-red-500/10"><Ban className="w-3 h-3 mr-1" /> Ban User</Button>
                  <Button variant="gold" size="sm" className="flex-1 text-xs" onClick={() => { resolveReport(viewReport.id); setViewReport(null); }}>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Resolve
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminPermissionsPage;
