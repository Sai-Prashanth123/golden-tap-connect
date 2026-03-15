import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronRight } from 'lucide-react';

const suggestions = [
  { name: 'David Kim', role: 'Founder', company: 'PayBridge', reason: 'Both in fintech, attended 2 same events', match: 92 },
  { name: 'Anya Gupta', role: 'CEO', company: 'HealthFirst', reason: 'Both interested in B2B SaaS', match: 87 },
  { name: 'Marcus Jones', role: 'Partner', company: 'a16z', reason: 'Looking for AI/ML startups to invest in', match: 85 },
  { name: 'Lisa Wang', role: 'CTO', company: 'CloudSync', reason: 'Mutual connections: James Liu, Raj Patel', match: 82 },
  { name: 'Tom Anderson', role: 'VP Product', company: 'Stripe', reason: 'Both in payments space, SF Bay area', match: 79 },
  { name: 'Nina Petrov', role: 'Founder', company: 'EduFlow', reason: 'Both looking for co-founders', match: 76 },
];

const DiscoverPage = () => (
  <AppLayout>
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          <Sparkles className="w-7 h-7 text-primary inline mr-2" />
          People You Should Meet
        </h1>
        <p className="text-muted-foreground mt-1">AI-powered suggestions based on your profile and activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bento-stagger">
        {suggestions.map((s, i) => (
          <GlassCard key={i} hover>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {s.name[0]}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.role} · {s.company}</p>
                </div>
              </div>
              <div className="gold-pill text-xs font-semibold">{s.match}%</div>
            </div>
            <div className="glass-card p-2.5 mb-3">
              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                {s.reason}
              </p>
            </div>
            <Button variant="gold-ghost" size="sm" className="w-full text-xs">
              Request Intro via Mutual
            </Button>
          </GlassCard>
        ))}
      </div>
    </div>
  </AppLayout>
);

export default DiscoverPage;
