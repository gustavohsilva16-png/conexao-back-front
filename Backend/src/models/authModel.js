// Executa consultas de autenticacao e acesso a partir da tabela login.
const database = require('../config/database');

const AuthModel = {
    // Busca credenciais e nome do cliente pelo e-mail informado.
    async buscarPorEmail(email) {
        let connection;

        try {
            connection = await database.getConnection();
            return await connection.query(
                `SELECT l.id_login, l.id_cliente, l.senha, l.ativo, c.nome
                 FROM login l
                 INNER JOIN cliente c ON l.id_cliente = c.id_cliente
                 WHERE TRIM(l.email) = ?`,
                [email]
            );
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    // Atualiza o horario do ultimo login confirmado.
    async atualizarUltimoAcesso(idLogin) {
        let connection;

        try {
            connection = await database.getConnection();
            await connection.query(
                'UPDATE login SET ultimo_acesso = NOW() WHERE id_login = ?',
                [idLogin]
            );
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
};

module.exports = AuthModel;
