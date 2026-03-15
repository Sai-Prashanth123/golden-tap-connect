import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { useAppStore } from '@/store/appStore';
import {
  Home, Scan, Calendar, Users, Trophy, Bell, User,
  LogOut, Compass, QrCode, Zap,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: Home, path: '/dashboard' },
  { label: 'Connect', icon: Scan, path: '/connect' },
  { label: 'Events', icon: Calendar, path: '/events' },
  { label: 'Network', icon: Users, path: '/connections' },
  { label: 'Discover', icon: Compass, path: '/discover' },
  { label: 'Achievements', icon: Trophy, path: '/gamification' },
  { label: 'My Card', icon: QrCode, path: '/apply-card' },
];

const bottomNav = [
  { label: 'Dashboard', icon: Home, path: '/dashboard' },
  { label: 'Connect', icon: Scan, path: '/connect' },
  { label: 'Events', icon: Calendar, path: '/events' },
  { label: 'Network', icon: Users, path: '/connections' },
];

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[240px] fixed h-full z-40 border-r border-border overflow-hidden bg-card">

        <div className="relative z-10 flex flex-col h-full p-4">
          {/* Logo */}
          <div className="px-2 py-3 mb-6">
            <Logo />
          </div>

          {/* User card */}
          <Link to="/profile" className="group mb-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-secondary transition-colors">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground text-sm font-semibold overflow-hidden">
                  {user?.photoUrl
                    ? <img src={user.photoUrl} className="w-full h-full object-cover" alt="" />
                    : user?.name?.[0] || 'U'
                  }
                </div>
                {user?.cardStatus === 'active' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user?.name || 'User'}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.designation || 'Member'}</p>
              </div>
              {user?.tier === 'founder' && (
                <span className="gold-pill text-[9px] flex-shrink-0">Pro</span>
              )}
            </div>
          </Link>

          {/* FK Score mini */}
          <div className="mb-5 p-3 rounded-xl bg-muted/40 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="section-label">FK Score</span>
              <span className="text-sm font-semibold text-foreground">{user?.fkScore || 87}</span>
            </div>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${user?.fkScore || 87}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">Gold tier · {user?.connectionsCount || 0} connections</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-0.5">
            {navItems.map((item, i) => {
              const active = location.pathname === item.path;
              return (
                <motion.div key={item.path} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
                  <Link to={item.path} className={`nav-item ${active ? 'active' : ''}`}>
                    <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-primary' : ''}`} />
                    <span>{item.label}</span>
                    {active && (
                      <motion.div layoutId="nav-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="space-y-0.5 pt-4 border-t border-white/[0.05]">
            <Link to="/profile" className="nav-item">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <Link to="/notifications" className="nav-item">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </Link>
            <button onClick={handleLogout} className="nav-item w-full text-left hover:text-red-400 hover:bg-red-500/5">
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <div className="flex-1 md:ml-[240px] min-h-screen">

        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-white/[0.05] backdrop-blur-xl bg-background/80">
          <Logo size="sm" />
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="w-9 h-9 rounded-xl glass-card flex items-center justify-center">
              <Bell className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link to="/profile">
              <div className="w-9 h-9 rounded-xl gold-gradient-bg flex items-center justify-center text-primary-foreground text-xs font-bold overflow-hidden">
                {user?.photoUrl
                  ? <img src={user.photoUrl} className="w-full h-full object-cover" alt="" />
                  : user?.name?.[0] || 'U'
                }
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-7 max-w-[1180px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Mobile Bottom Nav ─────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="glass-card-elevated flex justify-around py-2 rounded-2xl">
          {bottomNav.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 py-2 px-4 relative">
                <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-[10px] font-medium transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="mobile-nav"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full gold-gradient-bg"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
