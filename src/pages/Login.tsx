
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import AuthLayout from '@/components/auth/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo login for now
      if (email && password) {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Redirecionando para o dashboard...',
        });
        navigate('/dashboard');
      } else {
        throw new Error('Por favor, preencha todos os campos');
      }
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
        description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para acessar o dashboard"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link to="/forgot-password" className="text-sm text-orange-600 hover:underline">
              Esqueci minha senha
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link to="/signup" className="text-orange-600 hover:underline">
              Crie uma agora
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
