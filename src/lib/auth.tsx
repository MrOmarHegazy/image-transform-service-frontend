import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

const IDLE_TIMEOUT_MS = 20 * 60 * 1000;

interface SignUpResult {
  needsVerification: boolean;
  alreadyExists: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSignOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (!session) return;
    idleTimer.current = setTimeout(() => {
      performSignOut();
    }, IDLE_TIMEOUT_MS);
  }, [session, performSignOut]);

  useEffect(() => {
    if (!session) return;
    const events = ["mousedown", "keydown", "scroll", "touchstart"] as const;
    const handler = () => resetIdleTimer();
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    resetIdleTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [session, resetIdleTimer]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string): Promise<SignUpResult> => {
    if (!supabase)
      throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      const msg = error.message?.toLowerCase() ?? "";
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        return { needsVerification: false, alreadyExists: true };
      }
      throw error;
    }

    if (data.user?.identities?.length === 0) {
      return { needsVerification: false, alreadyExists: true };
    }

    const needsVerification =
      !data.session || !data.user?.email_confirmed_at;

    if (needsVerification && data.session) {
      await supabase.auth.signOut();
    }

    return { needsVerification, alreadyExists: false };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase)
      throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await performSignOut();
  };

  const resendVerification = async (email: string) => {
    if (!supabase)
      throw new Error("Supabase is not configured.");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    if (!supabase)
      throw new Error("Supabase is not configured.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resendVerification,
        resetPassword,
        token: session?.access_token ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
