import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  genero: { type: String, required: true },
  descricao: { type: String },
  imagem: { type: String },
  tamanho: { type: String },
  dataLancamento: { type: String },
  desenvolvedora: { type: String },
  linkDownload: { type: String },
  nota: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  status: { type: String, default: 'Ativo' },
  criadoEm: { type: Date, default: Date.now },
});

export const Game = mongoose.model('Game', GameSchema);