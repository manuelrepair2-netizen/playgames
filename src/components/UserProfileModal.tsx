import React, { useState } from 'react';
import { X, Heart, Download, LogOut, User as UserIcon, Shield, Clock, HardDrive, Gamepad2 } from 'lucide-react';
import { User, Game } from '../types';
import { StorageService } from '../services/storage';

interface UserProfileModalProps {
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
  allGames: Game[];
  onSelectGame: (game: Game) => void;
  onOpenDownloadModal: (game: Game) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  onClose,
  onLogout,
  allGames,
  onSelectGame,
  onOpenDownloadModal
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');

  if (!user) return null;

  const favoriteGames = allGames.filter(g => user.favorites?.includes(g.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5 mb-5">
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white truncate">{user.username}</h2>
              {user.role === 'admin' && (
                <span className="bg-blue-600 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Administrador
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            <span className="text-[10px] text-slate-500">Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair da Conta</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mb-4">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-extrabold uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === 'favorites' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Meus Favoritos ({favoriteGames.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-extrabold uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === 'history' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Histórico de Downloads ({user.downloadHistory?.length || 0})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 pr-1 scrollbar-thin">
          {activeTab === 'favorites' && (
            <div>
              {favoriteGames.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <Heart className="w-10 h-10 mx-auto mb-2 text-slate-700" />
                  <p className="text-xs">Você ainda não salvou nenhum jogo nos favoritos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favoriteGames.map((game) => (
                    <div
                      key={game.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 hover:border-blue-500/40 transition-colors"
                    >
                      <img src={game.coverUrl} alt={game.title} className="w-12 h-16 object-cover rounded-xl shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-100 truncate">{game.title}</h4>
                        <span className="text-[10px] text-emerald-400 font-bold">{game.size}</span>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              onClose();
                              onSelectGame(game);
                            }}
                            className="text-[10px] bg-slate-800 text-slate-200 font-semibold px-2 py-1 rounded-lg"
                          >
                            Ver Detalhes
                          </button>
                          <button
                            onClick={() => {
                              onClose();
                              onOpenDownloadModal(game);
                            }}
                            className="text-[10px] bg-emerald-600 text-slate-950 font-extrabold px-2 py-1 rounded-lg"
                          >
                            Baixar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              {!user.downloadHistory || user.downloadHistory.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <Download className="w-10 h-10 mx-auto mb-2 text-slate-700" />
                  <p className="text-xs">Nenhum histórico de download registrado nesta conta.</p>
                </div>
              ) : (
                user.downloadHistory.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.gameTitle}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">Servidor: {item.linkType}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{new Date(item.downloadedAt).toLocaleString('pt-BR')}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
