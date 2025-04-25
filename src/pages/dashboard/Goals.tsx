
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGoals, addGoal, updateGoal, updateGoalAmount, deleteGoal } from '@/services/goals';
import { useAuth } from '@/hooks/useAuth';
import { Target, Edit, Trash, Plus, Star } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

const Goals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<any>(null);
  
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState(format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [depositAmount, setDepositAmount] = useState('');

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: addGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: 'Meta adicionada',
        description: 'Sua meta financeira foi adicionada com sucesso.',
      });
      resetForm();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao adicionar meta',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: 'Meta atualizada',
        description: 'Sua meta financeira foi atualizada com sucesso.',
      });
      resetForm();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar meta',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const depositMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) => updateGoalAmount(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: 'Depósito realizado',
        description: 'Seu progresso na meta foi atualizado com sucesso.',
      });
      setDepositAmount('');
      setDepositDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao realizar depósito',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: 'Meta excluída',
        description: 'Sua meta financeira foi excluída com sucesso.',
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir meta',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setTitle('');
    setTargetAmount('');
    setTargetDate(format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
    setIsEditing(false);
    setCurrentGoal(null);
  };

  const handleOpenDialog = (goal = null) => {
    if (goal) {
      setCurrentGoal(goal);
      setTitle(goal.title);
      setTargetAmount(String(goal.target_amount));
      setTargetDate(format(new Date(goal.target_date), 'yyyy-MM-dd'));
      setIsEditing(true);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleOpenDepositDialog = (goal: any) => {
    setCurrentGoal(goal);
    setDepositAmount('');
    setDepositDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = Number(targetAmount);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: 'Valor inválido',
        description: 'Por favor, insira um valor positivo válido.',
        variant: 'destructive',
      });
      return;
    }
    
    if (new Date(targetDate) <= new Date()) {
      toast({
        title: 'Data inválida',
        description: 'A data alvo deve ser no futuro.',
        variant: 'destructive',
      });
      return;
    }
    
    if (isEditing && currentGoal) {
      updateMutation.mutate({
        id: currentGoal.id,
        data: {
          title,
          target_amount: parsedAmount,
          target_date: targetDate,
        },
      });
    } else {
      addMutation.mutate({
        title,
        target_amount: parsedAmount,
        current_amount: 0,
        target_date: targetDate,
      });
    }
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = Number(depositAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Valor inválido',
        description: 'Por favor, insira um valor positivo válido.',
        variant: 'destructive',
      });
      return;
    }
    
    if (currentGoal) {
      depositMutation.mutate({
        id: currentGoal.id,
        amount,
      });
    }
  };

  const handleDelete = (goal: any) => {
    setCurrentGoal(goal);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentGoal) {
      deleteMutation.mutate(currentGoal.id);
    }
  };

  // Calcular dias restantes
  const calculateDaysRemaining = (date: string) => {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Metas Financeiras</h1>
          <p className="text-muted-foreground">Crie e acompanhe suas metas de economia</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <Plus size={18} /> Nova Meta
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : goals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <Target className="h-16 w-16 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma Meta Definida</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Defina metas financeiras para acompanhar seu progresso e alcançar seus objetivos financeiros.
            </p>
            <Button onClick={() => handleOpenDialog()}>Criar Meta</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const percentage = Math.min(
              Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100),
              100
            );
            const daysRemaining = calculateDaysRemaining(goal.target_date);

            return (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <div className="w-6 h-6 p-1 rounded-md bg-orange-100 flex items-center justify-center text-orange-600">
                      <Target size={14} />
                    </div>
                    <span className="truncate">{goal.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex justify-between items-end mb-1">
                    <p className="text-muted-foreground text-xs">Meta Total</p>
                    <p>
                      <span className="font-bold">{Number(goal.current_amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      <span className="text-muted-foreground text-xs"> / {Number(goal.target_amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </p>
                  </div>
                  
                  <Progress value={percentage} className="h-2 mb-2" />
                  
                  <div className="flex justify-between mt-1 mb-4">
                    <span className="text-xs text-muted-foreground">{percentage}% completo</span>
                    <span className="text-xs text-muted-foreground">
                      {daysRemaining > 0 
                        ? `${daysRemaining} dias restantes` 
                        : 'Meta atingida!'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 text-xs h-8"
                      onClick={() => handleOpenDepositDialog(goal)}
                    >
                      <Star size={14} className="mr-1" />
                      Adicionar Valor
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleOpenDialog(goal)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(goal)}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal para adicionar/editar meta */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Meta' : 'Nova Meta'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Atualize os detalhes da sua meta financeira.'
                : 'Defina uma nova meta financeira para acompanhar seu progresso.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="title">Título da Meta</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Fundo de Emergência, Viagem, etc."
                  required
                />
              </div>

              <div>
                <Label htmlFor="targetAmount">Valor Alvo (R$)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="1000.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="targetDate">Data Alvo</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                {isEditing ? 'Atualizar' : 'Criar Meta'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para adicionar valor a uma meta */}
      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Valor</DialogTitle>
            <DialogDescription>
              Quanto você deseja adicionar a esta meta?
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDeposit}>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="depositAmount">Valor (R$)</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  step="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="50.00"
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setDepositDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={depositMutation.isPending}>
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para excluir */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Meta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.
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

export default Goals;
