import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { useAppStore } from '@/store/appStore';
import {
  Home, Scan, Calendar, Users, Trophy, Bell, User, Settings,
  LogOut, Compass, QrCode
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

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border p-4 fixed h-full z-40 bg-background">
        <div className="mb-8 px-2"><Logo /></div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border pt-4 space-y-1">
          <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50">
            <User className="w-4 h-4" /> Profile
          </Link>
          <Link to="/notifications" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50">
            <Bell className="w-4 h-4" /> Notifications
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Link to="/notifications"><Bell className="w-5 h-5 text-muted-foreground" /></Link>
            <Link to="/profile">
              <div className="w-8 h-8 rounded-full gold-gradient-bg flex items-center justify-center text-primary-foreground text-xs font-bold">
                {user?.name?.[0] || 'U'}
              </div>
            </Link>
          </div>
        </header>

        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card rounded-none border-b-0 border-x-0 flex justify-around py-2 z-50">
        {[navItems[0], navItems[1], navItems[2], navItems[3]].map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 py-1 px-3">
              <item.icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-[10px] ${active ? 'text-primary' : 'text-muted-foreground'}`}>{item.label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
