import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  User, 
  Bell, 
  Menu, 
  X, 
  Gamepad2, 
  Settings,
  LogOut,
  Moon,
  Sun,
  ShieldAlert
} from 'lucide-react';
import { Category, Game, User as UserType } from '../types';

interface HeaderProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectGame: (game: Game) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenAdmin: () => void;
  onOpenAdminPassword: () => void;
  currentUser: UserType | null;
  unreadNotificationsCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  games: Game[];
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
  onOpenAdminPassword,
  currentUser,
  unreadNotificationsCount,
  theme,
  onToggleTheme,
  games
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // ===== PESQUISAR JOGOS (USANDO DADOS DO MONGODB) =====
  const searchResults = searchQuery.trim() 
    ? games.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.genres?.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const handleSelectGame = (game: Game) => {
    onSelectGame(game);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
              PC/PS4
            </div>
            <span className="font-extrabold text-lg text-white tracking-wider hidden sm:block">
              PLay Games
            </span>
          </div>

          {/* Barra de Pesquisa */}
          <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                placeholder="Pesquisar jogos..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Resultados da Pesquisa */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
                {searchResults.slice(0, 8).map((game) => (
                  <button
                    key={game.id}
                    onClick={() => handleSelectGame(game)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 transition-colors text-left"
                  >
                    <img 
                      src={game.coverUrl} 
                      alt={game.title} 
                      className="w-10 h-14 object-cover rounded-md"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-100 block">{game.title}</span>
                      <span className="text-[10px] text-slate-400">{game.genres?.join(', ')}</span>
                    </div>
                  </button>
                ))}
                {searchResults.length > 8 && (
                  <div className="p-2 text-center text-xs text-slate-500 border-t border-slate-800">
                    Mais {searchResults.length - 8} resultados...
                  </div>
                )}
              </div>
            )}

            {showSearchResults && searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 text-center">
                <p className="text-xs text-slate-400">Nenhum jogo encontrado para "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Ações do Usuário */}
          <div className="flex items-center gap-2">
            {/* Tema */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notificações */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* ===== ADMIN - BOTÃO COM PROTEÇÃO POR SENHA ===== */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenAdminPassword}
                className="p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 transition-colors"
                title="Acessar Painel Admin"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            )}

            {/* Perfil / Login */}
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.username} 
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-bold text-slate-200 hidden sm:block">
                  {currentUser.username}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            )}

            {/* Menu Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Categorias */}
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => onSelectCategory('todos')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === 'todos'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.slug
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 p-4">
          <div className="flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => { onOpenProfile(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <img src={currentUser.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-bold text-slate-100">{currentUser.username}</span>
                </button>
                <button
                  onClick={() => { onOpenAdminPassword(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <ShieldAlert className="w-5 h-5" /> Admin
                </button>
              </>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
              >
                <User className="w-5 h-5" /> Entrar / Cadastrar
              </button>
            )}
            <hr className="border-slate-800" />
            <button
              onClick={() => { onOpenNotifications(); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" /> Notificações
            </button>
            <button
              onClick={() => { onToggleTheme(); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};