import express from "express";
import path from "path";
import mongoose from 'mongoose';
import { Game } from './src/models/Game';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ===== CONEXÃO AO MONGODB =====
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI não definida!');
  process.exit(1);
}

console.log('📡 Conectando ao MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB!'))
  .catch((err) => {
    console.error('❌ Erro ao conectar:', err.message);
    process.exit(1);
  });

// ===== ROTAS DA API =====

// Buscar todos os jogos
app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.json({ status: 'success', data: games });
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    res.status(500).json({ status: 'error', message: 'Erro ao buscar jogos' });
  }
});

// Adicionar novo jogo
app.post('/api/games', async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.json({ status: 'success', data: game });
  } catch (error) {
    console.error('Erro ao adicionar jogo:', error);
    res.status(500).json({ status: 'error', message: 'Erro ao adicionar jogo' });
  }
});

// Atualizar jogo
app.put('/api/games/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) {
      return res.status(404).json({ status: 'error', message: 'Jogo não encontrado' });
    }
    res.json({ status: 'success', data: game });
  } catch (error) {
    console.error('Erro ao atualizar jogo:', error);
    res.status(500).json({ status: 'error', message: 'Erro ao atualizar jogo' });
  }
});

// Deletar jogo
app.delete('/api/games/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ status: 'error', message: 'Jogo não encontrado' });
    }
    res.json({ status: 'success', message: 'Jogo deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar jogo:', error);
    res.status(500).json({ status: 'error', message: 'Erro ao deletar jogo' });
  }
});

// Estatísticas
app.get('/api/stats', async (req, res) => {
  try {
    const totalGames = await Game.countDocuments();
    const totalDownloads = await Game.aggregate([
      { $group: { _id: null, total: { $sum: '$downloadsCount' } } }
    ]);
    res.json({
      status: 'success',
      totalGames,
      totalDownloads: totalDownloads[0]?.total || 0,
      totalUsers: 1480,
      newGamesThisWeek: 3
    });
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    res.status(500).json({ status: 'error', message: 'Erro ao buscar estatísticas' });
  }
});

// ===== SERVIDOR DE ARQUIVOS ESTÁTICOS =====
const distPath = path.join(process.cwd(), 'dist');

// Servir arquivos estáticos
app.use(express.static(distPath));

// Fallback para SPA React
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ===== INICIAR O SERVIDOR COM app.listen() =====
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/games`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
});