
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Wallet, 
  Target, 
  Heart, 
  PieChart, 
  Settings, 
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/services/profile';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Visão Geral', href: '/dashboard', icon: Home },
  { name: 'Gastos', href: '/dashboard/expenses', icon: Wallet },
  { name: 'Metas', href: '/dashboard/goals', icon: Target },
  { name: 'Hábitos', href: '/dashboard/habits', icon: Heart },
  { name: 'Relatórios', href: '/dashboard/reports', icon: PieChart },
  { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
    enabled: !!user,
  });

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logout realizado com sucesso',
        description: 'Redirecionando para a página inicial...',
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: 'Erro ao fazer logout',
        description: 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    }
  };

  const userName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : user?.email?.split('@')[0] || 'Usuário';
  
  const userInitials = profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : userName.substring(0, 2).toUpperCase();

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r shadow-lg lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close button (mobile) */}
        <button
          className="absolute right-4 top-4 p-1 rounded-md lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-orange-600 text-white p-1 rounded-md font-bold">GM</div>
            <span className="font-bold text-xl text-orange-600">GranaMind</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-orange-600' : 'text-gray-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* User */}
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-start px-3 py-2">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-orange-100 text-orange-600">{userInitials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile menu button */}
            <button
              className="p-2 rounded-md lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            {/* Page title - Empty here, will be set in each page */}
            <div className="lg:hidden">
              <div className="flex items-center gap-2">
                <div className="bg-orange-600 text-white p-[2px] rounded-sm text-xs font-bold">GM</div>
                <span className="font-bold text-sm text-orange-600">GranaMind</span>
              </div>
            </div>
            
            {/* Right side of the header */}
            <div className="flex items-center space-x-2 lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full" size="icon">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-orange-100 text-orange-600">{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
