import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Grid2x2, 
  List, 
  Sparkles, 
  X, 
  Search, 
  Flame, 
  ChevronDown, 
  Star, 
  HardDrive,
  Gamepad2
} from 'lucide-react';
import { Game } from '../types';
import { GameCard } from './GameCard';

interface GameGridProps {
  games: Game[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  onSelectGame: (game: Game) => void;
  onOpenDownloadModal: (game: Game) => void;
  favorites: string[];
  onToggleFavorite: (gameId: string) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({
  games,
  selectedCategory,
  onSelectCategory,
  onSelectGame,
  onOpenDownloadModal,
  favorites,
  onToggleFavorite
}) => {
  const [sortBy, setSortBy] = useState<'newest' | 'downloads' | 'rating' | 'title' | 'size'>('downloads');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [displayLimit, setDisplayLimit] = useState<number>(12);

  // ===== FUNÇÃO DE DOWNLOAD COM CONTADOR =====
  const handleDownload = async (game: Game) => {
    try {
      console.log(`📊 Incrementando download para ${game.title}`);
      
      const response = await fetch(`/api/games/${game.id}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Download registrado! Novo total: ${data.data.downloadsCount}`);
      } else {
        console.warn('⚠️ Erro ao incrementar contador, mas continuando...');
      }
      
      // Abrir o modal de download
      onOpenDownloadModal(game);
      
    } catch (error) {
      console.error('❌ Erro no download:', error);
      // Mesmo com erro, abrir o modal
      onOpenDownloadModal(game);
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedGames = useMemo(() => {
    let result = games.filter(g => g.status === 'Active');

    // Category filter
    if (selectedCategory && selectedCategory !== 'todos') {
      const categoryNameMap: { [key: string]: string } = {
        'acao': 'Ação',
        'aventura': 'Aventura',
        'rpg': 'RPG',
        'esportes': 'Esportes',
        'corrida': 'Corrida',
        'luta': 'Luta',
        'terror': 'Terror',
        'mundo-aberto': 'Mundo Aberto'
      };
      const targetGenre = categoryNameMap[selectedCategory] || selectedCategory;
      result = result.filter(g => 
        g.genres.some(genre => genre.toLowerCase().includes(targetGenre.toLowerCase()))
      );
    }

    // Region Filter
    if (regionFilter !== 'all') {
      result = result.filter(g => g.region.toLowerCase().includes(regionFilter.toLowerCase()));
    }

    // Min Rating Filter
    if (minRatingFilter > 0) {
      result = result.filter(g => g.rating >= minRatingFilter);
    }

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.releaseDate || b.createdAt).getTime() - new Date(a.releaseDate || a.createdAt).getTime();
      }
      if (sortBy === 'downloads') {
        return b.downloadsCount - a.downloadsCount;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'size') {
        const parseSize = (s: string) => parseFloat(s) || 0;
        return parseSize(b.size) - parseSize(a.size);
      }
      return 0;
    });
  }, [games, selectedCategory, regionFilter, minRatingFilter, sortBy]);

  const visibleGames = filteredAndSortedGames.slice(0, displayLimit);
  const hasMore = displayLimit < filteredAndSortedGames.length;

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + 8);
  };

  const activeFiltersCount = (selectedCategory !== 'todos' ? 1 : 0) + (regionFilter !== 'all' ? 1 : 0) + (minRatingFilter > 0 ? 1 : 0);

  const clearAllFilters = () => {
    onSelectCategory('todos');
    setRegionFilter('all');
    setMinRatingFilter(0);
    setSortBy('downloads');
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Controls Bar: Sorting & Filter options */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Header Title & Counter */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Catálogo de Jogos PS4</span>
                <span className="text-xs bg-slate-800 text-blue-400 font-bold px-2 py-0.5 rounded-full border border-slate-700">
                  {filteredAndSortedGames.length} jogos
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Acesse downloads diretos de PKG, atualizações e DLCs
              </p>
            </div>
          </div>

          {/* Filter Dropdowns & Controls */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            
            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="downloads">🔥 Mais Baixados</option>
                <option value="newest">🆕 Mais Recentes</option>
                <option value="rating">⭐ Melhor Avaliados</option>
                <option value="title">🔤 Ordem Alfabética (A-Z)</option>
                <option value="size">💾 Maior Tamanho</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Region Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full appearance-none bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">🌍 Todas as Regiões</option>
                <option value="global">GLOBAL</option>
                <option value="usa">USA</option>
                <option value="eur">EUR</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Rating Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={minRatingFilter}
                onChange={(e) => setMinRatingFilter(Number(e.target.value))}
                className="w-full appearance-none bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value={0}>⭐ Todas Avaliações</option>
                <option value={4.8}>⭐ 4.8 ou superior</option>
                <option value={4.5}>⭐ 4.5 ou superior</option>
                <option value={4.0}>⭐ 4.0 ou superior</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Modo Grade (Cards)"
              >
                <Grid2x2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Modo Lista Compacta"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Reset Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-semibold hover:bg-red-500/20 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpar Filtros</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Empty State */}
      {visibleGames.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/50 border border-slate-800 rounded-3xl my-6">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-200">Nenhum jogo encontrado</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Não encontramos resultados para os filtros selecionados. Tente alterar o gênero ou os critérios de busca.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
          >
            Ver todos os jogos
          </button>
        </div>
      ) : (
        /* Games Grid / List Output */
        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            : "flex flex-col gap-3"
        }>
          {visibleGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onSelectGame={onSelectGame}
              onOpenDownloadModal={() => handleDownload(game)}
              isFavorite={favorites.includes(game.id)}
              onToggleFavorite={onToggleFavorite}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Pagination / Load More Button */}
      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm border border-slate-800 hover:border-blue-500 shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Carregar Mais Jogos ({filteredAndSortedGames.length - visibleGames.length} restantes)
          </button>
        </div>
      )}

    </section>
  );
};