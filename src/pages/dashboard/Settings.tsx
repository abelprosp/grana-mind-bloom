
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [savedSettings, setSavedSettings] = React.useState({
    currency: 'BRL',
    theme: 'system',
    notifications: {
      weeklyReport: true,
      goalReminders: true,
      unusualSpending: true,
      dailyTips: false,
    }
  });

  const [currency, setCurrency] = React.useState(savedSettings.currency);
  const [appearanceTheme, setAppearanceTheme] = React.useState(savedSettings.theme);
  const [notifications, setNotifications] = React.useState(savedSettings.notifications);

  const handleSaveSettings = () => {
    // Save to local storage
    const newSettings = {
      currency,
      theme: appearanceTheme,
      notifications
    };
    
    localStorage.setItem('user-settings', JSON.stringify(newSettings));
    setSavedSettings(newSettings);
    
    // Invalidate relevant queries to refresh data with new settings
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    
    toast({
      title: 'Configurações salvas',
      description: 'Suas preferências foram atualizadas com sucesso.',
    });
  };

  // Load settings from localStorage on mount
  React.useEffect(() => {
    const storedSettings = localStorage.getItem('user-settings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      setCurrency(parsed.currency);
      setAppearanceTheme(parsed.theme);
      setNotifications(parsed.notifications);
      setSavedSettings(parsed);
    }
  }, []);

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Personalize sua experiência no GranaMind</p>
      </div>

      <div className="space-y-6">
        {/* Preferências Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Preferências Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Moeda</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                    <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tema de Aparência</Label>
                <Select value={appearanceTheme} onValueChange={setAppearanceTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Controle quais notificações você deseja receber</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Relatório Semanal</Label>
                <p className="text-sm text-muted-foreground">Receba um resumo semanal das suas finanças</p>
              </div>
              <Switch 
                checked={notifications.weeklyReport}
                onCheckedChange={() => handleToggleNotification('weeklyReport')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Lembretes de Meta</Label>
                <p className="text-sm text-muted-foreground">Seja notificado sobre o progresso das suas metas</p>
              </div>
              <Switch 
                checked={notifications.goalReminders}
                onCheckedChange={() => handleToggleNotification('goalReminders')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Gastos Incomuns</Label>
                <p className="text-sm text-muted-foreground">Alertas sobre transações fora do padrão</p>
              </div>
              <Switch 
                checked={notifications.unusualSpending}
                onCheckedChange={() => handleToggleNotification('unusualSpending')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Dicas Diárias</Label>
                <p className="text-sm text-muted-foreground">Receba dicas financeiras diariamente</p>
              </div>
              <Switch 
                checked={notifications.dailyTips}
                onCheckedChange={() => handleToggleNotification('dailyTips')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Segurança e Privacidade */}
        <Card>
          <CardHeader>
            <CardTitle>Segurança e Privacidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Alterar Senha</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Atualizar sua senha regularmente aumenta a segurança da sua conta.
                </p>
                <Button variant="outline">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Alterar Senha
                </Button>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Exportar Seus Dados</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Baixe uma cópia de todos os seus dados em formato CSV.
                </p>
                <Button variant="outline">
                  Exportar Dados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>
            Salvar Configurações
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
