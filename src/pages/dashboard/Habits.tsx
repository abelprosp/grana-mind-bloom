
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHabits, addHabit, updateHabit, toggleHabitCompletion, deleteHabit } from '@/services/habits';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Check, Edit, Trash, Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Habits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentHabit, setCurrentHabit] = useState<any>(null);
  
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const { data: habits = [], isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: getHabits,
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: addHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: 'Hábito adicionado',
        description: 'Seu hábito financeiro foi adicionado com sucesso.',
      });
      resetForm();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao adicionar hábito',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateHabit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: 'Hábito atualizado',
        description: 'Seu hábito financeiro foi atualizado com sucesso.',
      });
      resetForm();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar hábito',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => toggleHabitCompletion(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: 'Hábito atualizado',
        description: 'Seu progresso foi salvo com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar hábito',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: 'Hábito excluído',
        description: 'Seu hábito financeiro foi excluído com sucesso.',
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir hábito',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setName('');
    setTarget('');
    setIsEditing(false);
    setCurrentHabit(null);
  };

  const handleOpenDialog = (habit = null) => {
    if (habit) {
      setCurrentHabit(habit);
      setName(habit.name);
      setTarget(habit.target);
      setIsEditing(true);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && currentHabit) {
      updateMutation.mutate({
        id: currentHabit.id,
        data: {
          name,
          target,
        },
      });
    } else {
      addHabit({
        name,
        target,
      });
    }
  };

  const handleToggleCompletion = (habit: any) => {
    const isCompleted = isCompletedToday(habit);
    toggleMutation.mutate({ id: habit.id, completed: !isCompleted });
  };

  const handleDelete = (habit: any) => {
    setCurrentHabit(habit);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentHabit) {
      deleteMutation.mutate(currentHabit.id);
    }
  };

  // Verificar se o hábito foi concluído hoje
  const isCompletedToday = (habit: typeof habits[0]) => {
    if (!habit.last_completed_at) return false;
    const lastCompleted = new Date(habit.last_completed_at);
    const today = new Date();
    return lastCompleted.toDateString() === today.toDateString();
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hábitos Financeiros</h1>
          <p className="text-muted-foreground">Desenvolva rotinas saudáveis para suas finanças</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <Plus size={18} /> Novo Hábito
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : habits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <Heart className="h-16 w-16 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum Hábito Registrado</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Crie hábitos financeiros para melhorar sua saúde financeira a longo prazo.
            </p>
            <Button onClick={() => handleOpenDialog()}>Criar Hábito</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => {
            const completed = isCompletedToday(habit);
            
            return (
              <Card key={habit.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{habit.name}</h3>
                      <p className="text-sm text-muted-foreground">{habit.target}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={completed ? "default" : "outline"}
                      className={`h-8 w-8 p-0 rounded-full ${completed ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200'}`}
                      onClick={() => handleToggleCompletion(habit)}
                      disabled={toggleMutation.isPending}
                    >
                      <Check size={16} />
                    </Button>
                  </div>
                  
                  <div className="flex gap-3 mb-4">
                    <div className="bg-muted/50 rounded px-2 py-1 text-xs">
                      <span className="text-muted-foreground">Atual: </span>
                      <span className="font-medium">{habit.current_streak} dias</span>
                    </div>
                    <div className="bg-muted/50 rounded px-2 py-1 text-xs">
                      <span className="text-muted-foreground">Recorde: </span>
                      <span className="font-medium">{habit.best_streak} dias</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleOpenDialog(habit)}
                    >
                      <Edit size={14} className="mr-1" /> Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(habit)}
                    >
                      <Trash size={14} className="mr-1" /> Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal para adicionar/editar hábito */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Hábito' : 'Novo Hábito'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Atualize os detalhes do seu hábito financeiro.'
                : 'Crie um novo hábito para melhorar sua saúde financeira.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="name">Nome do Hábito</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Economizar para emergências"
                  required
                />
              </div>

              <div>
                <Label htmlFor="target">Meta do Hábito</Label>
                <Input
                  id="target"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Ex: R$50 por semana"
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                {isEditing ? 'Atualizar' : 'Criar Hábito'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para excluir */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Hábito</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este hábito? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Habits;
