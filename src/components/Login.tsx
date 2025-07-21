import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  DollarSign,
  AlertCircle,
  Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/logo.png'

export default function Login() {
  const { login, register, forgotPassword, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    cnpj: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!isLogin) {
      if (!formData.companyName) {
        newErrors.companyName = 'Nome da empresa é obrigatório';
      }

      if (!formData.cnpj) {
        newErrors.cnpj = 'CNPJ é obrigatório';
      } else {
        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        if (!cnpjRegex.test(formData.cnpj)) {
          newErrors.cnpj = 'CNPJ inválido. Use o formato: 00.000.000/0001-00';
        }
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }

      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'Você deve aceitar os termos de uso';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    try {
      let result;
      
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          companyName: formData.companyName,
          cnpj: formData.cnpj
        });
      }

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // O redirecionamento será automático via AuthContext
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro inesperado. Tente novamente.' });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.email) {
      setMessage({ type: 'error', text: 'Digite seu email para recuperar a senha' });
      return;
    }

    const result = await forgotPassword(formData.email);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    
    if (result.success) {
      setTimeout(() => {
        setShowForgotPassword(false);
        setMessage(null);
      }, 3000);
    }
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData({...formData, cnpj: formatted});
  };

  const features = [
    {
      icon: TrendingUp,
      title: 'Análises Avançadas',
      description: 'Relatórios detalhados e insights inteligentes para sua empresa'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Criptografia de ponta e proteção de dados empresariais'
    },
    {
      icon: Users,
      title: 'Gestão de Equipe',
      description: 'Controle de acesso e permissões para diferentes usuários'
    }
  ];

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Recuperar Senha</h2>
              <p className="text-purple-100">Digite seu email para receber o link de recuperação</p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border border-green-400/30 text-green-100' 
                  : 'bg-red-500/20 border border-red-400/30 text-red-100'
              }`}>
                {message.type === 'success' ? (
                  <Check className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-purple-100 text-sm font-medium mb-2">
                  Email Empresarial
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="empresa@exemplo.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enviar Link</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setMessage(null);
                }}
                className="w-full text-purple-200 hover:text-white transition-colors text-center"
              >
                Voltar ao Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white">
        <div className="max-w-lg">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src={Logo} alt="logo" />
            </div>
            <h1 className="text-3xl font-bold">Kaizen</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Controle Financeiro
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              Empresarial Completo
            </span>
          </h2>
          
          <p className="text-xl text-purple-100 mb-12 leading-relaxed">
            Gerencie as finanças da sua empresa com inteligência, segurança e praticidade. 
            Tenha controle total sobre receitas, despesas e investimentos.
          </p>

          <div className="space-y-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <Icon className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-purple-200">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Demo Credentials */}
          <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold mb-3 text-purple-200">Credenciais de Demonstração:</h3>
            <div className="space-y-2 text-sm text-purple-100">
              <p><strong>Email:</strong> admin@empresa.com</p>
              <p><strong>Senha:</strong> 123456</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Kaizen</h1>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Acesso Empresarial' : 'Cadastro da Empresa'}
              </h2>
              <p className="text-purple-100">
                {isLogin ? 'Entre na sua conta empresarial' : 'Crie sua conta empresarial'}
              </p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center space-x-2 ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border border-green-400/30 text-green-100' 
                  : 'bg-red-500/20 border border-red-400/30 text-red-100'
              }`}>
                {message.type === 'success' ? (
                  <Check className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-purple-100 text-sm font-medium mb-2">
                      Nome da Empresa
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm ${
                          errors.companyName ? 'border-red-400' : 'border-white/20'
                        }`}
                        placeholder="Sua Empresa Ltda"
                      />
                    </div>
                    {errors.companyName && (
                      <p className="mt-1 text-red-300 text-sm">{errors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-purple-100 text-sm font-medium mb-2">
                      CNPJ
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.cnpj}
                        onChange={handleCNPJChange}
                        maxLength={18}
                        className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm ${
                          errors.cnpj ? 'border-red-400' : 'border-white/20'
                        }`}
                        placeholder="00.000.000/0001-00"
                      />
                    </div>
                    {errors.cnpj && (
                      <p className="mt-1 text-red-300 text-sm">{errors.cnpj}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-purple-100 text-sm font-medium mb-2">
                  Email Empresarial
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm ${
                      errors.email ? 'border-red-400' : 'border-white/20'
                    }`}
                    placeholder="empresa@exemplo.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-red-300 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-purple-100 text-sm font-medium mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full pl-12 pr-12 py-4 bg-white/10 border rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm ${
                      errors.password ? 'border-red-400' : 'border-white/20'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-red-300 text-sm">{errors.password}</p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-purple-100 text-sm font-medium mb-2">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className={`w-full pl-12 pr-12 py-4 bg-white/10 border rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm ${
                        errors.confirmPassword ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-red-300 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {!isLogin && (
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                    className="mt-1 w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <div>
                    <label htmlFor="terms" className="text-sm text-purple-100">
                      Aceito os{' '}
                      <a href="#" className="text-purple-300 hover:text-white underline">
                        Termos de Uso
                      </a>{' '}
                      e{' '}
                      <a href="#" className="text-purple-300 hover:text-white underline">
                        Política de Privacidade
                      </a>
                    </label>
                    {errors.acceptTerms && (
                      <p className="mt-1 text-red-300 text-sm">{errors.acceptTerms}</p>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Entrar' : 'Criar Conta'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {isLogin && (
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="w-full text-purple-200 hover:text-white transition-colors text-center"
                >
                  Esqueceu sua senha?
                </button>
              )}
            </form>

            <div className="mt-8 text-center">
              <p className="text-purple-100">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage(null);
                    setErrors({});
                  }}
                  className="ml-2 text-purple-300 hover:text-white font-semibold underline transition-colors"
                >
                  {isLogin ? 'Cadastre-se' : 'Faça login'}
                </button>
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-purple-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Dados Protegidos</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">SSL Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}