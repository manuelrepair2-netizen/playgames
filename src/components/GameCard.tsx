import React from 'react';
import { Star, Download, Info, Heart, HardDrive, Calendar, ArrowDownCircle } from 'lucide-react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onSelectGame: (game: Game) => void;
  onOpenDownloadModal: (game: Game) => void;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
  viewMode?: 'grid' | 'list';
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onSelectGame,
  onOpenDownloadModal,
  isFavorite,
  onToggleFavorite,
  viewMode = 'grid'
}) => {
  const formattedDownloads = game.downloadsCount > 1000 
    ? `${(game.downloadsCount / 1000).toFixed(1)}k` 
    : game.downloadsCount.toString();

  const formattedYear = game.releaseDate ? game.releaseDate.substring(0, 4) : '2022';

  if (viewMode === 'list') {
    return (
      <div className="group relative bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-4 transition-all duration-200 shadow-lg">
        {/* Thumbnail */}
        <div 
          onClick={() => onSelectGame(game)}
          className="relative w-full sm:w-28 h-36 shrink-0 rounded-xl overflow-hidden cursor-pointer bg-slate-950"
        >
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700/80">
            {game.size}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                {game.genres.slice(0, 2).join(' • ')}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{formattedYear}</span>
            </div>
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-1.5 rounded-full transition-colors ${
                isFavorite ? 'text-red-500 bg-red-500/10' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          <h3 
            onClick={() => onSelectGame(game)}
            className="text-base font-bold text-slate-100 group-hover:text-blue-400 cursor-pointer transition-colors truncate mt-1"
          >
            {game.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-normal">
            {game.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{game.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <ArrowDownCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>{formattedDownloads} downloads</span>
            </div>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
              {game.cusaCode || 'CUSA'}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
          <button
            onClick={() => onOpenDownloadModal(game)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Baixar</span>
          </button>
          <button
            onClick={() => onSelectGame(game)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors cursor-pointer"
          >
            <Info className="w-4 h-4 text-blue-400" />
            <span>Detalhes</span>
          </button>
        </div>
      </div>
    );
  }

  // Grid Mode Card
  return (
    <div className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full">
      
      {/* Poster Image Container */}
      <div 
        onClick={() => onSelectGame(game)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950 cursor-pointer"
      >
        <img
          src={game.coverUrl}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark gradient shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Size Badge */}
        <span className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md text-emerald-400 text-[11px] font-extrabold px-2.5 py-1 rounded-lg border border-slate-800 shadow-md flex items-center gap-1">
          <HardDrive className="w-3 h-3 text-emerald-400" />
          {game.size}
        </span>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-md cursor-pointer ${
            isFavorite 
              ? 'bg-red-500/20 text-red-500 border border-red-500/40' 
              : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800 hover:scale-110'
          }`}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
        </button>

        {/* Download Count Badge on Bottom Right of Image */}
        <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-800 flex items-center gap-1">
          <ArrowDownCircle className="w-3 h-3 text-blue-400" />
          <span>{formattedDownloads}</span>
        </div>

        {/* Rating Badge on Bottom Left of Image */}
        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2 py-0.5 rounded-md border border-slate-800 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{game.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        
        <div>
          {/* Genre & Year */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span className="text-blue-400 font-bold truncate max-w-[150px]">
              {game.genres.slice(0, 2).join(', ')}
            </span>
            <span className="text-slate-500">{formattedYear}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelectGame(game)}
            className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1 cursor-pointer"
            title={game.title}
          >
            {game.title}
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60">
          <button
            onClick={() => onSelectGame(game)}
            className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Detalhes</span>
          </button>

          <button
            onClick={() => onOpenDownloadModal(game)}
            className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Baixar</span>
          </button>
        </div>

      </div>

    </div>
  );
};
