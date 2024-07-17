"use client"

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthError } from '@supabase/supabase-js';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const handleAuth = useCallback(async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const authFunction = isLogin
        ? () => supabase.auth.signInWithPassword({ email, password })
        : () => supabase.auth.signUp({ email, password });

      const { error } = await authFunction();
      if (error) throw error;
      
      if (!isLogin) {
        setError("Check your email for the confirmation link.");
      }
      console.log(isLogin ? 'Sign in successful' : 'Sign up successful');
    } catch (error) {
      console.error(isLogin ? 'Sign in error:' : 'Sign up error:', error);
      setError(error instanceof AuthError ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [email, password, supabase.auth]);

  const handleLogin = useCallback((e: React.FormEvent) => handleAuth(e, true), [handleAuth]);
  const handleSignUp = useCallback((e: React.FormEvent) => handleAuth(e, false), [handleAuth]);

  return (
    <div className="space-y-4">
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex space-x-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Sign In'}
          </Button>
          <Button type="button" onClick={handleSignUp} disabled={loading}>
            Sign Up
          </Button>
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}