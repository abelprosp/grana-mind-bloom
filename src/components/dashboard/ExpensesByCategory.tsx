
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/transactions';
import { useAuth } from '@/hooks/useAuth';

const COLORS = ['#FF6B00', '#FFA940', '#FFD2B3', '#FFB989', '#FFA055', '#FF8722'];

const ExpensesByCategory: React.FC = () => {
  const { user } = useAuth();
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    enabled: !!user
  });

  // Função para calcular as despesas por categoria
  const calculateExpensesByCategory = () => {
    const expenseTransactions = transactions.filter(tx => Number(tx.amount) < 0);
    
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

  const data = calculateExpensesByCategory();

  // Se não houver dados suficientes, mostrar mensagem
  if (data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground text-center">
            Nenhuma despesa registrada ainda. Adicione transações para visualizar o gráfico.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Gastos por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Percentual']} 
                itemStyle={{ color: '#000' }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesByCategory;
