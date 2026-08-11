import React, { useState } from 'react';
import { X, User as UserIcon, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, KeyRound } from 'lucide-react';
import { StorageService } from '../services/storage';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (tab === 'login') {
        const user = StorageService.loginUser(email || username);
        onSuccess(user);
        onClose();
      } else {
        if (!username || !email) {
          setErrorMsg('Preencha todos os campos obrigatórios.');
          return;
        }
        const user = StorageService.registerUser(username.trim(), email.trim());
        onSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro ao processar sua requisição.');
    }
  };

  const handleQuickAdminLogin = () => {
    try {
      const user = StorageService.loginUser('manuelrepair2@gmail.com');
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800 mb-6">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              tab === 'login' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Entrar na Conta
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              tab === 'register' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Criar Cadastro
          </button>
        </div>

        {/* Notice Box for Admin Access */}
        <div className="bg-blue-950/40 border border-blue-800/60 rounded-2xl p-3 mb-4 flex items-center justify-between text-xs text-blue-200">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Proprietário: <strong>manuelrepair2@gmail.com</strong></span>
          </div>
          <button
            onClick={handleQuickAdminLogin}
            className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            Entrar como Admin
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs font-medium mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Nome de Usuário *</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ex: GamerPlayStation"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {tab === 'login' ? 'E-mail ou Usuário *' : 'Endereço de E-mail *'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                placeholder={tab === 'login' ? 'admin ou seu.email@exemplo.com' : 'seu.email@exemplo.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Senha *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{tab === 'login' ? 'Acessar Conta' : 'Concluir Cadastro'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
