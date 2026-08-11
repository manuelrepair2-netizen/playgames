import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { Game } from '../types';
import { StorageService } from '../services/storage';

interface ReportModalProps {
  game: Game | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ game, onClose }) => {
  const [selectedLink, setSelectedLink] = useState('');
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!game) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    StorageService.addReport(
      game.id,
      game.title,
      selectedLink || (game.downloadLinks[0]?.url || 'Geral'),
      reason.trim(),
      email.trim() || undefined
    );

    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Denunciar Link Quebrado</h3>
            <p className="text-xs text-slate-400">{game.title}</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2 animate-bounce" />
            <h4 className="text-base font-bold text-slate-100">Denúncia Enviada!</h4>
            <p className="text-xs text-slate-400 mt-1">Nossa equipe administrativa irá analisar e corrigir o link em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Servidor com problema:</label>
              <select
                value={selectedLink}
                onChange={(e) => setSelectedLink(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">Selecione o servidor (opcional)</option>
                {game.downloadLinks.map((l) => (
                  <option key={l.id} value={l.url}>
                    {l.label} ({l.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Descrição do Problema *</label>
              <textarea
                required
                rows={3}
                placeholder="Ex: O link do Google Drive está dando erro 404 / arquivo removido..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Seu E-mail (opcional, para ser avisado):</label>
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Denúncia para o Admin</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
