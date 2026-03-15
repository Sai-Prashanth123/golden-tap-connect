import { useState } from 'react';
import { OrganizerLayout } from '@/components/OrganizerLayout';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { ArrowRight, ArrowLeft, Calendar, Image, Users, Settings, Check } from 'lucide-react';

const CreateEventPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <OrganizerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display text-3xl font-semibold text-foreground">Create Event</h1>

        {/* Progress */}
        <div className="flex gap-2">
          {['Basics', 'Seats', 'Speakers', 'Config', 'Review'].map((label, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1 rounded-full mb-1 ${i + 1 <= step ? 'gold-gradient-bg' : 'bg-border'}`} />
              <p className={`text-[10px] ${i + 1 === step ? 'text-primary' : 'text-muted-foreground'}`}>{label}</p>
            </div>
          ))}
        </div>

        <GlassCard>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">Event Basics</h2>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Event Name</label>
                <input className="gold-input w-full" placeholder="AI Founders Meetup" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
                <textarea className="gold-input w-full h-24 resize-none" placeholder="Describe your event..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Date</label>
                  <input type="date" className="gold-input w-full" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Time</label>
                  <input type="time" className="gold-input w-full" />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Venue</label>
                <input className="gold-input w-full" placeholder="Bangalore International Centre" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">Seat Types</h2>
              {['Premium', 'Gold', 'Silver'].map((tier) => (
                <div key={tier} className="glass-card p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-foreground">{tier}</p>
                    <input className="gold-input w-24 text-right text-sm" placeholder="$0" />
                  </div>
                  <p className="text-xs text-muted-foreground">Features: Food, tea/coffee, lounge access</p>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">Speakers & Guests</h2>
              <div className="glass-card p-4">
                <div className="grid grid-cols-2 gap-3">
                  <input className="gold-input" placeholder="Speaker name" />
                  <input className="gold-input" placeholder="Title / Role" />
                </div>
                <Button variant="gold-ghost" size="sm" className="mt-3">+ Add Speaker</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">Networking Config</h2>
              {['AI Matchmaking', 'Leaderboard', 'Scavenger Hunt', 'Spin-to-Meet'].map((feature) => (
                <div key={feature} className="flex items-center justify-between p-3 glass-card">
                  <span className="text-sm text-foreground">{feature}</span>
                  <div className="w-10 h-6 rounded-full bg-primary/30 relative cursor-pointer">
                    <div className="w-5 h-5 rounded-full gold-gradient-bg absolute right-0.5 top-0.5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full gold-gradient-bg flex items-center justify-center mx-auto gold-glow">
                <Check className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground">Ready to Publish!</h2>
              <p className="text-sm text-muted-foreground">Your event will be live and visible to attendees</p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 1 && <Button variant="gold-ghost" onClick={() => setStep(step - 1)}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>}
            <Button variant="gold" className="flex-1" size="lg" onClick={() => step < 5 ? setStep(step + 1) : navigate('/organizer/dashboard')}>
              {step === 5 ? 'Publish Event' : <>Continue <ArrowRight className="w-4 h-4 ml-1" /></>}
            </Button>
          </div>
        </GlassCard>
      </div>
    </OrganizerLayout>
  );
};

export default CreateEventPage;
