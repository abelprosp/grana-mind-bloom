
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHabits, toggleHabitCompletion } from '@/services/habits';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const HabitTracker: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: getHabits,
    enabled: !!user
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => 
      toggleHabitCompletion(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "Hábito atualizado",
        description: "Seu progresso foi salvo com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar hábito",
        description: "Não foi possível salvar seu progresso.",
        variant: "destructive"
      });
    }
  });

  const toggleHabitHandler = (id: string, isCompleted: boolean) => {
    toggleMutation.mutate({ id, completed: !isCompleted });
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Hábitos Financeiros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (habits.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Hábitos Financeiros</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <p className="text-muted-foreground mb-4 text-center">
            Você ainda não tem hábitos financeiros cadastrados. Crie hábitos para melhorar sua saúde financeira.
          </p>
          <Link to="/dashboard/habits">
            <Button variant="default">Criar Hábito</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Verificar se o hábito foi concluído hoje
  const isCompletedToday = (habit: typeof habits[0]) => {
    if (!habit.last_completed_at) return false;
    const lastCompleted = new Date(habit.last_completed_at);
    const today = new Date();
    return lastCompleted.toDateString() === today.toDateString();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Hábitos Financeiros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habits.map((habit) => {
            const completed = isCompletedToday(habit);
            return (
              <div key={habit.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{habit.name}</h4>
                    <p className="text-xs text-muted-foreground">{habit.target}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={completed ? "default" : "outline"}
                    className={`h-7 w-7 p-0 rounded-full ${completed ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200'}`}
                    onClick={() => toggleHabitHandler(habit.id, completed)}
                    disabled={toggleMutation.isPending}
                  >
                    <Check size={14} />
                  </Button>
                </div>
                <div className="flex gap-3 mt-2">
                  <div className="bg-muted/50 rounded px-2 py-1 text-xs">
                    <span className="text-muted-foreground">Atual: </span>
                    <span className="font-medium">{habit.current_streak} dias</span>
                  </div>
                  <div className="bg-muted/50 rounded px-2 py-1 text-xs">
                    <span className="text-muted-foreground">Recorde: </span>
                    <span className="font-medium">{habit.best_streak} dias</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center">
          <Link to="/dashboard/habits" className="text-sm text-orange-600 hover:underline">
            Gerenciar todos os hábitos
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitTracker;
