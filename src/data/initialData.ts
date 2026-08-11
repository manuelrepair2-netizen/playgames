import { Category, Comment, Report, SiteNotification, SiteSettings, User } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Todos', slug: 'todos', iconName: 'Gamepad2', description: 'Todos os jogos de PS4' },
  { id: 'cat-2', name: 'Ação', slug: 'acao', iconName: 'Swords', description: 'Jogos de combate e adrenalina' },
  { id: 'cat-3', name: 'Aventura', slug: 'aventura', iconName: 'Compass', description: 'Exploração e histórias envolventes' },
  { id: 'cat-4', name: 'RPG', slug: 'rpg', iconName: 'Shield', description: 'Role-Playing Games e evolução de personagens' },
  { id: 'cat-5', name: 'Esportes', slug: 'esportes', iconName: 'Trophy', description: 'Futebol, basquete e outros esportes' },
  { id: 'cat-6', name: 'Corrida', slug: 'corrida', iconName: 'Car', description: 'Simulação e arcade de velocidade' },
  { id: 'cat-7', name: 'Luta', slug: 'luta', iconName: 'Zap', description: 'Combate individual e artes marciais' },
  { id: 'cat-8', name: 'Terror', slug: 'terror', iconName: 'Ghost', description: 'Survival horror e suspense' },
  { id: 'cat-9', name: 'Mundo Aberto', slug: 'mundo-aberto', iconName: 'Globe', description: 'Mapas vastos e liberdade total' }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    username: 'manuelrepair2',
    email: 'manuelrepair2@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'admin',
    status: 'Active',
    downloadHistory: [
      { gameId: 'game-1', gameTitle: 'God of War Ragnarök', downloadedAt: '2026-02-10T11:00:00Z', linkType: 'Google Drive' },
      { gameId: 'game-5', gameTitle: 'Red Dead Redemption 2', downloadedAt: '2026-02-09T18:20:00Z', linkType: 'Torrent' }
    ],
    favorites: ['game-1', 'game-3', 'game-5'],
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    username: 'GamerPro_BR',
    email: 'gamerpro@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    role: 'user',
    status: 'Active',
    downloadHistory: [
      { gameId: 'game-2', gameTitle: 'The Last of Us Part II', downloadedAt: '2026-02-08T15:10:00Z', linkType: 'MEGA' }
    ],
    favorites: ['game-2', 'game-10'],
    createdAt: '2026-01-15T12:00:00Z'
  },
  {
    id: 'user-3',
    username: 'LucasPlayStation',
    email: 'lucas.play@hotmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80',
    role: 'user',
    status: 'Active',
    downloadHistory: [
      { gameId: 'game-8', gameTitle: 'EA SPORTS FC 24 (FIFA 24)', downloadedAt: '2026-02-10T09:30:00Z', linkType: 'Google Drive' }
    ],
    favorites: ['game-8', 'game-11'],
    createdAt: '2026-01-20T08:00:00Z'
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    gameId: 'game-1',
    userId: 'user-2',
    userName: 'GamerPro_BR',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'Jogo incrível! O arquivo no Google Drive baixou super rápido na minha conexão de 500MB. Rodando perfeito na versão 9.00 com GoldHEN.',
    createdAt: '2026-02-10T12:30:00Z',
    likes: 24
  },
  {
    id: 'comm-2',
    gameId: 'game-1',
    userId: 'user-3',
    userName: 'LucasPlayStation',
    userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'A dublagem em Português BR está impecável. Valeu demais por disponibilizarem no servidor direto!',
    createdAt: '2026-02-10T14:15:00Z',
    likes: 18
  },
  {
    id: 'comm-3',
    gameId: 'game-5',
    userId: 'user-2',
    userName: 'GamerPro_BR',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    text: 'Obra-prima sem igual. Instalação do PKG dividida deu tudo certo.',
    createdAt: '2026-02-09T19:00:00Z',
    likes: 31
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-1',
    gameId: 'game-4',
    gameTitle: 'Spider-Man: Miles Morales',
    linkUrl: 'https://1fichier.com/?spidermanmiles',
    reason: 'Link do 1Fichier acusando servidor em manutenção temporária.',
    userEmail: 'visitante@gmail.com',
    status: 'Pending',
    createdAt: '2026-02-09T16:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: SiteNotification[] = [
  {
    id: 'notif-1',
    title: 'Novo Jogo Adicionado!',
    message: 'Tekken 8 já está disponível para download na versão PS4!',
    date: '2026-02-07T11:00:00Z',
    type: 'new_game',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Link Atualizado',
    message: 'Servidor Google Drive de God of War Ragnarök foi renovado com velocidade máxima.',
    date: '2026-02-08T15:00:00Z',
    type: 'link_fixed',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Manutenção de Servidores',
    message: 'Todos os links em MEGA e Google Drive estão 100% operacionais.',
    date: '2026-02-10T08:00:00Z',
    type: 'system',
    read: true
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteTitle: 'PS4 GAMES VAULT',
  siteDescription: 'A maior biblioteca de jogos de PlayStation 4 para download rápido, direto e seguro.',
  announcementText: '🔥 NOVIDADE: God of War Ragnarök e EA Sports FC 24 atualizados com servidores no Google Drive!',
  announcementActive: true,
  adminUsername: 'manuelrepair2',
  adminEmail: 'manuelrepair2@gmail.com',
  adminPasswordHash: 'admin', // simple direct comparison
  adminPin: '1978',
  maintenanceMode: false,
  featuredGamesLimit: 5,
  downloadsRequiredLogin: false
};
