import { LandingNav } from '@/components/LandingNav';
import { ParticleBackground } from '@/components/ParticleBackground';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Nfc, Users, Trophy, MessageSquare, BarChart3,
  UserPlus, Scan, Handshake, Check, Star, ArrowRight, Zap
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const FounderCardMockup = () => (
  <div className="relative w-[340px] h-[210px] animate-float">
    <div className="absolute inset-0 rounded-2xl gold-gradient-bg opacity-10 blur-2xl" />
    <div className="relative w-full h-full rounded-2xl glass-card p-6 flex flex-col justify-between gold-border-glow">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary fill-primary" />
          <span className="font-display text-lg gold-gradient-text font-semibold">FounderKey</span>
        </div>
        <Nfc className="w-5 h-5 text-gold-dim" />
      </div>
      <div>
        <p className="font-display text-xl text-foreground">Alex Chen</p>
        <p className="text-sm text-muted-foreground">Founder & CEO · NexusAI</p>
      </div>
      <div className="flex gap-2">
        <div className="gold-pill text-[10px]">AI/ML</div>
        <div className="gold-pill text-[10px]">YC W22</div>
        <div className="gold-pill text-[10px]">SF Bay</div>
      </div>
    </div>
  </div>
);

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <ParticleBackground />
    <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <motion.div className="flex-1 text-center lg:text-left" {...fadeUp}>
          <div className="gold-pill inline-flex items-center gap-1.5 mb-6">
            <Star className="w-3 h-3" /> Premium Networking Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-semibold leading-[1.1] mb-6">
            Your network,{' '}
            <span className="gold-gradient-text">one tap</span>{' '}
            away
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 font-body">
            The premium event networking platform for founders, builders & leaders.
            Connect via NFC, discover AI-matched people, build lasting relationships.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Button variant="gold" size="xl" asChild>
              <Link to="/register">Get Started Free <ArrowRight className="w-5 h-5 ml-1" /></Link>
            </Button>
            <Button variant="gold-ghost" size="xl" asChild>
              <a href="#features">See How It Works</a>
            </Button>
          </div>
        </motion.div>
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <FounderCardMockup />
        </motion.div>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
  </section>
);

const HowItWorks = () => {
  const steps = [
    { icon: UserPlus, title: 'Create your profile', desc: 'Set up your professional identity in 60 seconds. AI helps optimize your profile for meaningful matches.' },
    { icon: Scan, title: 'Tap or scan to connect', desc: 'Use your NFC FounderCard or QR code at events. One tap captures the connection instantly.' },
    { icon: Handshake, title: 'Build relationships', desc: 'AI-powered nudges, shared notes, and warm intros help you turn contacts into lasting partnerships.' },
  ];
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div className="text-center mb-16" {...fadeUp}>
          <h2 className="text-4xl md:text-5xl font-display font-semibold mb-4">
            How it <span className="gold-gradient-text">works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Three steps to transform how you network at events</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 bento-stagger">
          {steps.map((s, i) => (
            <GlassCard key={i} hover className="text-center">
              <div className="w-14 h-14 rounded-2xl gold-gradient-bg flex items-center justify-center mx-auto mb-5">
                <s.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesBento = () => {
  const features = [
    { icon: Brain, title: 'AI Matchmaking', desc: 'Machine learning finds your ideal connections based on interests, goals, and past interactions.', wide: true },
    { icon: Nfc, title: 'NFC Cards', desc: 'Premium physical cards with NFC. One tap to share your full profile.' },
    { icon: Users, title: 'Network Graph', desc: 'Visualize your entire professional network with interactive connections.', tall: true },
    { icon: Trophy, title: 'Gamification', desc: 'Earn badges, climb leaderboards, and unlock rewards at events.' },
    { icon: MessageSquare, title: 'Smart Nudges', desc: 'AI reminds you to follow up with connections at the right time.' },
    { icon: BarChart3, title: 'Event Analytics', desc: 'Organizers get real-time engagement data, connection metrics, and lead scoring.', wide: true },
  ];
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div className="text-center mb-16" {...fadeUp}>
          <h2 className="text-4xl md:text-5xl font-display font-semibold mb-4">
            Everything you <span className="gold-gradient-text">need</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[180px] bento-stagger">
          {features.map((f, i) => (
            <GlassCard
              key={i}
              hover
              className={`flex flex-col justify-between ${f.wide ? 'lg:col-span-2' : ''} ${f.tall ? 'lg:row-span-2' : ''}`}
            >
              <div>
                <f.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      desc: 'Get started with basic networking',
      features: ['QR code connections', 'Up to 50 connections', 'Basic profile', '3 events per month'],
      featured: false,
    },
    {
      name: 'FounderCard',
      price: '$29',
      period: '/month',
      desc: 'Premium networking with NFC card',
      features: ['Physical NFC card', 'Unlimited connections', 'AI matchmaking', 'Priority at events', 'Network graph', 'Analytics dashboard', 'Warm intros'],
      featured: true,
    },
  ];
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div className="text-center mb-16" {...fadeUp}>
          <h2 className="text-4xl md:text-5xl font-display font-semibold mb-4">
            Simple <span className="gold-gradient-text">pricing</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto bento-stagger">
          {tiers.map((t, i) => (
            <GlassCard key={i} hover className={`relative ${t.featured ? 'gold-border-glow scale-[1.02]' : ''}`}>
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gold-gradient-bg text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="font-display text-2xl font-semibold text-foreground mb-1">{t.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-display font-bold gold-gradient-text">{t.price}</span>
                {t.period && <span className="text-muted-foreground text-sm">{t.period}</span>}
              </div>
              <p className="text-muted-foreground text-sm mb-6">{t.desc}</p>
              <ul className="space-y-3 mb-8">
                {t.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant={t.featured ? 'gold' : 'gold-ghost'} className="w-full" asChild>
                <Link to="/register">{t.featured ? 'Get FounderCard' : 'Start Free'}</Link>
              </Button>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    { name: 'Priya Sharma', role: 'CEO, TechVentures', quote: 'FounderKey transformed how I network at events. The AI matchmaking alone saved me hours of wandering conference floors.', event: 'BLR Tech Week' },
    { name: 'James Liu', role: 'Partner, Sequoia', quote: 'The NFC card experience is magical. One tap and we\'re connected with full context. No more business card piles.', event: 'YC Demo Day' },
    { name: 'Sarah Mitchell', role: 'Founder, GreenScale', quote: 'The follow-up nudges are genius. I actually maintain the connections I make instead of letting them fade away.', event: 'Climate Summit' },
  ];
  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div className="text-center mb-16" {...fadeUp}>
          <h2 className="text-4xl md:text-5xl font-display font-semibold mb-4">
            Loved by <span className="gold-gradient-text">founders</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 bento-stagger">
          {testimonials.map((t, i) => (
            <GlassCard key={i} hover>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-4">"{t.quote}"</p>
              <div className="gold-pill text-[10px] inline-block">{t.event}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary fill-primary" />
          <span className="font-display text-lg gold-gradient-text font-semibold">FounderKey</span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 FounderKey. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const LandingPage = () => (
  <div className="min-h-screen bg-background">
    <LandingNav />
    <HeroSection />
    <HowItWorks />
    <FeaturesBento />
    <PricingSection />
    <TestimonialsSection />
    <Footer />
  </div>
);

export default LandingPage;
