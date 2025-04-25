
import { supabase } from "@/integrations/supabase/client";

export interface FinancialHabit {
  id: string;
  user_id: string;
  name: string;
  target: string;
  current_streak: number;
  best_streak: number;
  last_completed_at: string | null;
  created_at?: string;
}

export async function getHabits() {
  const { data, error } = await supabase
    .from('financial_habits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as FinancialHabit[];
}

export async function addHabit(habit: Omit<FinancialHabit, 'id' | 'created_at' | 'current_streak' | 'best_streak' | 'last_completed_at' | 'user_id'>) {
  // Obter o usuário atual
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Usuário não autenticado");
  
  const { data, error } = await supabase
    .from('financial_habits')
    .insert({
      ...habit,
      user_id: user.id,
      current_streak: 0,
      best_streak: 0,
      last_completed_at: null
    })
    .select()
    .single();

  if (error) throw error;
  return data as FinancialHabit;
}

export async function updateHabit(id: string, habit: Partial<Omit<FinancialHabit, 'id' | 'created_at' | 'user_id'>>) {
  const { data, error } = await supabase
    .from('financial_habits')
    .update(habit)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as FinancialHabit;
}

export async function toggleHabitCompletion(id: string, completed: boolean) {
  const today = new Date().toISOString().split('T')[0];
  
  // Obtemos o hábito atual
  const { data: habit, error: fetchError } = await supabase
    .from('financial_habits')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;
  
  // Verificamos se está completando ou desmarcando
  let current_streak = habit.current_streak;
  let best_streak = habit.best_streak;
  let last_completed_at = habit.last_completed_at;
  
  if (completed) {
    // Completando o hábito
    current_streak += 1;
    if (current_streak > best_streak) {
      best_streak = current_streak;
    }
    last_completed_at = today;
  } else {
    // Desmarcando o hábito
    current_streak = Math.max(0, current_streak - 1);
    last_completed_at = current_streak > 0 ? last_completed_at : null;
  }
  
  // Atualizamos o hábito
  const { data, error } = await supabase
    .from('financial_habits')
    .update({
      current_streak,
      best_streak,
      last_completed_at,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as FinancialHabit;
}

export async function deleteHabit(id: string) {
  const { error } = await supabase
    .from('financial_habits')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
