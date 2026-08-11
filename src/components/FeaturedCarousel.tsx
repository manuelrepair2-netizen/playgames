import React, { useState, useEffect } from 'react';
import { Game } from '../../types';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface FeaturedCarouselProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
  onOpenDownloadModal: (game: Game) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ 
  games, 
  onSelectGame, 
  onOpenDownloadModal 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filtrar jogos em destaque ou pegar os primeiros
  const featuredGames = games.filter(g => g.featured === true);
  const displayGames = featuredGames.length > 0 ? featuredGames : games.slice(0, 5);
  
  // Se não houver jogos, mostrar mensagem
  if (displayGames.length === 0) {
    return (
      <div className="w-full bg-slate-900 rounded-2xl p-8 text-center">
        <p className="text-slate-400">Nenhum jogo em destaque no momento.</p>
        <p className="text-xs text-slate-500">Adicione jogos e marque como "Destaque" no Admin.</p>
      </div>
    );
  }

  // ===== AUTOPLAY - MUDA A CADA 5 SEGUNDOS =====
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayGames.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayGames.length]);

  const currentGame = displayGames[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + displayGames.length) % displayGames.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayGames.length);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden group">
      
      {/* Imagem de fundo */}
      <div 
        className="w-full h-full bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${currentGame.bannerUrl || currentGame.coverUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      {/* Conteúdo do banner */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase text-blue-400 tracking-wider">
            {currentGame.genres?.slice(0, 2).join(' • ')}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-2">
            {currentGame.title}
          </h2>
          <p className="text-sm text-slate-300 mt-2 line-clamp-2 max-w-xl">
            {currentGame.description}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => onOpenDownloadModal(currentGame)}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30"
            >
              <Download className="w-4 h-4" /> Baixar Agora
            </button>
            <button
              onClick={() => onSelectGame(currentGame)}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-sm transition-all"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>

      {/* Controles de navegação */}
      {displayGames.length > 1 && (
        <>
          {/* Botão Anterior */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Botão Próximo */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicadores (dots) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {displayGames.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};