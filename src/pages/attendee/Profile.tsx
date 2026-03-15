import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  MapPin, Linkedin, Twitter, Globe, Mail, Edit3, CreditCard, Camera,
  Phone, User, Building, GraduationCap, Save, X, Plus, Trash2,
  Wallet, Power, RefreshCw, Check, AlertTriangle,
} from 'lucide-react';

const tagColors = ['bg-amber-500/10 text-amber-400 border border-amber-500/20', 'bg-blue-500/10 text-blue-400 border border-blue-500/20', 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', 'bg-purple-500/10 text-purple-400 border border-purple-500/20'];

const ProfilePage = () => {
  const { user, updateUser, deactivateCard, activateCard } = useAppStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [showCardMenu, setShowCardMenu] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newLookingFor, setNewLookingFor] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    designation: user?.designation || '',
    company: user?.company || '',
    accountType: user?.accountType || 'company',
    phone: user?.phone || '',
    gender: user?.gender || '',
    age: user?.age?.toString() || '',
    bio: user?.bio || '',
    industry: user?.industry || '',
    location: user?.location || '',
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || '',
    website: user?.website || '',
    skills: [...(user?.skills || [])],
    interests: [...(user?.interests || [])],
    lookingFor: [...(user?.lookingFor || [])],
  });

  if (!user) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateUser({ photoUrl: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateUser({
      ...form,
      age: form.age ? parseInt(form.age) : undefined,
    });
    setEditing(false);
  };

  const addTag = (field: 'skills' | 'interests' | 'lookingFor', value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    setForm((f) => ({ ...f, [field]: [...f[field], value.trim()] }));
    setter('');
  };

  const removeTag = (field: 'skills' | 'interests' | 'lookingFor', idx: number) => {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));
  };

  const displayData = editing ? form : {
    name: user.name,
    designation: user.designation,
    company: user.company,
    accountType: user.accountType,
    phone: user.phone,
    gender: user.gender,
    age: user.age?.toString(),
    bio: user.bio,
    industry: user.industry,
    location: user.location,
    linkedin: user.linkedin,
    twitter: user.twitter,
    website: user.website,
    skills: user.skills,
    interests: user.interests,
    lookingFor: user.lookingFor,
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-8">

        {/* Header Card */}
        <GlassCard className="relative overflow-hidden">
          {/* Background shimmer */}
          <div className="absolute inset-0 gold-gradient-bg opacity-5 pointer-events-none" />

          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/30">
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-3xl font-display font-bold">
                    {user.name[0]}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Camera className="w-4 h-4 text-primary-foreground" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              {editing ? (
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="gold-input text-xl font-semibold mb-1 w-full" />
              ) : (
                <h1 className="font-display text-2xl font-semibold text-foreground">{user.name}</h1>
              )}

              {editing ? (
                <div className="flex gap-2 mt-1">
                  <input value={form.designation} onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))} className="gold-input flex-1 text-sm" placeholder="Designation" />
                  <input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className="gold-input flex-1 text-sm" placeholder="Company" />
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">{user.designation} · {user.company}</p>
              )}

              {/* Badges */}
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start flex-wrap">
                {user.tier === 'founder' && (
                  <span className="gold-pill text-[10px] flex items-center gap-1"><CreditCard className="w-3 h-3" /> FounderCard</span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-[10px] border ${user.accountType === 'student' ? 'border-blue-500/40 text-blue-400' : 'border-emerald-500/40 text-emerald-400'}`}>
                  {user.accountType === 'student' ? '🎓 Student' : '🏢 Company'}
                </span>
                {user.location && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {user.location}</span>
                )}
              </div>
            </div>

            {/* Edit toggle */}
            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button variant="gold" size="sm" onClick={handleSave}><Save className="w-4 h-4 mr-1" /> Save</Button>
                  <Button variant="gold-ghost" size="sm" onClick={() => setEditing(false)}><X className="w-4 h-4" /></Button>
                </>
              ) : (
                <Button variant="gold" size="sm" onClick={() => { setForm({ name: user.name, designation: user.designation || '', company: user.company || '', accountType: user.accountType || 'company', phone: user.phone || '', gender: user.gender || '', age: user.age?.toString() || '', bio: user.bio || '', industry: user.industry || '', location: user.location || '', linkedin: user.linkedin || '', twitter: user.twitter || '', website: user.website || '', skills: [...(user.skills || [])], interests: [...(user.interests || [])], lookingFor: [...(user.lookingFor || [])], }); setEditing(true); }}>
                  <Edit3 className="w-4 h-4 mr-1" /> Edit
                </Button>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Connections', value: user.connectionsCount },
            { label: 'Events', value: user.eventsAttended },
            { label: 'FK Score', value: user.fkScore },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="text-center py-4">
                <p className="font-display text-2xl font-bold gold-gradient-text">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Personal Details */}
        <GlassCard>
          <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Personal Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Phone', field: 'phone', icon: Phone, type: 'tel' },
              { label: 'Gender', field: 'gender', icon: User, type: 'select', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
              { label: 'Age', field: 'age', icon: User, type: 'number' },
              { label: 'Industry', field: 'industry', icon: Building, type: 'text' },
              { label: 'Location', field: 'location', icon: MapPin, type: 'text' },
              { label: 'Account Type', field: 'accountType', icon: user.accountType === 'student' ? GraduationCap : Building, type: 'select', options: ['company', 'student'] },
            ].map(({ label, field, icon: Icon, type, options }) => (
              <div key={field}>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Icon className="w-3 h-3" /> {label}</label>
                {editing ? (
                  type === 'select' ? (
                    <select value={(form as any)[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} className="gold-input w-full text-sm">
                      {options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={type} value={(form as any)[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} className="gold-input w-full text-sm" />
                  )
                ) : (
                  <p className="text-sm text-foreground py-2 px-3 rounded-lg bg-muted/20">{(displayData as any)[field] || <span className="text-muted-foreground italic">Not set</span>}</p>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Bio */}
        <GlassCard>
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">About</h3>
          {editing ? (
            <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} className="gold-input w-full h-24 resize-none text-sm" placeholder="Tell your story..." />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">{user.bio || <span className="italic">No bio yet.</span>}</p>
          )}
        </GlassCard>

        {/* Tags Section */}
        {(['skills', 'interests', 'lookingFor'] as const).map((field, fi) => (
          <GlassCard key={field}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-semibold text-foreground capitalize">
                {field === 'lookingFor' ? 'Looking For' : field.charAt(0).toUpperCase() + field.slice(1)}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <AnimatePresence>
                {(editing ? form[field] : user[field] || []).map((tag, i) => (
                  <motion.span
                    key={tag + i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${tagColors[fi % tagColors.length]}`}
                  >
                    {tag}
                    {editing && (
                      <button onClick={() => removeTag(field, i)} className="hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            {editing && (
              <div className="flex gap-2">
                <input
                  value={field === 'skills' ? newSkill : field === 'interests' ? newInterest : newLookingFor}
                  onChange={(e) => field === 'skills' ? setNewSkill(e.target.value) : field === 'interests' ? setNewInterest(e.target.value) : setNewLookingFor(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag(field, field === 'skills' ? newSkill : field === 'interests' ? newInterest : newLookingFor, field === 'skills' ? setNewSkill : field === 'interests' ? setNewInterest : setNewLookingFor)}
                  className="gold-input flex-1 text-sm"
                  placeholder={`Add ${field === 'lookingFor' ? 'what you seek' : field.slice(0, -1)}...`}
                />
                <Button variant="gold-ghost" size="sm" onClick={() => addTag(field, field === 'skills' ? newSkill : field === 'interests' ? newInterest : newLookingFor, field === 'skills' ? setNewSkill : field === 'interests' ? setNewInterest : setNewLookingFor)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </GlassCard>
        ))}

        {/* Social Links */}
        <GlassCard>
          <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Links
          </h3>
          <div className="space-y-3">
            {[
              { icon: Linkedin, label: 'LinkedIn', field: 'linkedin' },
              { icon: Twitter, label: 'Twitter / X', field: 'twitter' },
              { icon: Globe, label: 'Website', field: 'website' },
              { icon: Mail, label: 'Email', field: 'email', readOnly: true },
            ].map(({ icon: Icon, label, field, readOnly }) => (
              <div key={field} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                {editing && !readOnly ? (
                  <input
                    value={(form as any)[field] || ''}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="gold-input flex-1 text-sm"
                    placeholder={label}
                  />
                ) : (
                  <a
                    href={(field === 'email' ? `mailto:${user.email}` : (user as any)[field]) || '#'}
                    className="flex-1 text-sm text-foreground hover:text-primary transition-colors truncate"
                  >
                    {field === 'email' ? user.email : (user as any)[field] || <span className="text-muted-foreground italic">Not set</span>}
                  </a>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* FounderCard */}
        <GlassCard className={user.cardStatus === 'active' ? 'gold-border-glow' : ''}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">FounderCard</h3>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${user.cardStatus === 'active' ? 'bg-green-500 animate-pulse' : user.cardStatus === 'deactivated' ? 'bg-red-500' : user.cardStatus === 'pending' ? 'bg-yellow-500' : 'bg-muted-foreground'}`} />
                  <span className="text-xs text-muted-foreground capitalize">{user.cardStatus === 'none' ? 'Not applied' : user.cardStatus}</span>
                </div>
              </div>
            </div>
            {user.cardStatus === 'active' && (
              <Button variant="gold-ghost" size="sm" onClick={() => setShowCardMenu(!showCardMenu)}>
                Manage
              </Button>
            )}
          </div>

          {user.cardStatus === 'active' && user.cardQR && (
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="bg-foreground p-3 rounded-2xl">
                <QRCodeSVG value={user.cardQR} size={120} bgColor="#E8E0D0" fgColor="#0D0D0D" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-3">Your QR is live — scan at any event to connect instantly.</p>
                {/* Wallet buttons */}
                <div className="space-y-2">
                  <Button
                    variant="gold-ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => updateUser({ walletAdded: true })}
                  >
                    <Wallet className="w-4 h-4" />
                    {user.walletAdded ? <><Check className="w-3 h-3 text-green-500 mr-1" /> Added to Wallet</> : 'Add to Apple Wallet'}
                  </Button>
                  <Button
                    variant="gold-ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => updateUser({ walletAdded: true })}
                  >
                    <Wallet className="w-4 h-4" />
                    {user.walletAdded ? <><Check className="w-3 h-3 text-green-500 mr-1" /> Added to Wallet</> : 'Add to Google Wallet'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence>
            {showCardMenu && user.cardStatus === 'active' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-border overflow-hidden"
              >
                <div className="flex gap-3">
                  <Button
                    variant="gold-ghost"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => navigate('/apply-card')}
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" /> Order New Card
                  </Button>
                  <Button
                    variant="gold-ghost"
                    size="sm"
                    className="flex-1 text-xs text-red-400 hover:text-red-300 border-red-500/30 hover:bg-red-500/10"
                    onClick={() => setShowDeactivateConfirm(true)}
                  >
                    <Power className="w-3.5 h-3.5 mr-1" /> Deactivate Card
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Deactivate Confirm */}
          <AnimatePresence>
            {showDeactivateConfirm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Deactivate FounderCard?</p>
                    <p className="text-xs text-muted-foreground mt-1">Your QR and NFC will stop working immediately. You can reactivate anytime.</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs" onClick={() => { deactivateCard(); setShowDeactivateConfirm(false); setShowCardMenu(false); }}>
                        <Trash2 className="w-3 h-3 mr-1" /> Deactivate
                      </Button>
                      <Button variant="gold-ghost" size="sm" className="text-xs" onClick={() => setShowDeactivateConfirm(false)}>Cancel</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {user.cardStatus === 'none' && (
            <div>
              <p className="text-sm text-muted-foreground mb-3">Get your premium NFC card for one-tap connections</p>
              <Button variant="gold" size="sm" onClick={() => navigate('/apply-card')}>
                Apply for FounderCard
              </Button>
            </div>
          )}

          {user.cardStatus === 'deactivated' && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Your card is deactivated</p>
              <Button variant="gold" size="sm" onClick={activateCard}>Reactivate</Button>
            </div>
          )}
        </GlassCard>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
