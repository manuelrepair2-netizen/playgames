import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Star, 
  Heart, 
  Share2, 
  HardDrive, 
  Calendar, 
  Globe, 
  Languages, 
  Cpu, 
  Building2, 
  AlertTriangle, 
  Send, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Game, Comment, User } from '../types';
import { StorageService } from '../services/storage';

interface GameDetailsModalProps {
  game: Game | null;
  onClose: () => void;
  onOpenDownloadModal: (game: Game) => void;
  onOpenReportModal: (game: Game) => void;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
  currentUser: User | null;
  allGames: Game[];
  onSelectGame: (game: Game) => void;
}

export const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  game,
  onClose,
  onOpenDownloadModal,
  onOpenReportModal,
  isFavorite,
  onToggleFavorite,
  currentUser,
  allGames,
  onSelectGame
}) => {
  const [activeScreenshot, setActiveScreenshot] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (game) {
      setActiveScreenshot(game.bannerUrl || game.coverUrl);
      setComments(StorageService.getComments(game.id));
    }
  }, [game]);

  if (!game) return null;

  const relatedGames = allGames
    .filter(g => g.id !== game.id && g.genres.some(genre => game.genres.includes(genre)))
    .slice(0, 4);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    StorageService.addComment(game.id, newRating, newCommentText.trim());
    setComments(StorageService.getComments(game.id));
    setNewCommentText('');
  };

  const handleLikeComment = (commentId: string) => {
    StorageService.likeComment(commentId);
    setComments(StorageService.getComments(game.id));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Close & Actions */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-800 text-slate-300 border border-slate-700/80 backdrop-blur-md transition-all cursor-pointer"
            title="Copiar link"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onToggleFavorite(game.id)}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
              isFavorite 
                ? 'bg-red-500/20 text-red-500 border-red-500/40' 
                : 'bg-slate-950/70 text-slate-300 border-slate-700/80 hover:text-white'
            }`}
            title="Favoritar"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-950/70 hover:bg-red-600 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-0 scrollbar-thin">
          
          {/* Hero Banner / Screenshot Gallery View */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-950">
            <img
              src={activeScreenshot}
              alt={game.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

            {/* Title Overlay */}
            <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-md">
                    {game.genres.join(' • ')}
                  </span>
                  <span className="bg-slate-800/90 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                    {game.cusaCode || 'PS4 PKG'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {game.title}
                </h1>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onOpenDownloadModal(game)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Baixar Jogo ({game.size})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Screenshot Thumbnails Bar */}
          {game.screenshots && game.screenshots.length > 0 && (
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-2">Screenshots:</span>
              {[game.bannerUrl, ...game.screenshots].map((shot, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveScreenshot(shot)}
                  className={`relative w-20 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeScreenshot === shot ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/30' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={shot} alt="Screenshot" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Details Body */}
          <div className="p-6 space-y-8">
            
            {/* Technical Specifications Grid */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Especificações Técnicas</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
                <div className="flex items-center gap-2.5">
                  <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Tamanho</span>
                    <strong className="text-xs font-bold text-slate-100">{game.size}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Firmware Mínimo</span>
                    <strong className="text-xs font-bold text-slate-100">{game.firmware}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Languages className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Idioma</span>
                    <strong className="text-xs font-bold text-slate-100 truncate block max-w-[120px]">{game.language}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Região</span>
                    <strong className="text-xs font-bold text-slate-100">{game.region}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Desenvolvedora</span>
                    <strong className="text-xs font-bold text-slate-100">{game.developer}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Lançamento</span>
                    <strong className="text-xs font-bold text-slate-100">{game.releaseDate}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Description */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-2">
                Descrição do Jogo
              </h3>
              <p className="text-sm text-slate-300 font-normal leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                {game.description}
              </p>
            </div>

            {/* ===== SEÇÃO DE DOWNLOAD CORRIGIDA ===== */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-inner">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Links de Download Disponíveis</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Escolha a opção de download para PC ou PS4.
                  </p>
                </div>

                <button
                  onClick={() => onOpenReportModal(game)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Denunciar Link Quebrado</span>
                </button>
              </div>

              {/* Download Buttons - ABREM DIRETO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* PC */}
                {game.downloadLinks.length > 0 && (
                  <button
                    onClick={() => {
                      console.log('🔗 Abrindo link para PC:', game.downloadLinks[0].url);
                      window.open(game.downloadLinks[0].url, '_blank');
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors block">
                        Link de Download para PC
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">
                        Baixar para PC
                      </span>
                    </div>
                    <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </button>
                )}

                {/* PS4 */}
                {game.downloadLinks.length > 1 && (
                  <button
                    onClick={() => {
                      console.log('🔗 Abrindo link para PS4:', game.downloadLinks[1].url);
                      window.open(game.downloadLinks[1].url, '_blank');
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 transition-all text-left group cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-purple-400 transition-colors block">
                        Link para PS4
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">
                        Baixar para PS4
                      </span>
                    </div>
                    <Download className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            {/* User Comments & Star Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span>Avaliações e Comentários ({comments.length})</span>
                </h3>
                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{game.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">Deixe sua avaliação:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={2}
                    placeholder={currentUser ? "Escreva seu comentário sobre o jogo..." : "Comentar como visitante..."}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all ml-auto cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar Avaliação</span>
                  </button>
                </div>
              </form>

              {/* Comment List */}
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4 italic">Seja o primeiro a avaliar este jogo!</p>
                ) : (
                  comments.map((comm) => (
                    <div key={comm.id} className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-start gap-3">
                      <img src={comm.userAvatar} alt={comm.userName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{comm.userName}</span>
                          <div className="flex items-center gap-0.5 text-amber-400 text-xs font-semibold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{comm.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{comm.text}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                          <span>{new Date(comm.createdAt).toLocaleDateString('pt-BR')}</span>
                          <button
                            onClick={() => handleLikeComment(comm.id)}
                            className="flex items-center gap-1 hover:text-blue-400 transition-colors cursor-pointer"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{comm.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Related Games Slider/Grid */}
            {relatedGames.length > 0 && (
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider mb-3">
                  Jogos Relacionados
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {relatedGames.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectGame(rel)}
                      className="bg-slate-950 p-2 rounded-xl border border-slate-800 hover:border-blue-500/50 cursor-pointer group transition-all"
                    >
                      <img src={rel.coverUrl} alt={rel.title} className="w-full h-24 object-cover rounded-lg group-hover:scale-105 transition-transform" />
                      <h5 className="text-xs font-bold text-slate-200 group-hover:text-blue-400 truncate mt-1.5">{rel.title}</h5>
                      <span className="text-[10px] text-emerald-400 font-medium">{rel.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};