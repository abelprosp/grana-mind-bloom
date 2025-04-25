
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import OverviewCard from '@/components/dashboard/OverviewCard';
import ExpensesByCategory from '@/components/dashboard/ExpensesByCategory';
import GoalProgress from '@/components/dashboard/GoalProgress';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import HabitTracker from '@/components/dashboard/HabitTracker';
import FinancialTip from '@/components/dashboard/FinancialTip';
import { Wallet, TrendingUp, PiggyBank } from 'lucide-react';

const Dashboard = () => {
  // Sample goal data for demo
  const mainGoal = {
    title: 'Fundo de Emergência',
    targetAmount: 10000,
    currentAmount: 3500,
    targetDate: new Date('2026-01-01'),
    icon: <PiggyBank size={14} />
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Olá, Maria!</h1>
          <p className="text-muted-foreground">
            Aqui está o resumo das suas finanças. Abril de 2025.
          </p>
        </div>
        
        {/* Financial Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <OverviewCard
            title="Total Gasto"
            value="R$ 2.340,50"
            description="Abril 2025"
            icon={<Wallet size={18} />}
            trend={{ value: 5.2, isPositive: false }}
          />
          <OverviewCard
            title="Total Poupado"
            value="R$ 950,00"
            description="Abril 2025"
            icon={<PiggyBank size={18} />}
            trend={{ value: 12.5, isPositive: true }}
          />
          <OverviewCard
            title="Saldo Disponível"
            value="R$ 1.870,30"
            description="Conta principal"
            icon={<TrendingUp size={18} />}
          />
        </div>
        
        {/* Main Goal Progress */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Sua Meta Principal</h2>
          <GoalProgress
            title={mainGoal.title}
            targetAmount={mainGoal.targetAmount}
            currentAmount={mainGoal.currentAmount}
            targetDate={mainGoal.targetDate}
            icon={mainGoal.icon}
          />
        </div>
        
        {/* Financial Tip */}
        <FinancialTip />
        
        {/* Charts and Lists */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ExpensesByCategory />
          <RecentTransactions />
        </div>
        
        {/* Habits */}
        <div>
          <HabitTracker />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
