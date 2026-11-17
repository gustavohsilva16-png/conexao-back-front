// Processa a compra e mantem estoque, carrinho e nota fiscal na mesma transacao.
const { randomInt } = require('node:crypto');
const database = require('../config/database');

const CompraModel = {
    // Confirma uma compra depois de validar o carrinho e o estoque.
    async finalizarCompra(idCliente, metodoPagamento) {
        let connection;
        let transactionStarted = false;

        try {
            connection = await database.getConnection();
            await connection.beginTransaction();
            transactionStarted = true;

            const cart = await connection.query(
                `SELECT c.id_produto, c.quantidade, p.preco, p.estoque
                 FROM carrinho_de_compra c
                 INNER JOIN produto p ON c.id_produto = p.id_produto
                 WHERE c.id_cliente = ?
                 FOR UPDATE`,
                [idCliente]
            );

            if (cart.length === 0) {
                const error = new Error('O carrinho esta vazio.');
                error.statusCode = 400;
                throw error;
            }

            // Valida o estoque e soma os precos dos produtos do carrinho.
            let total = 0;
            for (const item of cart) {
                if (item.estoque < item.quantidade) {
                    const error = new Error(
                        'Estoque insuficiente para um dos itens do carrinho.'
                    );
                    error.statusCode = 400;
                    throw error;
                }
                total += Number(item.preco) * item.quantidade;
            }

            const purchase = await connection.query(
                `INSERT INTO compra
                    (id_cliente, valor_total, metodo_pagamento, status_compra)
                 VALUES (?, ?, ?, 'PAGO')`,
                [idCliente, total, metodoPagamento]
            );
            const purchaseId = Number(purchase.insertId);

            // Debita o estoque dos produtos dentro da transacao aberta.
            for (const item of cart) {
                await connection.query(
                    'UPDATE produto SET estoque = estoque - ? WHERE id_produto = ?',
                    [item.quantidade, item.id_produto]
                );
            }

            // Gera a chave da nota fiscal e calcula o imposto estimado do pedido.
            const accessKey = `3526${Array.from(
                { length: 40 },
                () => randomInt(0, 10)
            ).join('')}`;
            const tax = Number((total * 0.18).toFixed(2));

            await connection.query(
                `INSERT INTO nota_fiscal (id_compra, chave_acesso, valor_imposto)
                 VALUES (?, ?, ?)`,
                [purchaseId, accessKey, tax]
            );
            await connection.query(
                'DELETE FROM carrinho_de_compra WHERE id_cliente = ?',
                [idCliente]
            );
            await connection.commit();
            transactionStarted = false;

            return {
                id_compra: purchaseId,
                chave_acesso: accessKey,
                valor_total: total,
                valor_imposto: tax
            };
        } catch (error) {
            // Desfaz as alteracoes se alguma etapa falhar antes do commit.
            if (connection && transactionStarted) {
                try {
                    await connection.rollback();
                } catch (rollbackError) {
                    console.error('Falha ao desfazer transacao da compra:', rollbackError);
                }
            }
            throw error;
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }
};

module.exports = CompraModel;
