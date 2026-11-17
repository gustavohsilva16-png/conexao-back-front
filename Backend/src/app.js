// Monta middlewares, rotas da API e arquivos estaticos do frontend.
const path = require('node:path');
const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const errorMiddleware = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const compraRoutes = require('./routes/compraRoutes');
const consultaRoutes = require('./routes/consultaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');

// Cria a aplicacao sem abrir a porta, permitindo testar os endpoints isoladamente.
const app = express();

// Habilita chamadas HTTP e converte JSON de entrada para req.body.
app.use(cors());
app.use(express.json());

// Garante corpo vazio em requisicoes sem JSON para as validacoes responderem 400.
app.use((req, res, next) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        req.body = {};
    }
    next();
});

// Confirma que o processo HTTP esta ativo sem depender do banco.
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Testa a conexao configurada sem expor credenciais ou detalhes internos do banco.
app.get('/api/health/database', async (req, res) => {
    let connection;

    try {
        connection = await database.getConnection();
        await connection.query('SELECT 1');
        return res.status(200).json({ status: 'ok', database: 'connected' });
    } catch (error) {
        console.error('Verificacao de conexao com o banco falhou:', error.code || error.message);
        return res.status(503).json({
            status: 'error',
            database: 'disconnected',
            code: error.code || 'DB_CONNECTION_FAILED'
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Encaminha cada grupo de endpoints para o router do recurso correspondente.
app.use('/api', authRoutes);
app.use('/api', carrinhoRoutes);
app.use('/api', clienteRoutes);
app.use('/api', compraRoutes);
app.use('/api', consultaRoutes);
app.use('/api', produtoRoutes);

// Publica estilos e scripts do frontend em /src e as paginas em /.
const frontendRoot = path.resolve(__dirname, '../../Front');
app.use('/src', express.static(path.join(frontendRoot, 'src')));
app.use(express.static(path.join(frontendRoot, 'public')));

// Trata JSON malformado e erros que nao foram tratados pelos controllers.
app.use(errorMiddleware);

module.exports = app;
