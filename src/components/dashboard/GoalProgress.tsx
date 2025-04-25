
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, Star } from 'lucide-react';

interface GoalProgressProps {
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  icon?: React.ReactNode;
}

const GoalProgress: React.FC<GoalProgressProps> = ({
  title,
  targetAmount,
  currentAmount,
  targetDate,
  icon = <Target size={14} />,
}) => {
  const percentage = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);
  
  // Days remaining calculation
  const today = new Date();
  const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <div className="w-6 h-6 p-1 rounded-md bg-orange-100 flex items-center justify-center text-orange-600">
            {icon}
          </div>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex justify-between items-end mb-1">
          <p className="text-muted-foreground text-xs">Meta Total</p>
          <p>
            <span className="font-bold">{currentAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <span className="text-muted-foreground text-xs"> / {targetAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </p>
        </div>
        
        <Progress value={percentage} className="h-2 mb-2" />
        
        <div className="flex justify-between mt-1 mb-3">
          <span className="text-xs text-muted-foreground">{percentage}% completo</span>
          <span className="text-xs text-muted-foreground">
            {daysRemaining > 0 
              ? `${daysRemaining} dias restantes` 
              : 'Meta atingida!'}
          </span>
        </div>
        
        <Button size="sm" className="w-full text-xs h-8">
          <Star size={14} className="mr-1" />
          Adicionar Valor
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoalProgress;
