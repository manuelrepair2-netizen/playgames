import express from "express";
import path from "path";
import mongoose from 'mongoose';
import { Game } from './src/models/Game';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ===== VERIFICAR VARIÁVEIS DE AMBIENTE =====
console.log('🔍 Verificando variáveis de ambiente...');
console.log('PORT:', process.env.PORT || '3000 (padrão)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// ===== CONEXÃO AO MONGODB =====
const MONGODB_URI = process.env.MONGODB_URI;
console.log('📡 MONGODB_URI:', MONGODB_URI ? '✅ definida' : '❌ NÃO definida');

if (!MONGODB_URI) {
  console.error('❌ ERRO FATAL: MONGODB_URI não está definida!');
  console.log('💡 Configure no Render: Environment → Add Variable → MONGODB_URI');
  // Fallback para teste (REMOVER DEPOIS!)
  console.log('🔄 Usando fallback para teste...');
  const fallbackURI = 'mongodb+srv://manuel:Manuel%231978@cluster0.lzmysuf.mongodb.net/ps4games';
  mongoose.connect(fallbackURI)
    .then(() => console.log('✅ Conectado ao MongoDB (fallback)!'))
    .catch(err => {
      console.error('❌ Fallback também falhou:', err.message);
      process.exit(1);
    });
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
    .catch(err => {
      console.error('❌ Erro ao conectar:', err.message);
      process.exit(1);
    });
}

// ===== ROTAS DA API =====
app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.json({ status: 'success', data: games });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Erro ao buscar jogos' });
  }
});

// ===== ROTA DE TESTE PARA VARIÁVEIS DE AMBIENTE =====
app.get('/api/test-env', (req, res) => {
  res.json({
    hasMongoURI: !!process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    status: 'Servidor rodando!'
  });
});

// Servir arquivos estáticos
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// Fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

export default app;