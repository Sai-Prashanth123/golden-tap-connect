import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Check, X, Users } from 'lucide-react';
import {
  useConnections, useConnectionRequests,
  useAcceptRequest, useRejectRequest, useRemoveConnection,
} from '@/hooks/useConnections';
import type { Connection } from '@/services/connections.service';

const getDisplayName = (conn: Connection, isRequester: boolean) => {
  const other = isRequester ? conn.receiver : conn.requester;
  if (other?.profile) return `${other.profile.firstName} ${other.profile.lastName}`;
  return other?.email ?? 'Unknown';
};

const ConnectionsPage = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'pending'>('all');

  const { data: connData, isLoading } = useConnections();
  const { data: pendingData } = useConnectionRequests();
  const acceptMutation = useAcceptRequest();
  const rejectMutation = useRejectRequest();
  const removeMutation = useRemoveConnection();

  const connections = (connData?.connections ?? []).filter((c) => {
    if (!search) return true;
    const name = getDisplayName(c, c.requesterId !== c.receiverId);
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const received = pendingData?.received ?? [];
  const pendingCount = received.length;

  return (
    <AppLayout>
      <div className="space-y-6 pb-24 md:pb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="font-display text-3xl font-semibold text-foreground">Connections</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 h-8 text-sm w-44"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass-card rounded-xl">
          <button
            onClick={() => setTab('all')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${tab === 'all' ? 'gold-gradient-bg text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            My Connections ({connections.length})
          </button>
          <button
            onClick={() => setTab('pending')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${tab === 'pending' ? 'gold-gradient-bg text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Requests
            {pendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-[9px] text-primary-foreground flex items-center justify-center font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {tab === 'all' && (
          <>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => <GlassCard key={i} className="h-16 animate-pulse" />)}
              </div>
            ) : connections.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">No connections yet.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Go to Discover to meet new people.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {connections.map((conn, i) => {
                  const name = getDisplayName(conn, true);
                  const other = conn.requester ?? conn.receiver;
                  const profile = conn.requester?.profile ?? conn.receiver?.profile;
                  return (
                    <motion.div key={conn.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <GlassCard className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold flex-shrink-0">
                          {name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{name}</p>
                          {profile?.position && profile?.company && (
                            <p className="text-xs text-muted-foreground truncate">{profile.position} · {profile.company}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-rose-400"
                          onClick={() => removeMutation.mutate(conn.id)}
                          disabled={removeMutation.isPending}
                        >
                          Remove
                        </Button>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {tab === 'pending' && (
          <>
            {received.length === 0 ? (
              <div className="text-center py-16">
                <UserPlus className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">No pending requests.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {received.map((conn, i) => {
                  const name = getDisplayName(conn, false);
                  const profile = conn.requester?.profile;
                  return (
                    <motion.div key={conn.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <GlassCard className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold flex-shrink-0">
                          {name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{name}</p>
                          {profile?.position && profile?.company && (
                            <p className="text-xs text-muted-foreground truncate">{profile.position} · {profile.company}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="gold"
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => acceptMutation.mutate(conn.id)}
                            disabled={acceptMutation.isPending}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => rejectMutation.mutate(conn.id)}
                            disabled={rejectMutation.isPending}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default ConnectionsPage;
