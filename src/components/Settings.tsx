import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  CreditCard,
  Eye,
  EyeOff,
  Save,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true
  });

  const [profileData, setProfileData] = useState({
    companyName: user?.companyName || '',
    email: user?.email || '',
    phone: '',
    cnpj: user?.cnpj || '',
    description: ''
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      
      setTimeout(() => setMessage(null), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    //{ id: 'notifications', name: 'Notificações', icon: Bell },
    //{ id: 'security', name: 'Segurança', icon: Shield },
    //{ id: 'billing', name: 'Cobrança', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">Gerencie suas preferências e configurações da conta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            {/* Success/Error Messages */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.type === 'success' ? (
                  <Check className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Informações do Perfil</h2>
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span>{isLoading ? 'Salvando...' : 'Salvar'}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Alterar Foto</span>
                    </button>
                    <p className="text-gray-500 text-sm">JPG, PNG até 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Empresa
                    </label>
                    <input
                      type="text"
                      value={profileData.companyName}
                      onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={profileData.cnpj}
                      onChange={(e) => setProfileData({...profileData, cnpj: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição da Empresa
                  </label>
                  <textarea
                    rows={4}
                    value={profileData.description}
                    onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                    placeholder="Conte um pouco sobre sua empresa..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Preferências de Notificação</h2>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificações por Email</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Relatórios Mensais</p>
                          <p className="text-sm text-gray-500">Receba um resumo mensal das suas finanças</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={notifications.email}
                            onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Alertas de Gastos</p>
                          <p className="text-sm text-gray-500">Notificações quando ultrapassar limites</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificações Push</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Transações</p>
                          <p className="text-sm text-gray-500">Notificação imediata de novas transações</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={notifications.push}
                            onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Dicas e Promoções</p>
                          <p className="text-sm text-gray-500">Receba dicas financeiras e ofertas especiais</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={notifications.marketing}
                            onChange={(e) => setNotifications({...notifications, marketing: e.target.checked})}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Segurança da Conta</h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <p className="font-medium text-green-800">Conta Segura</p>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Sua conta possui todas as medidas de segurança ativadas.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Senha Atual
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nova Senha
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmar Nova Senha
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                        Alterar Senha
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Autenticação em Duas Etapas</h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">2FA via SMS</p>
                          <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                        </div>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                          Ativar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessões Ativas</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Navegador Atual</p>
                          <p className="text-sm text-gray-500">Chrome no Windows • São Paulo, SP</p>
                        </div>
                        <span className="text-green-600 text-sm font-medium">Ativa</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">iPhone</p>
                          <p className="text-sm text-gray-500">Safari Mobile • Último acesso: 2 horas atrás</p>
                        </div>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Revogar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Informações de Cobrança</h2>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Adicionar Cartão</span>
                  </button>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-purple-100 text-sm">Plano Atual</p>
                      <p className="text-2xl font-bold">Premium</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-purple-200" />
                  </div>
                  <p className="text-purple-100 text-sm mb-4">
                    Próxima cobrança em 15 de Fevereiro de 2024
                  </p>
                  <div className="flex space-x-4">
                    <button className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-30 transition-all duration-200">
                      Alterar Plano
                    </button>
                    <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                      Cancelar
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pagamento</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">**** **** **** 4532</p>
                          <p className="text-sm text-gray-500">Visa • Expira 12/26</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Faturas</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Descrição</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Valor</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-4 text-gray-900">15/01/2024</td>
                          <td className="py-4 px-4 text-gray-900">Plano Premium - Janeiro</td>
                          <td className="py-4 px-4 text-gray-900 font-medium">R$ 29,90</td>
                          <td className="py-4 px-4">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Pago
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1">
                              <Download className="w-4 h-4" />
                              <span>Baixar</span>
                            </button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-4 text-gray-900">15/12/2023</td>
                          <td className="py-4 px-4 text-gray-900">Plano Premium - Dezembro</td>
                          <td className="py-4 px-4 text-gray-900 font-medium">R$ 29,90</td>
                          <td className="py-4 px-4">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Pago
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1">
                              <Download className="w-4 h-4" />
                              <span>Baixar</span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}