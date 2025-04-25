
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import OverviewCard from '@/components/dashboard/OverviewCard';
import ExpensesByCategory from '@/components/dashboard/ExpensesByCategory';
import GoalProgress from '@/components/dashboard/GoalProgress';
import HabitTracker from '@/components/dashboard/HabitTracker';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import FinancialTip from '@/components/dashboard/FinancialTip';
import { Wallet, TrendingUp, Target } from 'lucide-react';
import { getTransactions } from '@/services/transactions';
import { getGoals } from '@/services/goals';
import { getHabits } from '@/services/habits';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    enabled: !!user
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
    enabled: !!user
  });

  const { data: habits = [] } = useQuery({
    queryKey: ['habits'],
    queryFn: getHabits,
    enabled: !!user
  });

  // Calculate financial summary from transactions
  const financialSummary = React.useMemo(() => {
    if (!transactions.length) {
      return {
        income: 0,
        expenses: 0,
        balance: 0,
      };
    }

    return transactions.reduce((acc, transaction) => {
      const amount = Number(transaction.amount);
      if (amount > 0) {
        acc.income += amount;
      } else {
        acc.expenses += Math.abs(amount);
      }
      acc.balance += amount;
      return acc;
    }, { income: 0, expenses: 0, balance: 0 });
  }, [transactions]);

  // Format currency values
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Visão Geral</h1>
        <p className="text-muted-foreground">Bem-vindo de volta ao seu dashboard financeiro!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <OverviewCard
          title="Saldo Atual"
          value={formatCurrency(financialSummary.balance)}
          icon={<Wallet />}
          trend={
            transactions.length > 0
              ? { value: 5.2, isPositive: financialSummary.balance >= 0 }
              : undefined
          }
        />
        <OverviewCard
          title="Receitas"
          value={formatCurrency(financialSummary.income)}
          icon={<TrendingUp />}
          trend={
            transactions.length > 0
              ? { value: 8.1, isPositive: true }
              : undefined
          }
        />
        <OverviewCard
          title="Despesas"
          value={formatCurrency(financialSummary.expenses)}
          icon={<Target />}
          trend={
            transactions.length > 0
              ? { value: 2.5, isPositive: false }
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <RecentTransactions />
        </div>
        <div>
          <ExpensesByCategory />
        </div>
      </div>

      <div className="mb-6">
        <FinancialTip />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <HabitTracker />
        </div>
        <div>
          {goals.length > 0 ? (
            <GoalProgress
              title={goals[0].title}
              targetAmount={Number(goals[0].target_amount)}
              currentAmount={Number(goals[0].current_amount)}
              targetDate={new Date(goals[0].target_date)}
            />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow border text-center">
              <Target className="w-12 h-12 mx-auto text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma Meta Definida</h3>
              <p className="text-muted-foreground mb-4">
                Defina uma meta financeira para acompanhar seu progresso aqui.
              </p>
              <a href="/dashboard/goals" className="text-orange-600 hover:underline">
                Criar Meta
              </a>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
