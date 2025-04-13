import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";
import { AuthType } from "../types/auth";
import { User } from "@supabase/supabase-js";

export function useAuth(): AuthType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      setIsLoading(false);
    };
    
    getInitialSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    isAuthenticated: !!user,
    user: user
      ? {
          username: user.email?.split('@')[0] || 'user',
          emailAddresses: [{ emailAddress: user.email || '' }],
          userId: user.id,
          imageUrl: user.user_metadata?.avatar_url || '',
          displayName: user.user_metadata?.first_name + ' ' + user.user_metadata?.last_name || 'User',
        }
      : null,
    id: user?.id,
    avatar_url: user?.user_metadata?.avatar_url || '',
    isLoading,
    getToken,
    signOut,
  };
}