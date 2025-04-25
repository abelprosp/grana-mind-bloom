
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/transactions';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const RecentTransactions: React.FC = () => {
  const { user } = useAuth();
  
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    enabled: !!user
  });

  // Ordenar transações por data (mais recentes primeiro) e pegar apenas as 5 primeiras
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <p className="text-muted-foreground mb-4 text-center">
            Você ainda não tem transações registradas. Comece a adicionar suas receitas e despesas.
          </p>
          <Link to="/dashboard/expenses">
            <button className="text-white bg-orange-600 px-4 py-2 rounded-md hover:bg-orange-700">
              Adicionar Transação
            </button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-medium">{transaction.description}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString('pt-BR')} • {transaction.category}
                </span>
              </div>
              <span className={`font-medium ${Number(transaction.amount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Number(transaction.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link to="/dashboard/expenses" className="text-sm text-orange-600 hover:underline">
            Ver todas as transações
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
