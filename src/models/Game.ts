import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  coverUrl: { type: String, default: '' },
  bannerUrl: { type: String, default: '' },
  screenshots: { type: [String], default: [] },
  genres: { type: [String], default: [] },
  size: { type: String, default: '' },
  releaseDate: { type: String, default: '' },
  developer: { type: String, default: '' },
  region: { type: String, default: 'GLOBAL' },
  language: { type: String, default: '' },
  firmware: { type: String, default: '' },
  cusaCode: { type: String, default: '' },
  description: { type: String, default: '' },
  downloadLinks: { type: [Object], default: [] },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  featured: { type: Boolean, default: false },
  downloadsCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Game = mongoose.model('Game', GameSchema);