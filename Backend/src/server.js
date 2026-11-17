// Carrega a aplicacao e inicia o servidor na porta configurada em .env.
const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const app = require('./app');

// Usa a porta do ambiente ou a porta padrao local 3000.
const port = Number(process.env.PORT) || 3000;

// Inicia o backend, que tambem serve a interface do frontend.
const server = app.listen(port, () => {
    console.log(`Servidor BioCosmetics rodando em http://localhost:${port}`);
});

// Faz o processo terminar com erro claro se a porta nao puder ser aberta.
server.on('error', (error) => {
    console.error('Nao foi possivel iniciar o servidor:', error);
    process.exitCode = 1;
});
