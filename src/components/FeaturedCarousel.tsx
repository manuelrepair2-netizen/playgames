import React, { useState, useEffect } from 'react';
import { Download, Info, Star, ChevronLeft, ChevronRight, HardDrive, Calendar, Play } from 'lucide-react';
import { Game } from '../types';

interface FeaturedCarouselProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
  onOpenDownloadModal: (game: Game) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  games,
  onSelectGame,
  onOpenDownloadModal,
}) => {
  const featuredGames = games.filter(g => g.featured && g.status === 'Active').slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredGames.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  if (featuredGames.length === 0) return null;

  const current = featuredGames[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="relative h-[420px] sm:h-[460px] md:h-[500px] w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
        
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 transition-all duration-700 ease-out">
          <img
            src={current.bannerUrl || current.coverUrl}
            alt={current.title}
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-90 group-hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent w-full md:w-3/4" />
        </div>

        {/* Content Section */}
        <div className="absolute inset-0 p-6 sm:p-10 md:p-12 flex flex-col justify-end max-w-2xl z-10">
          
          {/* Badge & Rating */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-md">
              Destaque PS4
            </span>
            <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{current.rating.toFixed(1)}</span>
              <span className="text-amber-200/60 font-normal text-[10px]">({current.ratingCount})</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-900/80 text-emerald-400 border border-slate-700/80 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm">
              <HardDrive className="w-3 h-3" />
              <span>{current.size}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md mb-2">
            {current.title}
          </h2>

          {/* Genres & Details */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mb-4 font-medium">
            <span className="text-blue-400 font-bold">{current.genres.join(' • ')}</span>
            <span>|</span>
            <span>Firmware: <strong className="text-slate-100">{current.firmware}</strong></span>
            <span>|</span>
            <span className="text-slate-400">{current.developer}</span>
          </div>

          {/* Description snippet */}
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-3 mb-6 max-w-xl font-normal leading-relaxed">
            {current.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenDownloadModal(current)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Baixar Agora</span>
            </button>

            <button
              onClick={() => onSelectGame(current)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/90 backdrop-blur-md shadow-lg transition-all hover:border-slate-500 cursor-pointer"
            >
              <Info className="w-4 h-4 text-blue-400" />
              <span>Ver Detalhes</span>
            </button>
          </div>

        </div>

        {/* Carousel Arrow Controls */}
        {featuredGames.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-slate-950/60 hover:bg-blue-600/90 text-white border border-slate-800 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer shadow-xl"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-slate-950/60 hover:bg-blue-600/90 text-white border border-slate-800 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer shadow-xl"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicator Dots */}
        <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
          {featuredGames.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'w-8 bg-blue-500 shadow-lg shadow-blue-500/50' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
