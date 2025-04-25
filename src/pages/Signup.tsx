
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import AuthLayout from '@/components/auth/AuthLayout';

const goalOptions = [
  { value: 'emergency', label: 'Criar fundo de emergência' },
  { value: 'debt', label: 'Quitar dívidas' },
  { value: 'trip', label: 'Poupar para uma viagem' },
  { value: 'home', label: 'Poupar para um imóvel' },
  { value: 'investing', label: 'Começar a investir' },
];

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo signup validation
      if (name && email && password) {
        toast({
          title: 'Conta criada com sucesso!',
          description: 'Bem-vindo ao GranaMind!',
        });
        navigate('/dashboard');
      } else {
        throw new Error('Por favor, preencha todos os campos obrigatórios');
      }
    } catch (error) {
      toast({
        title: 'Erro ao criar conta',
        description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Comece sua jornada para o controle financeiro"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal">Qual sua maior meta hoje? (opcional)</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma meta" />
            </SelectTrigger>
            <SelectContent>
              {goalOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Criando conta...' : 'Criar Conta e Começar'}
        </Button>
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-orange-600 hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Signup;
