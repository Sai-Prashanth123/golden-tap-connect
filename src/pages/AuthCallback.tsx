import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { apiGoogleVerify } from '@/services/auth.service';
import { useAppStore } from '@/store/appStore';
import type { UserRole } from '@/store/appStore';
import { takePostAuthReturnPath } from '@/lib/loginReturnPath';

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

    const pendingRole = localStorage.getItem('fk-oauth-role') ?? 'attendee';
    localStorage.removeItem('fk-oauth-role');
    console.log('[AuthCallback] pendingRole from localStorage:', pendingRole);

    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error || !session) {
        console.error('[AuthCallback] OAuth session error:', error?.message ?? 'No session');
        navigate('/login');
        return;
      }

      try {
        console.log('[AuthCallback] Calling googleVerify with role:', pendingRole);
        const { user } = await apiGoogleVerify(session.access_token, pendingRole);
        console.log('[AuthCallback] Verified user — role:', user.role, '→ navigating to:', ROLE_PATHS[user.role]);
        login(user);
        // Collect phone if not already set
        if (!user.phone) {
          navigate('/onboarding/phone');
        } else {
          const returnTo = takePostAuthReturnPath();
          navigate(returnTo ?? ROLE_PATHS[user.role] ?? '/dashboard');
        }
      } catch (err) {
        console.error('[AuthCallback] Google verify failed:', err);
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
