
import { supabase } from "@/integrations/supabase/client";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at?: string;
}

export async function getTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

export async function addTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function updateTransaction(id: string, transaction: Partial<Omit<Transaction, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('transactions')
    .update(transaction)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function getExpensesByCategory() {
  // Retorna a soma dos gastos por categoria (apenas valores negativos são considerados despesas)
  const { data, error } = await supabase
    .rpc('get_expenses_by_category')
    .select();
  
  if (error) {
    // Fallback: fazer a agregação manualmente se não tiver a função RPC
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('category, amount')
      .lt('amount', 0);
    
    if (txError) throw txError;
    
    // Agregar manualmente
    const categories: Record<string, number> = {};
    transactions.forEach(tx => {
      const absAmount = Math.abs(tx.amount);
      if (categories[tx.category]) {
        categories[tx.category] += absAmount;
      } else {
        categories[tx.category] = absAmount;
      }
    });
    
    // Converter para o formato esperado
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: Number(((value / Object.values(categories).reduce((a, b) => a + b, 0)) * 100).toFixed(0))
    }));
  }
  
  return data;
}
