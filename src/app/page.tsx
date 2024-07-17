"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Auth from '@/components/Auth';
import Chat from '@/components/Chat';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Page() {
  const { session, loading } = useSupabaseAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (session?.user) {
      setAvatarUrl(session.user.user_metadata?.avatar_url || null);
    }
  }, [session]);

  const handleSignOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
  }, [supabase.auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isLoggedIn = !!session;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Public Chat Forum</h1>

      <Chat
        session={session}
        avatarUrl={avatarUrl || ''}
        userEmail={session?.user.email || ''}
        isLoggedIn={isLoggedIn}
      />

      {!isLoggedIn && (
        <Card>
          <CardHeader>
            <CardTitle>User Authentication</CardTitle>
            <CardDescription>Sign in to start chatting</CardDescription>
          </CardHeader>
          <CardContent>
            <Auth />
          </CardContent>
        </Card>
      )}

      {isLoggedIn && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={avatarUrl || `https://ui-avatars.com/api/?name=${session.user.email}`} />
                  <AvatarFallback>{session.user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">Logged in as:</p>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>
              </div>
              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}