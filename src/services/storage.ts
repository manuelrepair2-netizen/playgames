import { INITIAL_COMMENTS, INITIAL_NOTIFICATIONS, INITIAL_REPORTS, INITIAL_SETTINGS, INITIAL_USERS } from '../data/initialData';
import { INITIAL_GAMES } from '../data/initialGames';
import { Category, Comment, Game, Report, SiteNotification, SiteSettings, User } from '../types';

const STORAGE_KEYS = {
  GAMES: 'ps4_vault_games',
  USERS: 'ps4_vault_users',
  COMMENTS: 'ps4_vault_comments',
  REPORTS: 'ps4_vault_reports',
  NOTIFICATIONS: 'ps4_vault_notifications',
  SETTINGS: 'ps4_vault_settings',
  CURRENT_USER: 'ps4_vault_current_user',
  THEME: 'ps4_vault_theme'
};

export const EVENT_STATE_CHANGED = 'ps4_vault_state_changed';

export function notifyStateChanged() {
  window.dispatchEvent(new CustomEvent(EVENT_STATE_CHANGED));
}

export const StorageService = {
  // Initialization
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.GAMES)) {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(INITIAL_GAMES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    }
  },

  // Games
  getGames(): Game[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAMES);
      return data ? JSON.parse(data) : INITIAL_GAMES;
    } catch {
      return INITIAL_GAMES;
    }
  },

  getGameById(id: string): Game | undefined {
    return this.getGames().find(g => g.id === id || g.slug === id);
  },

  saveGames(games: Game[]) {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
    notifyStateChanged();
  },

  addGame(newGame: Omit<Game, 'id' | 'createdAt' | 'rating' | 'ratingCount' | 'downloadsCount'>): Game {
    const games = this.getGames();
    const game: Game = {
      ...newGame,
      id: 'game-' + Date.now(),
      rating: 5.0,
      ratingCount: 1,
      downloadsCount: 0,
      createdAt: new Date().toISOString()
    };
    games.unshift(game);
    this.saveGames(games);

    // Add notification
    this.addNotification({
      title: 'Novo Jogo Adicionado!',
      message: `${game.title} acabou de ser publicado na plataforma!`,
      type: 'new_game'
    });

    return game;
  },

  updateGame(updated: Game) {
    const games = this.getGames();
    const index = games.findIndex(g => g.id === updated.id);
    if (index !== -1) {
      games[index] = updated;
      this.saveGames(games);
    }
  },

  deleteGame(id: string) {
    const games = this.getGames().filter(g => g.id !== id);
    this.saveGames(games);
  },

  incrementDownloads(gameId: string, linkType: string) {
    const games = this.getGames();
    const game = games.find(g => g.id === gameId);
    if (game) {
      game.downloadsCount += 1;
      this.saveGames(games);

      // Record in current user's history if logged in
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        this.addDownloadToHistory(currentUser.id, game.id, game.title, linkType);
      }
    }
  },

  rateGame(gameId: string, userRating: number) {
    const games = this.getGames();
    const game = games.find(g => g.id === gameId);
    if (game) {
      const totalScore = game.rating * game.ratingCount + userRating;
      game.ratingCount += 1;
      game.rating = Number((totalScore / game.ratingCount).toFixed(1));
      this.saveGames(games);
    }
  },

  // Users
  getUsers(): User[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    notifyStateChanged();
  },

  getCurrentUser(): User | null {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    notifyStateChanged();
  },

  registerUser(username: string, email: string): User {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      throw new Error('Usuário ou e-mail já cadastrado.');
    }

    const isAdmin = email.toLowerCase() === 'manuelrepair2@gmail.com' || username.toLowerCase() === 'manuelrepair2';

    const newUser: User = {
      id: 'user-' + Date.now(),
      username,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      role: isAdmin ? 'admin' : 'user',
      status: 'Active',
      downloadHistory: [],
      favorites: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);
    return newUser;
  },

  loginUser(emailOrUsername: string): User {
    const users = this.getUsers();
    const lower = emailOrUsername.toLowerCase();
    
    // Check admin email or username
    if (lower === 'manuelrepair2@gmail.com' || lower === 'manuelrepair2' || lower === 'admin' || lower === 'admin@ps4gamesvault.com') {
      const adminUser = users.find(u => u.role === 'admin' || u.email.toLowerCase() === 'manuelrepair2@gmail.com') || INITIAL_USERS[0];
      this.setCurrentUser(adminUser);
      return adminUser;
    }

    const found = users.find(u => u.email.toLowerCase() === lower || u.username.toLowerCase() === lower);
    if (!found) {
      throw new Error('Usuário não encontrado. Registre-se primeiro.');
    }
    if (found.status === 'Banned') {
      throw new Error('Sua conta foi suspensa temporariamente. Entre em contato com a administração.');
    }

    this.setCurrentUser(found);
    return found;
  },

  toggleUserBan(userId: string) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user && user.role !== 'admin') {
      user.status = user.status === 'Active' ? 'Banned' : 'Active';
      this.saveUsers(users);
    }
  },

  toggleFavorite(gameId: string) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) return false;

    const favorites = users[userIndex].favorites || [];
    const exists = favorites.includes(gameId);

    if (exists) {
      users[userIndex].favorites = favorites.filter(id => id !== gameId);
    } else {
      users[userIndex].favorites = [...favorites, gameId];
    }

    this.saveUsers(users);
    const updatedUser = users[userIndex];
    this.setCurrentUser(updatedUser);
    return !exists;
  },

  addDownloadToHistory(userId: string, gameId: string, gameTitle: string, linkType: string) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      if (!user.downloadHistory) user.downloadHistory = [];
      user.downloadHistory.unshift({
        gameId,
        gameTitle,
        downloadedAt: new Date().toISOString(),
        linkType
      });
      this.saveUsers(users);
      this.setCurrentUser(user);
    }
  },

  // Comments
  getComments(gameId?: string): Comment[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      const comments: Comment[] = data ? JSON.parse(data) : INITIAL_COMMENTS;
      return gameId ? comments.filter(c => c.gameId === gameId) : comments;
    } catch {
      return INITIAL_COMMENTS;
    }
  },

  addComment(gameId: string, rating: number, text: string): Comment {
    const currentUser = this.getCurrentUser();
    const userName = currentUser ? currentUser.username : 'Visitante PlayStation';
    const userId = currentUser ? currentUser.id : 'guest-' + Date.now();
    const userAvatar = currentUser ? currentUser.avatarUrl : 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest';

    const comments = this.getComments();
    const newComment: Comment = {
      id: 'comm-' + Date.now(),
      gameId,
      userId,
      userName,
      userAvatar,
      rating,
      text,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    comments.unshift(newComment);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));

    // Update game rating
    this.rateGame(gameId, rating);
    notifyStateChanged();
    return newComment;
  },

  likeComment(commentId: string) {
    const comments = this.getComments();
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      comment.likes += 1;
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
      notifyStateChanged();
    }
  },

  deleteComment(commentId: string) {
    const comments = this.getComments().filter(c => c.id !== commentId);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    notifyStateChanged();
  },

  // Reports
  getReports(): Report[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return data ? JSON.parse(data) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  },

  addReport(gameId: string, gameTitle: string, linkUrl: string, reason: string, userEmail?: string): Report {
    const reports = this.getReports();
    const newReport: Report = {
      id: 'rep-' + Date.now(),
      gameId,
      gameTitle,
      linkUrl,
      reason,
      userEmail,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    notifyStateChanged();
    return newReport;
  },

  updateReportStatus(reportId: string, status: 'Pending' | 'Resolved' | 'Dismissed') {
    const reports = this.getReports();
    const report = reports.find(r => r.id === reportId);
    if (report) {
      report.status = status;
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

      if (status === 'Resolved') {
        this.addNotification({
          title: 'Link Corrigido!',
          message: `O link reportado para ${report.gameTitle} foi resolvido pela equipe.`,
          type: 'link_fixed'
        });
      }
      notifyStateChanged();
    }
  },

  // Notifications
  getNotifications(): SiteNotification[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  addNotification(notif: Omit<SiteNotification, 'id' | 'date' | 'read'>) {
    const list = this.getNotifications();
    const newNotif: SiteNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      date: new Date().toISOString(),
      read: false
    };
    list.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    notifyStateChanged();
  },

  markAllNotificationsRead() {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    notifyStateChanged();
  },

  // Settings
  getSettings(): SiteSettings {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  updateSettings(newSettings: Partial<SiteSettings>) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    notifyStateChanged();
  },

  // Theme
  getTheme(): 'dark' | 'light' {
    this.init();
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light') || 'dark';
  },

  setTheme(theme: 'dark' | 'light') {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    notifyStateChanged();
  }
};
