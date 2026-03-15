import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { useAppStore } from '@/store/appStore';
import { LayoutDashboard, Users, Calendar, BarChart3, Settings, LogOut, Shield } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Events', icon: Calendar, path: '/admin/events' },
  { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { label: 'Permissions', icon: Shield, path: '/admin/permissions' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAppStore((s) => s.logout);
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex flex-col w-64 border-r border-border p-4 fixed h-full z-40 bg-background">
        <div className="mb-2 px-2"><Logo /></div>
        <div className="flex items-center gap-1 gold-pill text-[10px] mb-6 ml-2 w-fit">
          <Shield className="w-3 h-3" /> Admin
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                <item.icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 w-full">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </aside>
      <div className="flex-1 md:ml-64">
        <main className="p-4 md:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
};
