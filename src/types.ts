export interface DownloadLink {
  id: string;
  label: string;
  url: string;
  type: 'Google Drive' | 'MEGA' | '1Fichier' | 'Torrent' | 'MediaFire' | 'Direto';
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  coverUrl: string;
  bannerUrl: string;
  screenshots: string[];
  genres: string[];
  rating: number; // 0 to 5
  ratingCount: number;
  downloadsCount: number;
  size: string;
  releaseDate: string; // YYYY-MM-DD
  developer: string;
  region: string; // e.g., "USA", "EUR", "GLOBAL", "BR"
  language: string; // e.g., "Português BR (Dublado e Legendado)"
  firmware: string; // e.g., "9.00 / 11.00"
  cusaCode: string; // e.g., "CUSA-12345"
  description: string;
  downloadLinks: DownloadLink[];
  status: 'Active' | 'Inactive';
  featured: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  description?: string;
  gameCount?: number;
}

export interface UserDownloadHistory {
  gameId: string;
  gameTitle: string;
  downloadedAt: string;
  linkType: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: 'user' | 'admin';
  status: 'Active' | 'Banned';
  downloadHistory: UserDownloadHistory[];
  favorites: string[]; // array of game IDs
  createdAt: string;
}

export interface Comment {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1 to 5
  text: string;
  createdAt: string;
  likes: number;
}

export interface Report {
  id: string;
  gameId: string;
  gameTitle: string;
  linkUrl: string;
  reason: string;
  userEmail?: string;
  status: 'Pending' | 'Resolved' | 'Dismissed';
  createdAt: string;
}

export interface SiteNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'new_game' | 'update' | 'system' | 'link_fixed';
  read: boolean;
}

export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  announcementText: string;
  announcementActive: boolean;
  adminUsername: string;
  adminEmail?: string;
  adminPasswordHash: string;
  adminPin?: string;
  maintenanceMode: boolean;
  featuredGamesLimit: number;
  downloadsRequiredLogin: boolean;
}

export interface SiteStats {
  totalGames: number;
  totalDownloads: number;
  totalUsers: number;
  newGamesThisWeek: number;
  downloadsByGenre: { [genre: string]: number };
  dailyDownloadsHistory: { date: string; count: number }[];
}
