import React, { useState } from 'react';
import { 
  Home, 
  TrendingUp, 
  BarChart3, 
  PiggyBank, 
  Calculator, 
  Settings, 
  LogOut,
  Menu,
  X,
  DollarSign,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/logo.png'

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { name: 'Home', icon: Home, id: 'home' },
  { name: 'Fluxo de Caixa', icon: TrendingUp, id: 'cashflow' },
  { name: 'Gráficos', icon: BarChart3, id: 'charts' },
  { name: 'Investimentos', icon: PiggyBank, id: 'investments' },
  { name: 'Calculadora', icon: Calculator, id: 'calculator' },
  { name: 'Configurações', icon: Settings, id: 'settings' },
];

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#5C15E7] shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-2">
            <div className="w-20 h-20 flex items-center justify-center">
              <img src={Logo} alt="logo" />
            </div>
            <span className="text-white font-bold text-lg">Kaizen</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-purple-200 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user.companyName}</p>
                <p className="text-purple-200 text-sm truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="mt-8 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#7537EE] text-white shadow-lg'
                    : 'text-purple-200 hover:text-white hover:bg-purple-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-purple-200 hover:text-white hover:bg-purple-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Kaizen
              </span>
            </div>
            {user && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}