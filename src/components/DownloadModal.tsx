import React from 'react';
import { Game } from '../types';
import { Download, X, ExternalLink } from 'lucide-react';

interface DownloadModalProps {
  game: Game;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ game, onClose }) => {
  
  const handleDownload = async (url: string, type: 'pc' | 'ps4') => {
    const gameId = game._id || game.id;
    
    if (!gameId) {
      console.error('❌ ID do jogo não encontrado!');
      window.open(url, '_blank');
      return;
    }
    
    try {
      console.log(`📊 Incrementando download para ${game.title} (ID: ${gameId})`);
      
      const response = await fetch(`/api/games/${gameId}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Download registrado! Novo total: ${data.data.downloadsCount}`);
      } else {
        console.warn('⚠️ Erro ao incrementar contador, mas continuando...');
      }
      
      window.open(url, '_blank');
      
    } catch (error) {
      console.error('❌ Erro no download:', error);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <img 
            src={game.coverUrl} 
            alt={game.title} 
            className="w-20 h-28 object-cover rounded-xl border border-slate-800"
          />
          <div>
            <h3 className="text-lg font-black text-white">{game.title}</h3>
            <span className="text-xs text-slate-400">{game.size}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Escolha a opção de download:
        </p>

        <div className="space-y-3">
          {game.downloadLinks.length > 0 && (
            <button
              onClick={() => handleDownload(game.downloadLinks[0].url, 'pc')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30"
            >
              <Download className="w-4 h-4" />
              Baixar para PC
              <ExternalLink className="w-3 h-3 opacity-50" />
            </button>
          )}

          {game.downloadLinks.length > 1 && (
            <button
              onClick={() => handleDownload(game.downloadLinks[1].url, 'ps4')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/30"
            >
              <Download className="w-4 h-4" />
              Baixar para PS4
              <ExternalLink className="w-3 h-3 opacity-50" />
            </button>
          )}
        </div>

        <p className="text-[10px] text-slate-500 text-center mt-4">
          Os links são verificados e atualizados regularmente.
        </p>
      </div>
    </div>
  );
};