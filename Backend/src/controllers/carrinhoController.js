// Valida as requisicoes HTTP do carrinho e delega as consultas ao modelo.
const CarrinhoModel = require('../models/carrinhoModel');

const carrinhoController = {
    // Retorna os itens do carrinho do cliente indicado na URL.
    async buscar(req, res) {
        const idCliente = Number(req.params.id_cliente);

        if (!Number.isSafeInteger(idCliente) || idCliente < 1) {
            return res.status(400).json({ error: 'Identificador de cliente invalido.' });
        }

        try {
            const itens = await CarrinhoModel.buscarPorCliente(idCliente);
            return res.status(200).json(itens);
        } catch (error) {
            console.error('Erro ao consultar carrinho:', error);
            return res.status(500).json({ error: 'Falha ao consultar carrinho.' });
        }
    },

    // Adiciona somente quantidades inteiras positivas ao carrinho.
    async adicionar(req, res) {
        const idCliente = Number(req.body.id_cliente);
        const idProduto = Number(req.body.id_produto);
        const quantidade = Number(req.body.quantidade);

        if (
            !Number.isSafeInteger(idCliente) || idCliente < 1
            || !Number.isSafeInteger(idProduto) || idProduto < 1
            || !Number.isSafeInteger(quantidade) || quantidade < 1
        ) {
            return res.status(400).json({
                error: 'id_cliente, id_produto e quantidade inteira positiva sao obrigatorios.'
            });
        }

        try {
            await CarrinhoModel.adicionarItem(idCliente, idProduto, quantidade);
            return res.status(201).json({
                message: 'Produto adicionado ao carrinho com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao adicionar item ao carrinho:', error);
            return res.status(500).json({ error: 'Falha ao adicionar item ao carrinho.' });
        }
    },

    // Remove um item especifico e informa quando ele nao existe.
    async remover(req, res) {
        const idCarrinho = Number(req.params.id_carrinho);

        if (!Number.isSafeInteger(idCarrinho) || idCarrinho < 1) {
            return res.status(400).json({ error: 'Identificador de item invalido.' });
        }

        try {
            const removidos = await CarrinhoModel.removerItem(idCarrinho);
            if (removidos === 0) {
                return res.status(404).json({ error: 'Item do carrinho nao encontrado.' });
            }
            return res.status(200).json({ message: 'Item removido do carrinho.' });
        } catch (error) {
            console.error('Erro ao remover item do carrinho:', error);
            return res.status(500).json({ error: 'Falha ao remover item do carrinho.' });
        }
    }
};

module.exports = carrinhoController;
