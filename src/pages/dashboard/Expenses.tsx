
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from '@/services/transactions';
import { useAuth } from '@/hooks/useAuth';
import { Edit, Trash, Plus } from 'lucide-react';
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
import { format } from 'date-fns';

const categories = [
  'Moradia',
  'Alimentação',
  'Transporte',
  'Educação',
  'Saúde',
  'Lazer',
  'Investimentos',
  'Receita',
  'Outros',
];

const Expenses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Transação adicionada',
        description: 'Sua transação foi adicionada com sucesso.',
      });
      resetForm();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao adicionar transação',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Transação atualizada',
        description: 'Sua transação foi atualizada com sucesso.',
      });
      resetForm();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar transação',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Transação excluída',
        description: 'Sua transação foi excluída com sucesso.',
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir transação',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setIsEditing(false);
    setCurrentTransaction(null);
  };

  const handleOpenDialog = (transaction = null) => {
    if (transaction) {
      setCurrentTransaction(transaction);
      setDescription(transaction.description);
      setAmount(String(Math.abs(Number(transaction.amount))));
      setCategory(transaction.category);
      setDate(format(new Date(transaction.date), 'yyyy-MM-dd'));
      setIsEditing(true);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = Number(amount) * (category === 'Receita' ? 1 : -1);
    
    if (isNaN(parsedAmount)) {
      toast({
        title: 'Valor inválido',
        description: 'Por favor, insira um valor numérico válido.',
        variant: 'destructive',
      });
      return;
    }
    
    if (isEditing && currentTransaction) {
      updateMutation.mutate({
        id: currentTransaction.id,
        data: {
          description,
          amount: parsedAmount,
          category,
          date,
        },
      });
    } else {
      addMutation.mutate({
        description,
        amount: parsedAmount,
        category,
        date,
      });
    }
  };

  const handleDelete = (transaction: any) => {
    setCurrentTransaction(transaction);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (currentTransaction) {
      deleteMutation.mutate(currentTransaction.id);
    }
  };

  // Filtragem de transações
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory = filterCategory ? transaction.category === filterCategory : true;
    const matchesSearch = searchTerm
      ? transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Ordenar transações por data (mais recentes primeiro)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gastos e Receitas</h1>
          <p className="text-muted-foreground">Gerencie suas transações financeiras</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <Plus size={18} /> Nova Transação
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Buscar transações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as categorias</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : sortedTransactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <p className="text-muted-foreground mb-4 text-center">
              {filterCategory || searchTerm
                ? 'Nenhuma transação encontrada com os filtros aplicados.'
                : 'Você ainda não tem transações. Comece adicionando uma nova transação.'}
            </p>
            <Button onClick={() => handleOpenDialog()}>Adicionar Transação</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/20 border-b">
                  <th className="px-4 py-3 text-left">Descrição</th>
                  <th className="px-4 py-3 text-left">Categoria</th>
                  <th className="px-4 py-3 text-left">Data</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3">{transaction.description}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-muted">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${
                      Number(transaction.amount) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Number(transaction.amount).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(transaction)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(transaction)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para adicionar/editar transação */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Atualize os detalhes da transação abaixo.'
                : 'Preencha os detalhes da transação para adicioná-la.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Mercado, Salário, etc."
                  required
                />
              </div>

              <div>
                <Label htmlFor="amount">Valor</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                {isEditing ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para excluir */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Transação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
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

export default Expenses;
