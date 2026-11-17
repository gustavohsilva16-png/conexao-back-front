// Executa consultas e alteracoes na tabela de itens do carrinho.
const database = require('../config/database');

const CarrinhoModel = {
    // Retorna os itens e subtotais do carrinho de um cliente.
    async buscarPorCliente(idCliente) {
        let connection;

        try {
            connection = await database.getConnection();
            return await connection.query(
                `SELECT c.id_carrinho, p.id_produto, p.nome, p.preco,
                        c.quantidade, (p.preco * c.quantidade) AS subtotal
                 FROM carrinho_de_compra c
                 INNER JOIN produto p ON c.id_produto = p.id_produto
                 WHERE c.id_cliente = ?`,
                [idCliente]
            );
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    // Insere o item ou soma a quantidade quando produto e cliente ja existem.
    async adicionarItem(idCliente, idProduto, quantidade) {
        let connection;

        try {
            connection = await database.getConnection();
            await connection.query(
                `INSERT INTO carrinho_de_compra (id_cliente, id_produto, quantidade)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)`,
                [idCliente, idProduto, quantidade]
            );
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },

    // Remove uma linha do carrinho pelo identificador.
    async removerItem(idCarrinho) {
        let connection;

        try {
            connection = await database.getConnection();
            const result = await connection.query(
                'DELETE FROM carrinho_de_compra WHERE id_carrinho = ?',
                [idCarrinho]
            );
            return result.affectedRows;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
};

module.exports = CarrinhoModel;
