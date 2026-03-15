import { AdminLayout } from '@/components/AdminLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Search, MoreVertical } from 'lucide-react';

const users = [
  { name: 'Alex Chen', email: 'alex@nexusai.com', tier: 'FounderCard', events: 23, status: 'active' },
  { name: 'Priya Sharma', email: 'priya@techventures.com', tier: 'FounderCard', events: 18, status: 'active' },
  { name: 'James Liu', email: 'james@sequoia.com', tier: 'Free', events: 12, status: 'active' },
  { name: 'Sarah Mitchell', email: 'sarah@greenscale.io', tier: 'FounderCard', events: 8, status: 'active' },
  { name: 'Raj Patel', email: 'raj@finova.com', tier: 'Free', events: 5, status: 'suspended' },
];

const AdminUsersPage = () => (
  <AdminLayout>
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold text-foreground">Users</h1>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input className="gold-input w-full pl-10" placeholder="Search users..." />
      </div>
      <GlassCard className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Name</th>
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Email</th>
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Tier</th>
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Events</th>
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Status</th>
              <th className="py-3 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-2 font-medium text-foreground">{u.name}</td>
                <td className="py-3 px-2 text-muted-foreground">{u.email}</td>
                <td className="py-3 px-2"><span className="gold-pill text-[10px]">{u.tier}</span></td>
                <td className="py-3 px-2 text-muted-foreground">{u.events}</td>
                <td className="py-3 px-2">
                  <span className={`text-xs ${u.status === 'active' ? 'text-green-500' : 'text-destructive'}`}>{u.status}</span>
                </td>
                <td className="py-3 px-2"><MoreVertical className="w-4 h-4 text-muted-foreground cursor-pointer" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  </AdminLayout>
);

export default AdminUsersPage;
