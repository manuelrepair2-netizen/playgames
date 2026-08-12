import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';
import { StorageService } from '../services/storage';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginIdentifier = email.trim();
      const passwordInput = password.trim();
      
      console.log('🔍 Tentando login com:', loginIdentifier);

      // ===== CREDENCIAIS ESPECIAIS DO ADMIN =====
      if ((loginIdentifier === 'Manuel2008' || loginIdentifier === 'manuel2008' || loginIdentifier === 'admin') && 
          (passwordInput === 'Manuel#1978' || passwordInput === 'admin')) {
        
        console.log('✅ Credenciais admin detectadas!');
        
        let users = StorageService.getUsers();
        let adminUser = users.find(u => u.role === 'admin');
        
        if (!adminUser) {
          adminUser = {
            id: 'user-admin',
            username: 'Manuel2008',
            email: 'manuelrepair2@gmail.com',
            password: 'Manuel#1978',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            role: 'admin',
            status: 'Active',
            downloadHistory: [],
            favorites: [],
            createdAt: new Date().toISOString()
          };
          users.push(adminUser);
          localStorage.setItem('ps4_users', JSON.stringify(users));
        }
        
        StorageService.setCurrentUser(adminUser);
        onSuccess(adminUser);
        onClose();
        return;
      }

      // ===== LOGIN NORMAL =====
      if (isLogin) {
        const users = StorageService.getUsers();
        const user = users.find(u => 
          (u.email.toLowerCase() === loginIdentifier.toLowerCase() || 
           u.username.toLowerCase() === loginIdentifier.toLowerCase()) &&
          u.password === passwordInput
        );

        if (!user) {
          throw new Error('Credenciais inválidas. Verifique seu email/usuário e senha.');
        }

        if (user.status === 'Banned') {
          throw new Error('Sua conta foi banida. Entre em contato com o suporte.');
        }

        StorageService.setCurrentUser(user);
        onSuccess(user);
        onClose();
      } else {
        // ===== REGISTRO =====
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem.');
        }

        if (password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres.');
        }

        const users = StorageService.getUsers();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error('Este email já está cadastrado.');
        }

        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
          throw new Error('Este nome de usuário já está em uso.');
        }

        const newUser: UserType = {
          id: 'user-' + Date.now(),
          username: username.trim(),
          email: email.trim(),
          password: password,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0070d1&color=fff&size=128`,
          role: 'user',
          status: 'Active',
          downloadHistory: [],
          favorites: [],
          createdAt: new Date().toISOString()
        };

        StorageService.addUser(newUser);
        StorageService.setCurrentUser(newUser);
        onSuccess(newUser);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 mx-auto mb-3 shadow-lg shadow-blue-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              {isLogin ? <Lock className="w-6 h-6 text-cyan-400" /> : <User className="w-6 h-6 text-cyan-400" />}
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {isLogin ? 'Bem-vindo de volta!' : 'Criar nova conta'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin ? 'Entre para acessar seus jogos e favoritos' : 'Cadastre-se para começar a baixar jogos'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nome de Usuário</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Escolha um nome de usuário"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">E-mail ou Usuário</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-blue-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processando...
              </span>
            ) : (
              isLogin ? 'Acessar Conta →' : 'Criar Conta →'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};