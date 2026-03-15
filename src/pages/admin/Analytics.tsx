import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/AdminLayout';
import { GlassCard } from '@/components/GlassCard';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Zap, Calendar, CreditCard, ArrowUpRight } from 'lucide-react';

const signupData = [
  { month: 'Oct', users: 820, revenue: 8200 },
  { month: 'Nov', users: 1050, revenue: 10500 },
  { month: 'Dec', users: 980, revenue: 11200 },
  { month: 'Jan', users: 1340, revenue: 14800 },
  { month: 'Feb', users: 1620, revenue: 17400 },
  { month: 'Mar', users: 2010, revenue: 22100 },
];

const connectionData = [
  { day: 'Mon', connections: 320 },
  { day: 'Tue', connections: 480 },
  { day: 'Wed', connections: 390 },
  { day: 'Thu', connections: 620 },
  { day: 'Fri', connections: 890 },
  { day: 'Sat', connections: 1120 },
  { day: 'Sun', connections: 750 },
];

const tierData = [
  { name: 'Free', value: 9840, color: '#6B7280' },
  { name: 'FounderCard', value: 3000, color: '#D4A853' },
];

const categoryData = [
  { name: 'AI/ML', events: 42 },
  { name: 'SaaS', events: 38 },
  { name: 'Fintech', events: 31 },
  { name: 'Climate', events: 22 },
  { name: 'Web3', events: 19 },
  { name: 'Other', events: 45 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs border border-primary/20">
        <p className="text-foreground font-medium mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' && p.value > 1000 ? p.value.toLocaleString() : p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminAnalyticsPage = () => {
  const kpis = [
    { label: 'Total Users', value: '12,840', change: '+18.4%', icon: Users, positive: true },
    { label: 'Monthly Revenue', value: '₹18.4L', change: '+22.1%', icon: CreditCard, positive: true },
    { label: 'Total Connections', value: '45.2K', change: '+31.2%', icon: Zap, positive: true },
    { label: 'Active Events', value: '284', change: '+8.7%', icon: Calendar, positive: true },
    { label: 'FounderCard Users', value: '3,000', change: '+41.0%', icon: TrendingUp, positive: true },
    { label: 'Avg Session Time', value: '8m 42s', change: '+12.3%', icon: TrendingUp, positive: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Platform Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Live dashboard · Updated every 5 minutes</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {kpis.map(({ label, value, change, icon: Icon, positive }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <GlassCard hover className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full gold-gradient-bg opacity-5 -translate-y-6 translate-x-6" />
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    <ArrowUpRight className={`w-3 h-3 ${!positive ? 'rotate-180' : ''}`} />
                    {change}
                  </span>
                </div>
                <p className="font-display text-2xl font-bold gold-gradient-text">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Growth Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">User Signups & Revenue</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={signupData}>
                <defs>
                  <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A853" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4A853" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4B6BFB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4B6BFB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="users" stroke="#D4A853" fill="url(#usersGrad)" strokeWidth={2} name="Users" />
                <Area type="monotone" dataKey="revenue" stroke="#4B6BFB" fill="url(#revenueGrad)" strokeWidth={2} name="Revenue (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard>
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Daily Connections This Week</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={connectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="connections" fill="#D4A853" opacity={0.8} radius={[4, 4, 0, 0]} name="Connections" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        {/* Tier Distribution + Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">User Tier Distribution</h3>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={tierData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {tierData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {tierData.map((t) => (
                  <div key={t.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.color }} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.value.toLocaleString()} users · {Math.round(t.value / (tierData.reduce((s, x) => s + x.value, 0)) * 100)}%</p>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">Conversion rate</p>
                  <p className="font-display text-xl font-bold gold-gradient-text">23.4%</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Events by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="events" fill="#D4A853" opacity={0.75} radius={[0, 4, 4, 0]} name="Events" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;
