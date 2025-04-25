
import { supabase } from "@/integrations/supabase/client";

export interface FinancialGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  created_at?: string;
}

export async function getGoals() {
  const { data, error } = await supabase
    .from('financial_goals')
    .select('*')
    .order('target_date', { ascending: true });

  if (error) throw error;
  return data as FinancialGoal[];
}

export async function addGoal(goal: Omit<FinancialGoal, 'id' | 'created_at' | 'user_id'>) {
  // Obter o usuário atual
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Usuário não autenticado");
  
  const { data, error } = await supabase
    .from('financial_goals')
    .insert({ ...goal, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data as FinancialGoal;
}

export async function updateGoal(id: string, goal: Partial<Omit<FinancialGoal, 'id' | 'created_at' | 'user_id'>>) {
  const { data, error } = await supabase
    .from('financial_goals')
    .update(goal)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as FinancialGoal;
}

export async function updateGoalAmount(id: string, amount: number) {
  // Primeiro, obtemos o objetivo atual
  const { data: goal, error: fetchError } = await supabase
    .from('financial_goals')
    .select('current_amount')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  // Atualizamos o valor atual
  const newAmount = (goal.current_amount || 0) + amount;
  
  const { data, error } = await supabase
    .from('financial_goals')
    .update({ current_amount: newAmount, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as FinancialGoal;
}

export async function deleteGoal(id: string) {
  const { error } = await supabase
    .from('financial_goals')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
