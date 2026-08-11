import express from "express";
import path from "path";
import { connectDB } from './src/database/db';
import { Game } from './src/models/Game';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'dist')));

// Conectar ao MongoDB
connectDB();

// ====== ROTAS DA API ======

// Buscar todos os jogos
app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.json({ status: 'success', data: games });
  } catch (error) {
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
    res.status(500).json({ status: 'error', message: 'Erro ao adicionar jogo' });
  }
});

// Atualizar jogo
app.put('/api/games/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: 'success', data: game });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Erro ao atualizar jogo' });
  }
});

// Deletar jogo
app.delete('/api/games/:id', async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Jogo deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Erro ao deletar jogo' });
  }
});

// Estatísticas
app.get('/api/stats', async (req, res) => {
  try {
    const totalGames = await Game.countDocuments();
    const totalDownloads = await Game.aggregate([{ $group: { _id: null, total: { $sum: '$downloads' } } }]);
    res.json({
      status: 'success',
      totalGames,
      totalDownloads: totalDownloads[0]?.total || 0,
      totalUsers: 1480, // Será implementado depois
      newGamesThisWeek: 3
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Erro ao buscar estatísticas' });
  }
});

// Fallback para React
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// Iniciar servidor (NÃO USAR NO RENDER - ver abaixo)
// app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Exportar para o Render (usar isso!)
export default app;