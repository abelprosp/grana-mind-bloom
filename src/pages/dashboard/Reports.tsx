
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/transactions';
import { useAuth } from '@/hooks/useAuth';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLORS = ['#FF6B00', '#FFA940', '#FFD2B3', '#FFB989', '#FFA055', '#FF8722'];

const Reports = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('3m');
  
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    enabled: !!user,
  });

  // Calcular datas para filtrar por período
  const calculateDateRange = () => {
    const today = new Date();
    let startDate;

    switch (period) {
      case '1m':
        startDate = subMonths(today, 1);
        break;
      case '3m':
        startDate = subMonths(today, 3);
        break;
      case '6m':
        startDate = subMonths(today, 6);
        break;
      case '1y':
        startDate = subMonths(today, 12);
        break;
      default:
        startDate = subMonths(today, 3);
    }

    return {
      start: startOfMonth(startDate),
      end: endOfMonth(today),
    };
  };

  // Filtrar transações pelo período selecionado
  const dateRange = calculateDateRange();
  const filteredTransactions = transactions.filter(transaction => {
    const txDate = new Date(transaction.date);
    return txDate >= dateRange.start && txDate <= dateRange.end;
  });

  // Preparar dados para o gráfico de evolução do saldo
  const prepareBalanceData = () => {
    if (filteredTransactions.length === 0) return [];

    // Criar intervalo de datas para o período
    const dateInterval = eachDayOfInterval({
      start: dateRange.start,
      end: dateRange.end,
    });

    // Inicializar balanceMap com todas as datas
    const balanceMap: Record<string, { date: string; balance: number }> = {};
    dateInterval.forEach(date => {
      const dateString = format(date, 'yyyy-MM-dd');
      balanceMap[dateString] = {
        date: format(date, 'dd/MM/yyyy'),
        balance: 0,
      };
    });

    // Calcular saldo acumulado para cada data
    let runningBalance = 0;
    const sortedTransactions = [...filteredTransactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sortedTransactions.forEach(tx => {
      const txDate = new Date(tx.date);
      runningBalance += Number(tx.amount);

      // Atualizar todas as datas a partir desta transação
      dateInterval
        .filter(date => date >= txDate)
        .forEach(date => {
          const dateString = format(date, 'yyyy-MM-dd');
          balanceMap[dateString].balance = runningBalance;
        });
    });

    // Converter para array e reduzir os pontos para evitar sobrecarregar o gráfico
    const balanceArray = Object.values(balanceMap);
    
    // Se for muito dados, podemos reduzir a quantidade de pontos
    if (balanceArray.length > 60) {
      const step = Math.ceil(balanceArray.length / 60);
      return balanceArray.filter((_, idx) => idx % step === 0);
    }
    
    return balanceArray;
  };

  // Preparar dados para o gráfico de receitas e despesas por mês
  const prepareMonthlyData = () => {
    if (filteredTransactions.length === 0) return [];

    const monthlyData: Record<string, { month: string; income: number; expenses: number }> = {};

    filteredTransactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const monthKey = format(txDate, 'yyyy-MM');
      const monthDisplay = format(txDate, 'MMM/yy');
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthDisplay,
          income: 0,
          expenses: 0,
        };
      }
      
      const amount = Number(tx.amount);
      if (amount > 0) {
        monthlyData[monthKey].income += amount;
      } else {
        monthlyData[monthKey].expenses += Math.abs(amount);
      }
    });

    return Object.values(monthlyData);
  };

  // Preparar dados para o gráfico de despesas por categoria
  const prepareExpensesByCategoryData = () => {
    if (filteredTransactions.length === 0) return [];
    
    const expenseTransactions = filteredTransactions.filter(tx => Number(tx.amount) < 0);
    
    if (expenseTransactions.length === 0) {
      return [];
    }
    
    const categories: Record<string, number> = {};
    
    // Agrupar despesas por categoria
    expenseTransactions.forEach(transaction => {
      const amount = Math.abs(Number(transaction.amount));
      if (categories[transaction.category]) {
        categories[transaction.category] += amount;
      } else {
        categories[transaction.category] = amount;
      }
    });
    
    // Calcular o total
    const total = Object.values(categories).reduce((sum, value) => sum + value, 0);
    
    // Converter para o formato esperado pelo gráfico e calcular percentuais
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: Number(((value / total) * 100).toFixed(0))
    }));
  };

  const balanceData = prepareBalanceData();
  const monthlyData = prepareMonthlyData();
  const expensesByCategoryData = prepareExpensesByCategoryData();

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Relatórios Financeiros</h1>
          <p className="text-muted-foreground">Análises detalhadas da sua saúde financeira</p>
        </div>
        <div className="w-40">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Último mês</SelectItem>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : transactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <h3 className="text-xl font-semibold mb-2">Nenhum dado disponível</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Adicione transações para visualizar seus relatórios financeiros.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Gráfico de evolução do saldo */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Saldo</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => {
                      // Simplificar o eixo X para não ficar lotado
                      return balanceData.length > 30 ? '' : value;
                    }}
                  />
                  <YAxis 
                    tickFormatter={(value) => value.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL',
                      maximumFractionDigits: 0 
                    })}
                  />
                  <Tooltip 
                    formatter={(value) => value.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    })}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    name="Saldo" 
                    stroke="#FF6B00" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de receitas e despesas por mês */}
          <Card>
            <CardHeader>
              <CardTitle>Receitas e Despesas Mensais</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => value.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL',
                      maximumFractionDigits: 0 
                    })}
                  />
                  <Tooltip 
                    formatter={(value) => value.toLocaleString('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    })}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Receitas" fill="#4CAF50" />
                  <Bar dataKey="expenses" name="Despesas" fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de despesas por categoria */}
          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {expensesByCategoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-muted-foreground text-center">
                    Não há despesas registradas para exibir o gráfico.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expensesByCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reports;
