import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithPasswordAndOtp: (email: string, password: string) => Promise<{ error: any; needsOtp?: boolean; }>;
  verifyLoginOtp: (token: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [tempCredentials, setTempCredentials] = useState<{email: string, password: string} | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session and handle errors
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error);
          // Clear any invalid tokens
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithPasswordAndOtp = async (email: string, password: string) => {
    // Use security definer function to get agent details
    const { data: agent, error: agentError } = await supabase
      .rpc('get_agent_for_auth', { agent_email: email });

    if (agentError) {
      return { error: new Error(`Database error: ${agentError.message}`) };
    }

    if (!agent || agent.length === 0) {
      return { error: new Error('Agent not found. Please contact admin.') };
    }

    const agentData = agent[0];
    
    // Store credentials temporarily for OTP verification
    setTempCredentials({ email, password });

    // Send OTP to email (phone OTP is disabled in your Supabase project)
    const { error: emailOtpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      }
    });

    if (emailOtpError) {
      return { error: emailOtpError };
    }

    return { error: null, needsOtp: true };
  };

  const verifyLoginOtp = async (token: string) => {
    if (!tempCredentials) {
      return { error: new Error('No pending authentication session') };
    }

    // Try to verify with email first
    const { error: emailError } = await supabase.auth.verifyOtp({
      email: tempCredentials.email,
      token,
      type: 'email',
    });

    if (!emailError) {
      setTempCredentials(null);
      return { error: null };
    }

    // If email verification fails, try with phone (get phone from agent data)
    const { data: agent } = await supabase
      .rpc('get_agent_for_auth', { agent_email: tempCredentials.email });

    if (agent?.[0]?.phone) {
      const { error: phoneError } = await supabase.auth.verifyOtp({
        phone: agent[0].phone,
        token,
        type: 'sms',
      });

      if (!phoneError) {
        setTempCredentials(null);
        return { error: null };
      }
    }

    return { error: new Error('Invalid OTP') };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithPasswordAndOtp,
    verifyLoginOtp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};