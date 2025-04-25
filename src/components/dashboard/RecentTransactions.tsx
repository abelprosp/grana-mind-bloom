
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data
const transactions = [
  { id: 1, description: 'Supermercado Extra', amount: -156.78, date: '2025-04-24', category: 'Alimentação' },
  { id: 2, description: 'Salário', amount: 3500.00, date: '2025-04-20', category: 'Receita' },
  { id: 3, description: 'Netflix', amount: -39.90, date: '2025-04-18', category: 'Lazer' },
  { id: 4, description: 'Uber', amount: -28.50, date: '2025-04-15', category: 'Transporte' },
  { id: 5, description: 'Farmácia', amount: -65.32, date: '2025-04-12', category: 'Saúde' },
];

const RecentTransactions: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
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
              <span className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <a href="/dashboard/expenses" className="text-sm text-orange-600 hover:underline">
            Ver todas as transações
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
