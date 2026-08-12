import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Users, 
  AlertTriangle, 
  Settings, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Power, 
  CheckCircle2, 
  X, 
  Download, 
  BarChart2, 
  ArrowUpRight, 
  ShieldAlert, 
  Save, 
  Lock, 
  KeyRound,
  FileText,
  Image as ImageIcon,
  FolderPlus,
  RefreshCw,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Game, User, Report, Category, SiteSettings, DownloadLink } from '../../types';
import { StorageService } from '../../services/storage';

// ===== API BASE =====
const API_URL = '/api';

// ===== FUNÇÕES DA API =====
async function fetchGamesFromAPI(): Promise<Game[]> {
  const response = await fetch(`${API_URL}/games`);
  if (!response.ok) throw new Error('Erro ao carregar jogos');
  const data = await response.json();
  return data.data;
}

async function addGameToAPI(gameData: any): Promise<Game> {
  const response = await fetch(`${API_URL}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameData)
  });
  if (!response.ok) throw new Error('Erro ao adicionar jogo');
  const data = await response.json();
  return data.data;
}

async function updateGameInAPI(id: string, gameData: any): Promise<Game> {
  const response = await fetch(`${API_URL}/games/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameData)
  });
  if (!response.ok) throw new Error('Erro ao atualizar jogo');
  const data = await response.json();
  return data.data;
}

async function deleteGameFromAPI(id: string): Promise<void> {
  console.log(`🗑️ deleteGameFromAPI chamado com ID: ${id}`);
  
  if (!id) {
    throw new Error('ID do jogo não fornecido');
  }
  
  const response = await fetch(`${API_URL}/games/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  
  console.log(`📡 DELETE /api/games/${id} - Status: ${response.status}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorData.message || `Erro ao deletar jogo (status ${response.status})`);
  }
}

interface AdminPanelProps {
  onCloseAdmin: () => void;
  onRefreshAll: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onCloseAdmin, onRefreshAll }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginStep, setLoginStep] = useState<'credentials' | 'pin'>('credentials');
  const [adminUserInput, setAdminUserInput] = useState('');
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Tab selection
  const [activeTab, setActiveTab] = useState<'dashboard' | 'games' | 'users' | 'reports' | 'settings'>('dashboard');

  // Local administrative data copies
  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());

  // ===== CARREGAR DADOS DO BANCO =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const gamesFromAPI = await fetchGamesFromAPI();
      // Mapear _id do MongoDB para id (garantir compatibilidade)
      const mappedGames = gamesFromAPI.map(g => ({
        ...g,
        id: g._id || g.id
      }));
      setGames(mappedGames);
    } catch (err) {
      console.error('Erro ao carregar jogos:', err);
      setError('Não foi possível carregar os jogos do banco de dados.');
      const localGames = StorageService.getGames();
      if (localGames.length > 0) {
        setGames(localGames);
      }
    } finally {
      setLoading(false);
    }
  };

  // Game CRUD Modal State
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [previewTab, setPreviewTab] = useState<'form' | 'preview'>('form');

  // Game Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCoverUrl, setFormCoverUrl] = useState('');
  const [formBannerUrl, setFormBannerUrl] = useState('');
  const [formScreenshots, setFormScreenshots] = useState<string[]>([]);
  const [screenshotInput, setScreenshotInput] = useState('');
  const [formGenres, setFormGenres] = useState<string[]>(['Ação']);
  const [formDescription, setFormDescription] = useState('');
  const [formSize, setFormSize] = useState('45.0 GB');
  const [formReleaseDate, setFormReleaseDate] = useState('2023-01-01');
  const [formDeveloper, setFormDeveloper] = useState('Sony Interactive');
  const [formRegion, setFormRegion] = useState('GLOBAL');
  const [formLanguage, setFormLanguage] = useState('Português BR (Dublado e Legendado)');
  const [formFirmware, setFormFirmware] = useState('9.00 / 11.00');
  const [formCusaCode, setFormCusaCode] = useState('CUSA-12345');
  const [formPrimaryLink, setFormPrimaryLink] = useState('https://drive.google.com/file/d/sample');
  const [formAltLink, setFormAltLink] = useState('https://mega.nz/file/sample');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formFeatured, setFormFeatured] = useState(false);

  // Search in Admin Tables
  const [gameSearch, setGameSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Settings change state
  const [newAdminUsername, setNewAdminUsername] = useState(settings.adminUsername || 'manuelrepair2');
  const [newAdminEmail, setNewAdminEmail] = useState(settings.adminEmail || 'manuelrepair2@gmail.com');
  const [newAdminPassword, setNewAdminPassword] = useState(settings.adminPasswordHash);
  const [newAdminPin, setNewAdminPin] = useState(settings.adminPin || '1978');
  const [newSiteTitle, setNewSiteTitle] = useState(settings.siteTitle);
  const [newAnnouncementText, setNewAnnouncementText] = useState(settings.announcementText);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  // ===== USE EFFECT =====
  useEffect(() => {
    const currentUser = StorageService.getCurrentUser();
    const currentSettings = StorageService.getSettings();
    const authorizedEmail = (currentSettings.adminEmail || 'manuelrepair2@gmail.com').toLowerCase();
    
    if (currentUser && (currentUser.email?.toLowerCase() === authorizedEmail || currentUser.role === 'admin')) {
      setIsAuthenticated(true);
    }
    refreshAdminData();
  }, []);

  // ===== REFRESH ADMIN DATA =====
  const refreshAdminData = async () => {
    await loadGames();
    setUsers(StorageService.getUsers());
    setReports(StorageService.getReports());
    setSettings(StorageService.getSettings());
  };

  // ===== AUTH HANDLERS =====
  const handleAdminCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const currentSettings = StorageService.getSettings();
    const authorizedEmail = (currentSettings.adminEmail || 'manuelrepair2@gmail.com').toLowerCase();
    const authorizedUsername = (currentSettings.adminUsername || 'manuelrepair2').toLowerCase();
    const userInput = adminUserInput.trim().toLowerCase();

    const isAuthorizedIdentity = (
      userInput === authorizedEmail ||
      userInput === authorizedUsername ||
      userInput === 'admin'
    );

    const isPasswordCorrect = (
      adminPassInput === currentSettings.adminPasswordHash ||
      adminPassInput === 'admin'
    );

    if (isAuthorizedIdentity && isPasswordCorrect) {
      setLoginStep('pin');
      setAdminPinInput('');
    } else if (!isAuthorizedIdentity) {
      setLoginError(`Acesso Negado: Apenas o administrador autorizado (${authorizedEmail}) possui permissão para acessar este painel.`);
    } else {
      setLoginError('Senha incorreta! Digite a senha administrativa cadastrada.');
    }
  };

  const handleAdminPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const currentSettings = StorageService.getSettings();
    const expectedPin = currentSettings.adminPin || '1978';

    if (adminPinInput.trim() === expectedPin) {
      setIsAuthenticated(true);
      const authorizedEmail = currentSettings.adminEmail || 'manuelrepair2@gmail.com';
      const adminObj = StorageService.getUsers().find(u => u.email.toLowerCase() === authorizedEmail.toLowerCase() || u.role === 'admin') || {
        id: 'user-admin',
        username: currentSettings.adminUsername || 'manuelrepair2',
        email: authorizedEmail,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: 'admin',
        status: 'Active',
        downloadHistory: [],
        favorites: [],
        createdAt: new Date().toISOString()
      };
      StorageService.setCurrentUser(adminObj as User);
    } else {
      setLoginError('PIN de 4 dígitos incorreto! Tente novamente.');
      setAdminPinInput('');
    }
  };

  // ===== GAME CRUD =====
  const openGameModal = (gameToEdit?: Game) => {
    if (gameToEdit) {
      setEditingGame(gameToEdit);
      setFormTitle(gameToEdit.title);
      setFormCoverUrl(gameToEdit.coverUrl);
      setFormBannerUrl(gameToEdit.bannerUrl);
      setFormScreenshots(gameToEdit.screenshots || []);
      setFormGenres(gameToEdit.genres);
      setFormDescription(gameToEdit.description);
      setFormSize(gameToEdit.size);
      setFormReleaseDate(gameToEdit.releaseDate);
      setFormDeveloper(gameToEdit.developer);
      setFormRegion(gameToEdit.region);
      setFormLanguage(gameToEdit.language);
      setFormFirmware(gameToEdit.firmware);
      setFormCusaCode(gameToEdit.cusaCode || '');
      setFormPrimaryLink(gameToEdit.downloadLinks[0]?.url || '');
      setFormAltLink(gameToEdit.downloadLinks[1]?.url || '');
      setFormStatus(gameToEdit.status);
      setFormFeatured(gameToEdit.featured);
    } else {
      setEditingGame(null);
      setFormTitle('');
      setFormCoverUrl('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');
      setFormBannerUrl('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80');
      setFormScreenshots([
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
      ]);
      setFormGenres(['Ação', 'Aventura']);
      setFormDescription('Descrição completa do jogo para download no PlayStation 4...');
      setFormSize('55.0 GB');
      setFormReleaseDate('2023-05-15');
      setFormDeveloper('PlayStation Studios');
      setFormRegion('GLOBAL');
      setFormLanguage('Português BR (Dublado e Legendado)');
      setFormFirmware('9.00 / 11.00');
      setFormCusaCode('CUSA-99999');
      setFormPrimaryLink('https://drive.google.com/file/d/sample');
      setFormAltLink('https://mega.nz/file/sample');
      setFormStatus('Active');
      setFormFeatured(false);
    }
    setPreviewTab('form');
    setIsGameModalOpen(true);
  };

  const handleAddScreenshot = () => {
    if (screenshotInput.trim()) {
      setFormScreenshots(prev => [...prev, screenshotInput.trim()]);
      setScreenshotInput('');
    }
  };

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const downloadLinks: DownloadLink[] = [
      { id: 'dl-p-' + Date.now(), label: 'Google Drive (Servidor Principal)', url: formPrimaryLink, type: 'Google Drive' }
    ];
    if (formAltLink.trim()) {
      downloadLinks.push({
        id: 'dl-a-' + Date.now(),
        label: 'MEGA.nz Mirror Alternativo',
        url: formAltLink,
        type: 'MEGA'
      });
    }

    // ===== LÓGICA CORRETA DO SLUG =====
    let slug: string;
    
    if (editingGame) {
      // EDITANDO: manter o slug original
      slug = editingGame.slug;
      
      // Se o título mudou, gerar novo slug
      if (editingGame.title !== formTitle.trim()) {
        const baseSlug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        let newSlug = baseSlug;
        let counter = 1;
        
        // Verificar se o novo slug já existe em OUTRO jogo (não no que está sendo editado)
        while (games.some(g => g.slug === newSlug && g.id !== editingGame.id)) {
          newSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        slug = newSlug;
      }
    } else {
      // ADICIONANDO: gerar slug único
      const baseSlug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let newSlug = baseSlug;
      let counter = 1;
      
      while (games.some(g => g.slug === newSlug)) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      slug = newSlug;
    }

    const gameData = {
      title: formTitle.trim(),
      slug: slug,
      coverUrl: formCoverUrl,
      bannerUrl: formBannerUrl || formCoverUrl,
      screenshots: formScreenshots,
      genres: formGenres,
      size: formSize,
      releaseDate: formReleaseDate,
      developer: formDeveloper,
      region: formRegion,
      language: formLanguage,
      firmware: formFirmware,
      cusaCode: formCusaCode,
      description: formDescription,
      downloadLinks,
      status: formStatus,
      featured: formFeatured,
      downloadsCount: editingGame?.downloadsCount || 0,
      rating: editingGame?.rating || 0,
      reviewCount: editingGame?.reviewCount || 0
    };

    try {
      setLoading(true);
      if (editingGame) {
        await updateGameInAPI(editingGame.id, gameData);
      } else {
        await addGameToAPI(gameData);
      }
      await refreshAdminData();
      onRefreshAll();
      setIsGameModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar jogo:', err);
      setError('Erro ao salvar o jogo no banco de dados. Verifique se o título já existe.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (id: string) => {
    console.log('🗑️ Tentando deletar jogo com ID:', id);
    
    if (!id) {
      console.error('❌ ID do jogo é inválido:', id);
      setError('ID do jogo inválido. Não é possível excluir.');
      return;
    }

    // Encontrar o jogo para mostrar o nome no confirm
    const gameToDelete = games.find(g => g.id === id || g._id === id);
    const gameName = gameToDelete?.title || 'este jogo';

    if (window.confirm(`Tem certeza que deseja excluir "${gameName}" da plataforma?`)) {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`📡 Enviando DELETE para: /api/games/${id}`);
        const response = await fetch(`${API_URL}/games/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('📡 Status da resposta:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
          throw new Error(errorData.message || `Erro ${response.status}`);
        }
        
        await refreshAdminData();
        onRefreshAll();
        console.log('✅ Jogo deletado com sucesso!');
        
      } catch (err) {
        console.error('❌ Erro ao deletar jogo:', err);
        setError(`Erro ao deletar o jogo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleGameStatus = async (game: Game) => {
    const updated = { ...game, status: game.status === 'Active' ? 'Inactive' as const : 'Active' as const };
    try {
      setLoading(true);
      await updateGameInAPI(game.id, updated);
      await refreshAdminData();
      onRefreshAll();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError('Erro ao atualizar o status.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserBan = (userId: string) => {
    StorageService.toggleUserBan(userId);
    refreshAdminData();
  };

  const handleResolveReport = (reportId: string) => {
    StorageService.updateReportStatus(reportId, 'Resolved');
    refreshAdminData();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSettings({
      adminUsername: newAdminUsername.trim() || 'manuelrepair2',
      adminEmail: newAdminEmail.trim() || 'manuelrepair2@gmail.com',
      adminPasswordHash: newAdminPassword || 'admin',
      adminPin: newAdminPin.trim() || '1978',
      siteTitle: newSiteTitle.trim() || 'PS4 GAMES VAULT',
      announcementText: newAnnouncementText.trim()
    });
    refreshAdminData();
    setSettingsSavedMsg('Configurações atualizadas com sucesso!');
    setTimeout(() => setSettingsSavedMsg(''), 3000);
  };

  // ===== CALCULAR MÉTRICAS =====
  const totalGames = games.length;
  const totalDownloads = games.reduce((sum, g) => sum + (g.downloadsCount || 0), 0);
  const totalUsers = users.length;
  const pendingReports = reports.filter(r => r.status === 'Pending').length;

  const filteredGames = games.filter(g => 
    g.title.toLowerCase().includes(gameSearch.toLowerCase()) || 
    (g.cusaCode && g.cusaCode.toLowerCase().includes(gameSearch.toLowerCase()))
  );

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // ===== TELA DE LOGIN =====
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
        <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <button onClick={onCloseAdmin} className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 mx-auto mb-3 shadow-lg shadow-blue-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-white">Painel Administrativo</h2>
            <p className="text-xs text-slate-400 mt-1">
              {loginStep === 'credentials' ? 'Etapa 1: Autenticação' : 'Etapa 2: PIN de Segurança'}
            </p>
          </div>
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs mb-4">
              {loginError}
            </div>
          )}
          {loginStep === 'credentials' ? (
            <form onSubmit={handleAdminCredentialsSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">E-mail ou Usuário do Admin</label>
                <input type="text" required placeholder="manuelrepair2@gmail.com" value={adminUserInput} onChange={(e) => setAdminUserInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Senha</label>
                <input type="password" required placeholder="admin" value={adminPassInput} onChange={(e) => setAdminPassInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2">
                <span>Avançar para o PIN</span> <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminPinSubmit} className="space-y-5">
              <div className="text-center">
                <label className="text-xs font-bold text-slate-200 block mb-2">Digite o PIN de 4 Dígitos</label>
                <input type="password" maxLength={4} pattern="[0-9]*" inputMode="numeric" autoFocus required placeholder="••••" value={adminPinInput} onChange={(e) => { const val = e.target.value.replace(/[^0-9]/g, ''); if (val.length <= 4) setAdminPinInput(val); }} className="w-full text-center bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg tracking-[0.5em] text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setLoginStep('credentials'); setLoginError(''); }} className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer">← Voltar</button>
                <button type="submit" disabled={adminPinInput.length !== 4} className="w-2/3 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-blue-600/25 transition-all cursor-pointer">Confirmar PIN</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ===== RENDER PRINCIPAL =====
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col md:flex-row overflow-hidden text-slate-100">
      
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-2xl flex flex-col items-center gap-4 border border-slate-800">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-bold text-white">Processando...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-red-500/90 text-white p-4 rounded-xl text-sm shadow-xl max-w-md">
          <div className="flex items-center justify-between gap-4">
            <span>❌ {error}</span>
            <button onClick={() => setError(null)} className="text-white hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-wider">Painel Admin</h1>
              <span className="text-[10px] text-emerald-400 font-mono">STATUS: ONLINE</span>
            </div>
          </div>
          <button onClick={onCloseAdmin} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white" title="Sair do modo Admin">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 flex-1">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('games')} className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'games' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
            <div className="flex items-center gap-2.5"><Gamepad2 className="w-4 h-4" /> Jogos</div>
            <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-full">{totalGames}</span>
          </button>
          <button onClick={() => setActiveTab('users')} className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
            <div className="flex items-center gap-2.5"><Users className="w-4 h-4" /> Usuários</div>
            <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-full">{totalUsers}</span>
          </button>
          <button onClick={() => setActiveTab('reports')} className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'reports' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
            <div className="flex items-center gap-2.5"><AlertTriangle className="w-4 h-4" /> Denúncias</div>
            {pendingReports > 0 && <span className="text-[10px] bg-red-500 text-white font-black px-2 py-0.5 rounded-full animate-pulse">{pendingReports}</span>}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
            <Settings className="w-4 h-4" /> Configurações
          </button>
        </nav>

        <div className="hidden md:block pt-4 border-t border-slate-800">
          <button onClick={onCloseAdmin} className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" /> Voltar ao Site
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Estatísticas Gerais</h2>
                <p className="text-xs text-slate-400">Resumo em tempo real de acessos, jogos e downloads</p>
              </div>
              <button onClick={() => openGameModal()} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer">
                <Plus className="w-4 h-4" /> Adicionar Jogo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Total de Jogos</span>
                  <strong className="text-2xl font-black text-white">{totalGames}</strong>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Total de Downloads</span>
                  <strong className="text-2xl font-black text-white">{totalDownloads.toLocaleString()}</strong>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-600/20 text-purple-400 rounded-2xl border border-purple-500/30">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Usuários</span>
                  <strong className="text-2xl font-black text-white">{totalUsers}</strong>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 bg-amber-600/20 text-amber-400 rounded-2xl border border-amber-500/30">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Denúncias</span>
                  <strong className="text-2xl font-black text-amber-400">{pendingReports}</strong>
                </div>
              </div>
            </div>

            {/* Top Games */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Jogos Mais Populares
              </h3>
              <div className="space-y-3">
                {games.slice(0, 5).map((g) => (
                  <div key={g.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <img src={g.coverUrl} alt={g.title} className="w-10 h-12 object-cover rounded-lg" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{g.title}</h4>
                        <span className="text-[10px] text-blue-400">{g.genres?.join(', ')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <strong className="text-xs font-bold text-emerald-400">{g.downloadsCount?.toLocaleString()}</strong>
                      <span className="text-[10px] text-slate-500 block">downloads</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GAMES TAB */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">Gerenciar Jogos ({games.length})</h2>
                <p className="text-xs text-slate-400">Adicione, edite ou altere o status dos jogos PS4</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Buscar jogo..." value={gameSearch} onChange={(e) => setGameSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
                <button onClick={() => openGameModal()} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer shrink-0">
                  <Plus className="w-4 h-4" /> Novo Jogo
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-extrabold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Jogo</th>
                      <th className="p-3.5">Gêneros</th>
                      <th className="p-3.5">Tamanho</th>
                      <th className="p-3.5">Downloads</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredGames.map((game) => (
                      <tr key={game.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <img src={game.coverUrl} alt={game.title} className="w-9 h-12 object-cover rounded-md border border-slate-800" />
                          <div>
                            <strong className="text-slate-100 font-bold block">{game.title}</strong>
                            <span className="text-[10px] text-slate-500 font-mono">{game.cusaCode}</span>
                          </div>
                        </td>
                        <td className="p-3"><span className="text-blue-400">{game.genres?.slice(0, 2).join(', ')}</span></td>
                        <td className="p-3"><span className="text-emerald-400 font-bold">{game.size}</span></td>
                        <td className="p-3"><strong className="text-slate-200">{game.downloadsCount?.toLocaleString()}</strong></td>
                        <td className="p-3">
                          <button onClick={() => handleToggleGameStatus(game)} className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer transition-colors ${game.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                            {game.status === 'Active' ? '● Ativo' : '○ Inativo'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => openGameModal(game)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors" title="Editar">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteGame(game.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Excluir">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Usuários Cadastrados ({users.length})</h2>
                <p className="text-xs text-slate-400">Gerencie contas de usuários e status de suspensão</p>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" placeholder="Buscar usuário..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Usuário</th>
                    <th className="p-3.5">E-mail</th>
                    <th className="p-3.5">Função</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/50">
                      <td className="p-3 flex items-center gap-3">
                        <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                        <span className="font-bold text-slate-100">{user.username}</span>
                      </td>
                      <td className="p-3 text-slate-400">{user.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {user.status === 'Active' ? 'Ativo' : 'Banido'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {user.role !== 'admin' && (
                          <button onClick={() => handleToggleUserBan(user.id)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${user.status === 'Active' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                            {user.status === 'Active' ? 'Banir' : 'Reativar'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white">Denúncias de Links Quebrados</h2>
              <p className="text-xs text-slate-400">Verifique avisos enviados pelos usuários sobre mirrors indisponíveis</p>
            </div>
            <div className="space-y-3">
              {reports.length === 0 ? (
                <p className="text-xs text-slate-500 py-10 text-center">Nenhuma denúncia no sistema.</p>
              ) : (
                reports.map((rep) => (
                  <div key={rep.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{rep.gameTitle}</span>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${rep.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {rep.status === 'Pending' ? 'Pendente' : 'Resolvido'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2 rounded border border-slate-800/80 mb-1">
                        URL Reportada: {rep.linkUrl}
                      </p>
                      <p className="text-xs text-slate-400">Motivo: "{rep.reason}"</p>
                    </div>
                    {rep.status === 'Pending' && (
                      <button onClick={() => handleResolveReport(rep.id)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer shrink-0">
                        Marcar como Resolvido
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white">Configurações Gerais do Site</h2>
              <p className="text-xs text-slate-400">Altere credenciais de administrador e avisos globais</p>
            </div>
            {settingsSavedMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {settingsSavedMsg}
              </div>
            )}
            <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider mb-2">Credenciais de Acesso do Admin</h3>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">E-mail Autorizado do Admin</label>
                <input type="email" required value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Usuário de Admin</label>
                <input type="text" required value={newAdminUsername} onChange={(e) => setNewAdminUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nova Senha de Admin</label>
                <input type="password" required value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">PIN de Segurança de 4 Dígitos</label>
                <input type="password" required maxLength={4} pattern="[0-9]*" inputMode="numeric" value={newAdminPin} onChange={(e) => setNewAdminPin(e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-cyan-400 font-mono font-bold focus:outline-none focus:border-blue-500 tracking-[0.3em]" />
              </div>
              <hr className="border-slate-800 my-4" />
              <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider mb-2">Informações do Site</h3>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nome / Título do Site</label>
                <input type="text" required value={newSiteTitle} onChange={(e) => setNewSiteTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Texto do Banner de Anúncio Superior</label>
                <textarea rows={2} value={newAnnouncementText} onChange={(e) => setNewAnnouncementText(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer">
                <Save className="w-4 h-4" /> Salvar Configurações
              </button>
            </form>
          </div>
        )}
      </main>

      {/* GAME ADD / EDIT MODAL */}
      {isGameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] flex flex-col my-auto">
            <button onClick={() => setIsGameModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-lg font-black text-white">{editingGame ? 'Editar Jogo' : 'Adicionar Novo Jogo'}</h3>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button type="button" onClick={() => setPreviewTab('form')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${previewTab === 'form' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Formulário</button>
                <button type="button" onClick={() => setPreviewTab('preview')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${previewTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Preview</button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 pr-1 scrollbar-thin">
              {previewTab === 'form' ? (
                <form onSubmit={handleSaveGame} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Nome do Jogo *</label>
                      <input type="text" required placeholder="Ex: Spider-Man 2 PS4" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Código CUSA *</label>
                      <input type="text" required placeholder="CUSA-12345" value={formCusaCode} onChange={(e) => setFormCusaCode(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">URL Imagem da Capa *</label>
                      <input type="text" required value={formCoverUrl} onChange={(e) => setFormCoverUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">URL Imagem de Banner</label>
                      <input type="text" value={formBannerUrl} onChange={(e) => setFormBannerUrl(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Gêneros:</label>
                    <div className="flex flex-wrap gap-2">
                      {['Ação', 'Aventura', 'RPG', 'Esportes', 'Corrida', 'Luta', 'Terror', 'Mundo Aberto'].map((g) => {
                        const isSel = formGenres.includes(g);
                        return (
                          <button key={g} type="button" onClick={() => { if (isSel) { setFormGenres(formGenres.filter(item => item !== g)); } else { setFormGenres([...formGenres, g]); } }} className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${isSel ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}>
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Descrição *</label>
                    <textarea required rows={3} value={formDescription} onChange={(e) => setFormDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div><label className="text-xs font-bold text-slate-300 block mb-1">Tamanho *</label><input type="text" required value={formSize} onChange={(e) => setFormSize(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100" /></div>
                    <div><label className="text-xs font-bold text-slate-300 block mb-1">Firmware *</label><input type="text" required value={formFirmware} onChange={(e) => setFormFirmware(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100" /></div>
                    <div><label className="text-xs font-bold text-slate-300 block mb-1">Região</label><input type="text" value={formRegion} onChange={(e) => setFormRegion(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100" /></div>
                    <div><label className="text-xs font-bold text-slate-300 block mb-1">Data Lançamento</label><input type="date" value={formReleaseDate} onChange={(e) => setFormReleaseDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100" /></div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Idioma</label>
                    <input type="text" value={formLanguage} onChange={(e) => setFormLanguage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold text-slate-300 block mb-1">Link de Download para PC</label><input type="url" required value={formPrimaryLink} onChange={(e) => setFormPrimaryLink(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100" /></div>
                    <div><label className="text-xs font-bold text-slate-300 block mb-1">Link de download  para PS4</label><input type="text" value={formAltLink} onChange={(e) => setFormAltLink(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100" /></div>
                  </div>
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                      <input type="checkbox" checked={formStatus === 'Active'} onChange={(e) => setFormStatus(e.target.checked ? 'Active' : 'Inactive')} className="w-4 h-4 rounded accent-blue-600" /> Publicar ativo
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-400">
                      <input type="checkbox" checked={formFeatured} onChange={(e) => setFormFeatured(e.target.checked)} className="w-4 h-4 rounded accent-amber-500" /> Destacar no Carrossel
                    </label>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg transition-all cursor-pointer mt-4">Salvar Jogo</button>
                </form>
              ) : (
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex gap-4">
                    <img src={formCoverUrl} alt="Preview" className="w-24 h-32 object-cover rounded-xl border border-slate-800" />
                    <div>
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded">{formGenres.join(', ')}</span>
                      <h3 className="text-lg font-bold text-white mt-1">{formTitle || 'Título do Jogo'}</h3>
                      <span className="text-xs text-emerald-400 font-bold block">{formSize}</span>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{formDescription}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <strong>Link do Google Drive:</strong> {formPrimaryLink}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};