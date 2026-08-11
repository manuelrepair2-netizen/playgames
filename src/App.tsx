import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  ExternalLink, 
  ArrowUp,
  FolderDown,
  Globe,
  Radio,
  Download
} from 'lucide-react';
import { Game, Category, User, SiteNotification, SiteSettings } from './types';
import { INITIAL_CATEGORIES } from './data/initialData';
import { StorageService, EVENT_STATE_CHANGED } from './services/storage';
import { Header } from './components/Header';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { GameGrid } from './components/GameGrid';
import { GameDetailsModal } from './components/GameDetailsModal';
import { DownloadModal } from './components/DownloadModal';
import { ReportModal } from './components/ReportModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { AdminPanel } from './components/admin/AdminPanel';

// ===== NOVA FUNÇÃO PARA BUSCAR DO BANCO =====
const API_URL = '/api';

async function fetchGamesFromAPI() {
  const response = await fetch(`${API_URL}/games`);
  if (!response.ok) throw new Error('Erro ao carregar jogos');
  const data = await response.json();
  return data.data; // MongoDB retorna { status: 'success', data: [...] }
}

export default function App() {
  // Global State
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<SiteNotification[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // ===== ESTADOS DE CARREGAMENTO =====
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Control States
  const [selectedGameForDetails, setSelectedGameForDetails] = useState<Game | null>(null);
  const [selectedGameForDownload, setSelectedGameForDownload] = useState<Game | null>(null);
  const [selectedGameForReport, setSelectedGameForReport] = useState<Game | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // ===== FUNÇÃO PARA CARREGAR DADOS =====
  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const gamesFromAPI = await fetchGamesFromAPI();
      setGames(gamesFromAPI);
    } catch (err) {
      console.error('Erro ao carregar jogos:', err);
      setError('Não foi possível carregar os jogos. Tente novamente mais tarde.');
      
      // Fallback: tentar carregar do Storage local
      const localGames = StorageService.getGames();
      if (localGames.length > 0) {
        setGames(localGames);
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== LOAD INICIAL =====
  useEffect(() => {
    // Inicializar Storage (para categorias, usuários, etc)
    StorageService.init();
    
    // Carregar dados do usuário local
    setCurrentUser(StorageService.getCurrentUser());
    setNotifications(StorageService.getNotifications());
    setSettings(StorageService.getSettings());
    setTheme(StorageService.getTheme());

    // Carregar jogos do MongoDB
    loadGames();

    // Event listener para atualizações
    const handleStateChange = () => {
      // Recarregar apenas dados locais (não jogos)
      setCurrentUser(StorageService.getCurrentUser());
      setNotifications(StorageService.getNotifications());
      setSettings(StorageService.getSettings());
      setTheme(StorageService.getTheme());
    };
    window.addEventListener(EVENT_STATE_CHANGED, handleStateChange);

    // Verificar rota admin
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }

    return () => {
      window.removeEventListener(EVENT_STATE_CHANGED, handleStateChange);
    };
  }, []);

  // ===== FUNÇÃO PARA ATUALIZAR JOGOS (usada pelo admin) =====
  const refreshGames = async () => {
    await loadGames();
    // Disparar evento para atualizar outros componentes
    window.dispatchEvent(new Event(EVENT_STATE_CHANGED));
  };

  // Unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Toggle favorite
  const handleToggleFavorite = (gameId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    StorageService.toggleFavorite(gameId);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    StorageService.setTheme(nextTheme);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ===== RENDER DE CARREGAMENTO =====
  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-semibold">Carregando jogos...</p>
          <p className="text-sm text-slate-400">Aguardando conexão com o banco de dados</p>
        </div>
      </div>
    );
  }

  // ===== RENDER DE ERRO =====
  if (error && games.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}>
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-red-500">Erro ao carregar dados</h2>
          <p className="text-slate-400">{error}</p>
          <button
            onClick={refreshGames}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 font-sans ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* Header */}
      <Header
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onSelectGame={(game) => setSelectedGameForDetails(game)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsDrawerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentUser={currentUser}
        unreadNotificationsCount={unreadCount}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Body */}
      <main className="flex-1">
        
        {/* Featured Banner Carousel */}
        <FeaturedCarousel
          games={games}
          onSelectGame={(game) => setSelectedGameForDetails(game)}
          onOpenDownloadModal={(game) => setSelectedGameForDownload(game)}
        />

        {/* Catalog Game Grid */}
        <GameGrid
          games={games}
          selectedCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onSelectGame={(game) => setSelectedGameForDetails(game)}
          onOpenDownloadModal={(game) => setSelectedGameForDownload(game)}
          favorites={currentUser?.favorites || []}
          onToggleFavorite={handleToggleFavorite}
        />

      </main>

      {/* Footer */}
      <footer className="mt-16 bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                PS4
              </div>
              <span className="font-extrabold text-lg text-white tracking-wider">{settings.siteTitle}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {settings.siteDescription} Todos os arquivos PKG, DLCs e atualizações fornecidos com links diretos e verificados para Playstation 4.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Conexão Segura SSL • Servidores no Google Drive e MEGA</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">Categorias Populares</h4>
            <ul className="space-y-1.5 text-xs">
              <li><button onClick={() => setActiveCategory('acao')} className="hover:text-blue-400 transition-colors">Jogos de Ação</button></li>
              <li><button onClick={() => setActiveCategory('rpg')} className="hover:text-blue-400 transition-colors">Jogos de RPG & Fantasia</button></li>
              <li><button onClick={() => setActiveCategory('esportes')} className="hover:text-blue-400 transition-colors">Futebol & Esportes</button></li>
              <li><button onClick={() => setActiveCategory('corrida')} className="hover:text-blue-400 transition-colors">Simuladores de Corrida</button></li>
              <li><button onClick={() => setActiveCategory('terror')} className="hover:text-blue-400 transition-colors">Survival Horror</button></li>
            </ul>
          </div>

          {/* Admin & Scroll Top */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Acesso Rápido</h4>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-xs font-bold text-cyan-400 bg-slate-900 border border-cyan-500/30 px-3 py-2 rounded-xl block hover:bg-slate-800 transition-colors w-full text-left"
            >
              Área Administrativa (/admin)
            </button>
            
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white pt-2 cursor-pointer"
            >
              <ArrowUp className="w-4 h-4 text-blue-400" />
              <span>Voltar ao Topo</span>
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-2">
          <p>© 2026 {settings.siteTitle}. Todos os direitos reservados aos respectivos desenvolvedores e produtoras de jogos.</p>
          <div className="flex items-center gap-4">
            <span>Termos de Uso</span>
            <span>Aviso DMCA</span>
            <span>Privacidade</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {selectedGameForDetails && (
        <GameDetailsModal
          game={selectedGameForDetails}
          onClose={() => setSelectedGameForDetails(null)}
          onOpenDownloadModal={(game) => setSelectedGameForDownload(game)}
          onOpenReportModal={(game) => setSelectedGameForReport(game)}
          isFavorite={currentUser?.favorites?.includes(selectedGameForDetails.id) || false}
          onToggleFavorite={handleToggleFavorite}
          currentUser={currentUser}
          allGames={games}
          onSelectGame={(g) => setSelectedGameForDetails(g)}
        />
      )}

      {selectedGameForDownload && (
        <DownloadModal
          game={selectedGameForDownload}
          onClose={() => setSelectedGameForDownload(null)}
        />
      )}

      {selectedGameForReport && (
        <ReportModal
          game={selectedGameForReport}
          onClose={() => setSelectedGameForReport(null)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(user) => setCurrentUser(user)}
        />
      )}

      {isProfileModalOpen && (
        <UserProfileModal
          user={currentUser}
          onClose={() => setIsProfileModalOpen(false)}
          onLogout={() => {
            StorageService.setCurrentUser(null);
            setCurrentUser(null);
          }}
          allGames={games}
          onSelectGame={(g) => setSelectedGameForDetails(g)}
          onOpenDownloadModal={(g) => setSelectedGameForDownload(g)}
        />
      )}

      {isNotificationsDrawerOpen && (
        <NotificationsDrawer
          notifications={notifications}
          onClose={() => setIsNotificationsDrawerOpen(false)}
          onRefresh={() => {
            setNotifications(StorageService.getNotifications());
          }}
        />
      )}

      {isAdminOpen && (
        <AdminPanel
          onCloseAdmin={() => setIsAdminOpen(false)}
          onRefreshAll={refreshGames}
        />
      )}

    </div>
  );
}