import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  HardDrive, 
  FileCheck, 
  Layers, 
  Sparkles,
  Server
} from 'lucide-react';
import { Game, DownloadLink } from '../types';
import { StorageService } from '../services/storage';

interface DownloadModalProps {
  game: Game | null;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ game, onClose }) => {
  const [countdown, setCountdown] = useState(5);
  const [selectedMirror, setSelectedMirror] = useState<DownloadLink | null>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    if (!game) return;
    if (game.downloadLinks && game.downloadLinks.length > 0) {
      setSelectedMirror(game.downloadLinks[0]);
    }
    setCountdown(5);
    setDownloadStarted(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [game]);

  if (!game) return null;

  const handleStartDownload = () => {
    if (!selectedMirror) return;

    // Increment download counter
    StorageService.incrementDownloads(game.id, selectedMirror.type);
    setDownloadStarted(true);

    // Open link in new tab or direct download simulation
    window.open(selectedMirror.url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-5">
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-16 h-20 object-cover rounded-xl shadow-md shrink-0 border border-slate-800"
          />
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-max mb-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verificado • Livre de Malwares</span>
            </div>
            <h3 className="text-lg font-extrabold text-white line-clamp-1">{game.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tamanho: <span className="text-slate-200 font-bold">{game.size}</span> • Firmware: <span className="text-blue-400 font-semibold">{game.firmware}</span>
            </p>
          </div>
        </div>

        {/* Mirror Selector */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-300 block mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>Selecione o Servidor de Download:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {game.downloadLinks.map((link) => {
              const isSelected = selectedMirror?.id === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setSelectedMirror(link)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 font-bold' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-xs block truncate">{link.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">{link.type}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Countdown Security Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center mb-6">
          {countdown > 0 ? (
            <div className="flex flex-col items-center justify-center py-2">
              <Clock className="w-6 h-6 text-amber-400 mb-2 animate-spin" />
              <p className="text-xs text-slate-300 font-medium">
                Gerando link seguro de alta velocidade...
              </p>
              <div className="mt-2 text-2xl font-black text-amber-400 font-mono">
                {countdown}s
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 text-emerald-400">
              <CheckCircle2 className="w-7 h-7 mb-1" />
              <p className="text-xs font-bold text-emerald-300">Link de Download Liberado com Sucesso!</p>
              <span className="text-[10px] text-slate-400 mt-0.5">Clique abaixo para iniciar o download em alta velocidade</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartDownload}
          disabled={countdown > 0}
          className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
            countdown > 0
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/25 active:scale-98'
          }`}
        >
          <Download className="w-5 h-5 stroke-[2.5]" />
          <span>
            {downloadStarted ? 'Abrindo Servidor de Download...' : 'Iniciar Download do Jogo'}
          </span>
          <ExternalLink className="w-4 h-4 ml-1" />
        </button>

        {/* Download Count Footer */}
        <div className="mt-4 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Este jogo já foi baixado <strong>{game.downloadsCount.toLocaleString()}</strong> vezes nesta plataforma.</span>
        </div>

      </div>
    </div>
  );
};
