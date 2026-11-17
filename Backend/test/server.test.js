// Testa inicializacao, entrega do frontend e validacoes sem depender do banco.
const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const app = require('../src/app');

let server;
let baseUrl;

// Inicia a aplicacao em uma porta temporaria para os testes HTTP.
before(async () => {
    await new Promise((resolve) => {
        server = app.listen(0, '127.0.0.1', () => {
            baseUrl = `http://127.0.0.1:${server.address().port}`;
            resolve();
        });
    });
});

// Fecha a porta temporaria para que o processo de testes possa terminar.
after(async () => {
    await new Promise((resolve, reject) => {
        server.close((error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
});

// Confirma que o processo HTTP responde sem exigir conexao com MariaDB.
test('GET /api/health informa que o servidor esta ativo', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
});

// Confirma que a pagina inicial do frontend e servida pelo backend.
test('GET / entrega o frontend', async () => {
    const response = await fetch(`${baseUrl}/`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /BioCosmetics/);
});

// Confirma que arquivos CSS estaticos estao disponiveis em /src.
test('GET /src/styles/store.css entrega o estilo da loja', async () => {
    const response = await fetch(`${baseUrl}/src/styles/store.css`);
    assert.equal(response.status, 200);
});

// Confirma que os scripts do frontend estao disponiveis junto com a API.
test('GET /src/scripts/store.js entrega o script da loja', async () => {
    const response = await fetch(`${baseUrl}/src/scripts/store.js`);
    assert.equal(response.status, 200);
});

// Confirma que o login rejeita campos ausentes antes de acessar o banco.
test('POST /api/login sem credenciais retorna HTTP 400', async () => {
    const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST'
    });
    assert.equal(response.status, 400);
});

// Confirma que o cadastro rejeita dados incompletos antes de acessar o banco.
test('POST /api/produtos sem dados retorna HTTP 400', async () => {
    const response = await fetch(`${baseUrl}/api/produtos`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({})
    });
    assert.equal(response.status, 400);
});

// Confirma que JSON invalido recebe resposta 400 em vez de derrubar o servidor.
test('JSON malformado retorna HTTP 400', async () => {
    const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{'
    });
    assert.equal(response.status, 400);
});
