// Carrega as credenciais do arquivo .env localizado na raiz do backend.
const path = require('node:path');
const mariadb = require('mariadb');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Centraliza as opcoes do pool e limita esperas por conexoes indisponiveis.
const configuracaoBanco = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'Projeto_integrador',
    connectionLimit: 5,
    acquireTimeout: 5000,
    connectTimeout: 5000
};

let pool;

// Cria o pool somente quando uma operacao realmente precisar do banco.
function obterPool() {
    if (!pool) {
        pool = mariadb.createPool(configuracaoBanco);
    }

    return pool;
}

// Exporta o metodo de conexao usado pelos modelos da aplicacao.
module.exports = {
    getConnection() {
        return obterPool().getConnection();
    }
};
