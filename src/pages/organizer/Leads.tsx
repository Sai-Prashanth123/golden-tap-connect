import { OrganizerLayout } from '@/components/OrganizerLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Download, Search, Filter } from 'lucide-react';

const leads = [
  { name: 'Priya Sharma', company: 'TechVentures', event: 'BLR Tech Week', score: 94, industry: 'Fintech', status: 'warm' },
  { name: 'James Liu', company: 'Sequoia', event: 'YC Demo Day', score: 88, industry: 'VC', status: 'warm' },
  { name: 'Sarah Mitchell', company: 'GreenScale', event: 'Climate Summit', score: 76, industry: 'Climate', status: 'cold' },
  { name: 'Raj Patel', company: 'Finova', event: 'BLR Tech Week', score: 82, industry: 'Fintech', status: 'warm' },
  { name: 'Mika Tanaka', company: 'ByteDance', event: 'Asia Tech', score: 65, industry: 'Social', status: 'cold' },
];

const LeadsPage = () => (
  <OrganizerLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-foreground">Leads</h1>
        <Button variant="gold" size="sm"><Download className="w-4 h-4 mr-1" /> Export CSV</Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input className="gold-input w-full pl-10" placeholder="Search leads..." />
        </div>
        <Button variant="gold-ghost" size="icon"><Filter className="w-4 h-4" /></Button>
      </div>

      <GlassCard className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Name</th>
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Company</th>
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Event</th>
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Score</th>
              <th className="text-left py-3 px-2 text-xs text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-3 px-2 font-medium text-foreground">{l.name}</td>
                <td className="py-3 px-2 text-muted-foreground">{l.company}</td>
                <td className="py-3 px-2"><span className="gold-pill text-[10px]">{l.event}</span></td>
                <td className="py-3 px-2 gold-gradient-text font-semibold">{l.score}</td>
                <td className="py-3 px-2">
                  <span className={`inline-flex items-center gap-1 text-xs ${l.status === 'warm' ? 'text-yellow-500' : 'text-blue-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${l.status === 'warm' ? 'bg-yellow-500' : 'bg-blue-400'}`} />
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  </OrganizerLayout>
);

export default LeadsPage;
