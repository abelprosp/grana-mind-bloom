
import { supabase } from "@/integrations/supabase/client";

export interface Transaction {
  id: string;
  user_id: string;
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

export async function addTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'user_id'>) {
  // Obter o usuário atual
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Usuário não autenticado");
  
  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...transaction, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function updateTransaction(id: string, transaction: Partial<Omit<Transaction, 'id' | 'created_at' | 'user_id'>>) {
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

export interface CategoryExpense {
  name: string;
  value: number;
}

export async function getExpensesByCategory(): Promise<CategoryExpense[]> {
  // Tentativa de usar a função RPC
  try {
    // Fix: Explicitly typing the RPC return value
    const { data, error } = await supabase.rpc<CategoryExpense[]>('get_expenses_by_category');
    
    if (error) throw error;
    return data as CategoryExpense[];
  } catch (error) {
    console.error("RPC função falhou, usando fallback:", error);
    
    // Fallback: fazer a agregação manualmente
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('category, amount')
      .lt('amount', 0);
    
    if (txError) throw txError;
    
    // Agregar manualmente
    const categories: Record<string, number> = {};
    transactions.forEach(tx => {
      const absAmount = Math.abs(Number(tx.amount));
      if (categories[tx.category]) {
        categories[tx.category] += absAmount;
      } else {
        categories[tx.category] = absAmount;
      }
    });
    
    // Calcular o total
    const total = Object.values(categories).reduce((a, b) => a + b, 0);
    
    // Converter para o formato esperado
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: Number(((value / total) * 100).toFixed(0))
    }));
  }
}
