// Valida os dados de checkout e traduz resultados do modelo em respostas HTTP.
const CompraModel = require('../models/compraModel');

const compraController = {
    // Finaliza a compra se o cliente tiver carrinho e estoque suficientes.
    async finalizar(req, res) {
        const idCliente = Number(req.body.id_cliente);
        const metodoPagamento = req.body.metodo_pagamento;
        const metodosPermitidos = ['CARTAO', 'PIX', 'BOLETO'];

        if (!Number.isSafeInteger(idCliente) || idCliente < 1) {
            return res.status(400).json({ error: 'Identificador de cliente invalido.' });
        }

        if (!metodosPermitidos.includes(metodoPagamento)) {
            return res.status(400).json({ error: 'Metodo de pagamento invalido.' });
        }

        try {
            const resultado = await CompraModel.finalizarCompra(idCliente, metodoPagamento);
            return res.status(200).json({
                message: 'Compra finalizada com sucesso e Nota Fiscal emitida!',
                ...resultado
            });
        } catch (error) {
            console.error('Erro ao finalizar compra:', error);
            return res.status(error.statusCode || 500).json({
                error: error.statusCode ? error.message : 'Falha ao finalizar compra.'
            });
        }
    }
};

module.exports = compraController;
