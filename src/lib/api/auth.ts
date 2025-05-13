import { supabase  } from '@/lib/supabase/client'



export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// src/lib/api.ts - Add/update these functions

export async function signUp(email: string, password: string, userData: { name: string }) {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        full_name: userData.name
      }
    }
  });
  
  if (data.user && !error) {
    // Create initial profile
    await supabase.from('profiles').insert({
      id: data.user.id,
      name: userData.name,
      created_at: new Date().toISOString()
    });
  }
  
  return { data, error };
}

export async function signInWithOAuth(provider: 'google' | 'github' | 'facebook') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      skipBrowserRedirect: false,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  });
  
  return { data, error };
}

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return { data, error };
}