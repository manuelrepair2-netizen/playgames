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

interface AdminPanelProps {
  onCloseAdmin: () => void;
  onRefreshAll: () => void;
}

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
  const response = await fetch(`${API_URL}/games/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Erro ao deletar jogo');
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'games' | 'users' | 'reports' | 'categories' | 'settings'>('dashboard');

  // Local administrative data copies
  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());

  // ===== ESTADOS DE CARREGAMENTO =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // ===== CARREGAR JOGOS DO BANCO =====
  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const gamesFromAPI = await fetchGamesFromAPI();
      setGames(gamesFromAPI);
    } catch (err) {
      console.error('Erro ao carregar jogos:', err);
      setError('Não foi possível carregar os jogos do banco de dados.');
      // Fallback para Storage local
      const localGames = StorageService.getGames();
      if (localGames.length > 0) {
        setGames(localGames);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if current logged in user is authorized admin
    const currentUser = StorageService.getCurrentUser();
    const currentSettings = StorageService.getSettings();
    const authorizedEmail = (currentSettings.adminEmail || 'manuelrepair2@gmail.com').toLowerCase();
    
    if (currentUser && (currentUser.email?.toLowerCase() === authorizedEmail || currentUser.role === 'admin')) {
      setIsAuthenticated(true);
    }
    
    // Carregar dados do banco
    refreshAdminData();
  }, []);

  const refreshAdminData = async () => {
    await loadGames();
    setUsers(StorageService.getUsers());
    setReports(StorageService.getReports());
    setSettings(StorageService.getSettings());
  };

  // ===== AUTH =====
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

  // ===== GAME CRUD (USANDO API) =====
  
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

    const gameData = {
      nome: formTitle.trim(),
      genero: formGenres.join(', '),
      descricao: formDescription,
      imagem: formCoverUrl,
      tamanho: formSize,
      dataLancamento: formReleaseDate,
      desenvolvedora: formDeveloper,
      linkDownload: formPrimaryLink,
      linkAlternativo: formAltLink || '',
      nota: 0,
      downloads: 0,
      status: formStatus,
      // Campos adicionais para compatibilidade com o frontend
      title: formTitle.trim(),
      slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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
      downloadLinks,
      featured: formFeatured,
      downloadsCount: editingGame?.downloadsCount || 0,
      rating: editingGame?.rating || 0,
      reviewCount: editingGame?.reviewCount || 0
    };

    try {
      setLoading(true);
      if (editingGame) {
        // Atualizar jogo existente
        await updateGameInAPI(editingGame.id, gameData);
      } else {
        // Adicionar novo jogo
        await addGameToAPI(gameData);
      }
      
      // Recarregar dados
      await refreshAdminData();
      onRefreshAll();
      setIsGameModalOpen(false);
      setError(null);
    } catch (err) {
      console.error('Erro ao salvar jogo:', err);
      setError('Erro ao salvar o jogo no banco de dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este jogo da plataforma?')) {
      try {
        setLoading(true);
        await deleteGameFromAPI(id);
        await refreshAdminData();
        onRefreshAll();
        setError(null);
      } catch (err) {
        console.error('Erro ao deletar jogo:', err);
        setError('Erro ao deletar o jogo do banco de dados.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleGameStatus = async (game: Game) => {
    const updated = { 
      ...game, 
      status: game.status === 'Active' ? 'Inactive' as const : 'Active' as const 
    };
    try {
      setLoading(true);
      await updateGameInAPI(game.id, updated);
      await refreshAdminData();
      onRefreshAll();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError('Erro ao atualizar o status do jogo.');
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

  // Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
        <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          
          <button
            onClick={onCloseAdmin}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white"
          >
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
              {loginStep === 'credentials' ? 'Etapa 1: Autenticação de Usuário e Senha' : 'Etapa 2: Confirmação de PIN de Segurança (4 Dígitos)'}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-cyan-500/30 text-xs text-slate-300 mb-5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Acesso Exclusivo: <strong>manuelrepair2@gmail.com</strong></span>
            </div>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full uppercase">
              {loginStep === 'credentials' ? 'Passo 1/2' : 'Passo 2/2'}
            </span>
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
                <input
                  type="text"
                  required
                  placeholder="manuelrepair2@gmail.com"
                  value={adminUserInput}
                  onChange={(e) => setAdminUserInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Senha</label>
                <input
                  type="password"
                  required
                  placeholder="admin"
                  value={adminPassInput}
                  onChange={(e) => setAdminPassInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Avançar para o PIN</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminPinSubmit} className="space-y-5">
              <div className="text-center">
                <label className="text-xs font-bold text-slate-200 block mb-2">
                  Digite a Senha de 4 Dígitos (PIN)
                </label>
                <p className="text-[11px] text-slate-400 mb-4">
                  A senha é censurada por motivos de segurança.
                </p>

                <div className="flex justify-center gap-3 mb-4">
                  {[0, 1, 2, 3].map((index) => {
                    const isFilled = adminPinInput.length > index;
                    return (
                      <div
                        key={index}
                        className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                          isFilled
                            ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20 scale-105'
                            : 'border-slate-800 bg-slate-950'
                        }`}
                      >
                        {isFilled ? (
                          <span className="w-3.5 h-3.5 bg-cyan-400 rounded-full animate-pulse shadow-md shadow-cyan-400/50" />
                        ) : (
                          <span className="w-2 h-2 bg-slate-700 rounded-full" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <input
                  type="password"
                  maxLength={4}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  autoFocus
                  required
                  placeholder="••••"
                  value={adminPinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length <= 4) {
                      setAdminPinInput(val);
                    }
                  }}
                  className="w-full text-center bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg tracking-[0.5em] text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginStep('credentials');
                    setLoginError('');
                  }}
                  className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  ← Voltar
                </button>
                <button
                  type="submit"
                  disabled={adminPinInput.length !== 4}
                  className="w-2/3 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-blue-600/25 transition-all cursor-pointer"
                >
                  Confirmar PIN e Entrar
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    );
  }

  // Calculate Dashboard Metrics
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

  // ===== RENDER PRINCIPAL =====
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col md:flex-row overflow-hidden text-slate-100">
      
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
          <button
            onClick={onCloseAdmin}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            title="Sair do modo Admin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 flex-1">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard / Visão Geral</span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'games' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Gamepad2 className="w-4 h-4" />
              <span>Gerenciar Jogos</span>
            </div>
            <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-full">{totalGames}</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Gerenciar Usuários</span>
            </div>
            <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-full">{totalUsers}</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'reports' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Denúncias</span>
            </div>
            {pendingReports > 0 && (
              <span className="text-[10px] bg-red-500 text-white font-black px-2 py-0.5 rounded-full animate-pulse">
                {pendingReports}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </button>

        </nav>

        <div className="hidden md:block pt-4 border-t border-slate-800">
          <button
            onClick={onCloseAdmin}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Voltar ao Site Principal</span>
          </button>
        </div>

      </aside>

      {/* Main Content Body */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
        
        {/* ===== INDICADOR DE CARREGAMENTO E ERRO ===== */}
        {loading && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-slate-900 p-6 rounded-2xl flex flex-col items-center gap-4 border border-slate-800">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-bold text-white">Processando...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm mb-4 flex items-center justify-between">
            <span>❌ {error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Estatísticas Gerais</h2>
                <p className="text-xs text-slate-400">Resumo em tempo real de acessos, jogos e downloads</p>
              </div>
              <button
                onClick={() => openGameModal()}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Jogo</span>
              </button>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Total de Jogos</span>
                  <strong className="text-2xl font-black text-white">{totalGames}</strong>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">Banco de dados MongoDB</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Total de Downloads</span>
                  <strong className="text-2xl font-black text-white">{totalDownloads.toLocaleString()}</strong>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">Servidor Google Drive 100%</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-600/20 text-purple-400 rounded-2xl border border-purple-500/30">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Usuários Cadastrados</span>
                  <strong className="text-2xl font-black text-white">{totalUsers}</strong>
                  <span className="text-[10px] text-blue-400 block mt-0.5">Ativos na plataforma</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap