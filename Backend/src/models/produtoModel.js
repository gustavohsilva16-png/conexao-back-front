// Executa operacoes CRUD da tabela produto.
const database = require('../config/database');

const ProdutoModel = {
    // Retorna todos os produtos cadastrados.
    async listarTodos() {
        let connection;

        try {
            connection = await database.getConnection();
            return await connection.query('SELECT * FROM produto');
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    // Cadastra um produto e retorna o identificador gerado pelo banco.
    async cadastrar(dados) {
        const {
            nome,
            descricao,
            preco,
            estoque,
            categoria,
            is_organico,
            is_vegano
        } = dados;
        let connection;

        try {
            connection = await database.getConnection();
            const result = await connection.query(
                `INSERT INTO produto
                    (nome, descricao, preco, estoque, categoria, is_organico, is_vegano)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    nome,
                    descricao || null,
                    preco,
                    estoque,
                    categoria,
                    is_organico ?? true,
                    is_vegano ?? true
                ]
            );
            return Number(result.insertId);
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    // Atualiza os campos editaveis de um produto.
    async atualizar(idProduto, dados) {
        const { nome, descricao, preco, estoque, categoria } = dados;
        let connection;

        try {
            connection = await database.getConnection();
            const existing = await connection.query(
                'SELECT id_produto FROM produto WHERE id_produto = ?',
                [idProduto]
            );
            if (existing.length === 0) {
                return 0;
            }

            await connection.query(
                `UPDATE produto
                 SET nome = ?, descricao = ?, preco = ?, estoque = ?, categoria = ?
                 WHERE id_produto = ?`,
                [nome, descricao || null, preco, estoque, categoria, idProduto]
            );
            return 1;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    // Remove um produto e informa quantas linhas foram afetadas.
    async excluir(idProduto) {
        let connection;

        try {
            connection = await database.getConnection();
            const result = await connection.query(
                'DELETE FROM produto WHERE id_produto = ?',
                [idProduto]
            );
            return result.affectedRows;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
};

module.exports = ProdutoModel;
