import { supabase  } from '@/lib/supabase/client'
import { Profile } from '@/types';

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
  
  export async function updateProfile(profile: Partial<Profile>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single();
      
    return { data, error };
  }