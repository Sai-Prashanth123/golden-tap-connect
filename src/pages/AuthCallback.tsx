import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { apiGoogleVerify } from '@/services/auth.service';
import { useAppStore } from '@/store/appStore';
import type { UserRole } from '@/store/appStore';

const ROLE_PATHS: Record<UserRole, string> = {
  attendee: '/dashboard',
  organizer: '/organizer/dashboard',
  admin: '/admin/dashboard',
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const login = useAppStore((s) => s.login);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const pendingRole = sessionStorage.getItem('fk-oauth-role') ?? 'attendee';
    sessionStorage.removeItem('fk-oauth-role');

    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error || !session) {
        console.error('OAuth session error:', error?.message ?? 'No session');
        navigate('/login');
        return;
      }

      try {
        const { user } = await apiGoogleVerify(session.access_token, pendingRole);
        login(user);
        // Collect phone if not already set
        if (!user.phone) {
          navigate('/onboarding/phone');
        } else {
          navigate(ROLE_PATHS[user.role] ?? '/dashboard');
        }
      } catch (err) {
        console.error('Google verify failed:', err);
        navigate('/login');
      }
    });
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground text-sm">Completing sign-in…</p>
      </div>
    </div>
  );
};

export default AuthCallback;
