
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

export async function getUserProfile() {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("Usuário não autenticado");
  }
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.user.id)
    .single();
    
  if (error) throw error;
  return data as UserProfile;
}

export async function updateUserProfile(profile: Partial<UserProfile>) {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("Usuário não autenticado");
  }
  
  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", user.user.id)
    .select()
    .single();
    
  if (error) throw error;
  return data as UserProfile;
}
