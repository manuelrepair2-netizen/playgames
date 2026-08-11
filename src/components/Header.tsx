import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  User as UserIcon, 
  Gamepad2, 
  Sun, 
  Moon, 
  ShieldAlert, 
  LogOut, 
  Sparkles, 
  X, 
  Star, 
  Download,
  Flame,
  CheckCircle2,
  Settings,
  Bookmark
} from 'lucide-react';
import { Game, User, SiteNotification, Category } from '../types';
import { StorageService } from '../services/storage';

interface HeaderProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  onSelectGame: (game: Game) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenAdmin: () => void;
  currentUser: User | null;
  unreadNotificationsCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  onSelectGame,
  onOpenAuth,
  onOpenProfile,
  onOpenNotifications,
  onOpenAdmin,
  currentUser,
  unreadNotificationsCount,
  theme,
  onToggleTheme
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const allGames = StorageService.getGames();
      const q = searchQuery.toLowerCase();
      const filtered = allGames.filter(
        g => g.status === 'Active' && (
          g.title.toLowerCase().includes(q) ||
          g.genres.some(gen => gen.toLowerCase().includes(q)) ||
          g.developer.toLowerCase().includes(q) ||
          g.cusaCode.toLowerCase().includes(q)
        )
      ).slice(0, 6);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectSearchResult = (game: Game) => {
    onSelectGame(game);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/85 dark:bg-slate-950/90 border-b border-slate-800/80 transition-colors duration-200">
      {/* Top Banner / Announcement */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-200" />
        <span>🔥 NOVIDADE: Servidores no Google Drive com velocidade máxima sem limites!</span>
        <span className="hidden md:inline-block bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-2">v9.00 / v11.00</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onSelectCategory('todos')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  PS4<span className="text-blue-500 font-black">GAMES</span>
                </span>
                <span className="text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded">
                  VAULT
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Download Direct & PKG High-Speed
              </p>
            </div>
          </div>

          {/* Search Bar with Autocomplete */}
          <div className="relative flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar jogos, gêneros, CUSA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-10 pr-12 py-2 text-sm bg-slate-900/90 border border-slate-700/70 rounded-full text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded">
                  Ctrl+K
                </span>
              )}
            </div>

            {/* Search Dropdown Results */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/60">
                <div className="p-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/60 flex items-center justify-between">
                  <span>Resultados ({searchResults.length})</span>
                  <span className="text-blue-400 text-[10px]">Pressione para abrir</span>
                </div>
                {searchResults.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleSelectSearchResult(game)}
                    className="flex items-center gap-3 p-2.5 hover:bg-slate-800/80 cursor-pointer transition-colors group"
                  >
                    <img
                      src={game.coverUrl}
                      alt={game.title}
                      className="w-10 h-12 object-cover rounded-md shadow group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-100 truncate group-hover:text-blue-400 transition-colors">
                        {game.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-blue-300 font-medium">{game.genres.slice(0, 2).join(', ')}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">{game.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold pr-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{game.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              title="Notificações do site"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-md">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Admin Quick Switcher / Link */}
            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/60 transition-all shadow-sm"
              title="Painel Administrativo (/admin)"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Painel Admin</span>
            </button>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all group"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  className="w-7 h-7 rounded-full object-cover border border-blue-500/40"
                />
                <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 hidden md:inline-block truncate max-w-[100px]">
                  {currentUser.username}
                </span>
                {currentUser.role === 'admin' && (
                  <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded-full uppercase">
                    Admin
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all transform active:scale-95"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Entrar / Cadastrar</span>
              </button>
            )}

          </div>

        </div>

        {/* Category Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800/50">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                {cat.slug === 'todos' && <Flame className="w-3 h-3 text-amber-400" />}
                {cat.name}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
