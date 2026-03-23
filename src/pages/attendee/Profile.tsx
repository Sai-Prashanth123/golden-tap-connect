import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMyProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useAppStore } from '@/store/appStore';
import { MapPin, Linkedin, Twitter, Globe, Mail, Edit3, Check, X, Camera } from 'lucide-react';

const ProfilePage = () => {
  const user = useAppStore((s) => s.user);
  const { data: profileData, isLoading } = useMyProfile();
  const updateMutation = useUpdateProfile();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const profile = profileData?.profile;
  const email = profileData?.email ?? user?.email ?? '';

  const startEdit = () => {
    if (!profile) return;
    setForm({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      bio: profile.bio ?? '',
      company: profile.company ?? '',
      position: profile.position ?? '',
      location: profile.location ?? '',
      linkedin: profile.linkedin ?? '',
      twitter: profile.twitter ?? '',
      website: profile.website ?? '',
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    await updateMutation.mutateAsync({
      firstName: form.firstName,
      lastName: form.lastName,
      bio: form.bio,
      company: form.company,
      position: form.position,
      location: form.location,
      linkedin: form.linkedin,
      twitter: form.twitter,
      website: form.website,
    });
    setEditing(false);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-4 animate-pulse">
          <div className="h-32 rounded-2xl bg-muted/50" />
          <div className="h-24 rounded-2xl bg-muted/50" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 pb-24 md:pb-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold text-foreground">Profile</h1>
          {!editing ? (
            <Button variant="gold-ghost" size="sm" onClick={startEdit}>
              <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="gold-ghost" size="sm" onClick={() => setEditing(false)} disabled={updateMutation.isPending}>
                <X className="w-3.5 h-3.5 mr-1" /> Cancel
              </Button>
              <Button variant="gold" size="sm" onClick={saveEdit} disabled={updateMutation.isPending}>
                <Check className="w-3.5 h-3.5 mr-1" /> {updateMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>

        {/* Avatar + name */}
        <GlassCard>
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-foreground text-2xl font-semibold overflow-hidden">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  (profile?.firstName?.[0] ?? user?.name?.[0] ?? 'U')
                )}
              </div>
              {editing && (
                <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full gold-gradient-bg flex items-center justify-center">
                  <Camera className="w-3 h-3 text-primary-foreground" />
                </button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="First name" className="h-8 text-sm" />
                    <Input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="Last name" className="h-8 text-sm" />
                  </div>
                  <Input value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} placeholder="Job title" className="h-8 text-sm" />
                  <Input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="Company" className="h-8 text-sm" />
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    {profile ? `${profile.firstName} ${profile.lastName}` : user?.name}
                  </h2>
                  {(profile?.position || profile?.company) && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {[profile.position, profile.company].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {profile?.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {profile.location}
                    </p>
                  )}
                </>
              )}
              <div className="flex items-center gap-1.5 mt-2">
                <Mail className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{email}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Bio */}
        <GlassCard>
          <h3 className="text-sm font-medium text-foreground mb-2">About</h3>
          {editing ? (
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Tell your story..."
              rows={4}
              className="w-full px-3 py-2 text-sm bg-muted/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {profile?.bio || 'No bio yet.'}
            </p>
          )}
        </GlassCard>

        {/* Social links */}
        <GlassCard>
          <h3 className="text-sm font-medium text-foreground mb-3">Links</h3>
          {editing ? (
            <div className="space-y-2">
              {[
                { key: 'linkedin', placeholder: 'LinkedIn URL', icon: Linkedin },
                { key: 'twitter', placeholder: 'Twitter/X handle', icon: Twitter },
                { key: 'website', placeholder: 'Website URL', icon: Globe },
              ].map(({ key, placeholder, icon: Icon }) => (
                <div key={key} className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="pl-9 h-8 text-sm"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {[
                { value: profile?.linkedin, icon: Linkedin, label: 'LinkedIn' },
                { value: profile?.twitter, icon: Twitter, label: 'Twitter' },
                { value: profile?.website, icon: Globe, label: 'Website' },
              ].filter((l) => l.value).map(({ value, icon: Icon, label }) => (
                <a key={label} href={value!} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Icon className="w-3.5 h-3.5" />
                  {value}
                </a>
              ))}
              {!profile?.linkedin && !profile?.twitter && !profile?.website && (
                <p className="text-sm text-muted-foreground">No links added yet.</p>
              )}
            </div>
          )}
        </GlassCard>

        {/* Skills */}
        {profile?.skills && profile.skills.length > 0 && (
          <GlassCard>
            <h3 className="text-sm font-medium text-foreground mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full text-xs border border-border text-muted-foreground bg-muted/30">
                  {skill}
                </span>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Interests */}
        {profile?.interests && profile.interests.length > 0 && (
          <GlassCard>
            <h3 className="text-sm font-medium text-foreground mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span key={interest} className="px-3 py-1 rounded-full text-xs border border-primary/30 text-primary bg-primary/5">
                  {interest}
                </span>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
