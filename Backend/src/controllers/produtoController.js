// Coordena respostas HTTP do catalogo usando o modelo de produtos.
const ProdutoModel = require('../models/produtoModel');

const produtoController = {
    // Lista os produtos disponiveis.
    async listar(req, res) {
        try {
            const produtos = await ProdutoModel.listarTodos();
            return res.status(200).json(produtos);
        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            return res.status(500).json({ error: 'Falha ao listar produtos.' });
        }
    },

    // Cadastra um produto validado pelo middleware.
    async cadastrar(req, res) {
        try {
            const idProduto = await ProdutoModel.cadastrar(req.body);
            return res.status(201).json({
                message: 'Produto cadastrado com sucesso!',
                id_produto: idProduto
            });
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            return res.status(500).json({ error: 'Falha ao cadastrar produto.' });
        }
    },

    // Atualiza um produto e retorna 404 quando o ID nao existe.
    async atualizar(req, res) {
        const idProduto = Number(req.params.id);
        if (!Number.isSafeInteger(idProduto) || idProduto < 1) {
            return res.status(400).json({ error: 'Identificador de produto invalido.' });
        }

        try {
            const encontrado = await ProdutoModel.atualizar(idProduto, req.body);
            if (!encontrado) {
                return res.status(404).json({ error: 'Produto nao encontrado.' });
            }
            return res.status(200).json({ message: 'Produto atualizado com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            return res.status(500).json({ error: 'Falha ao atualizar produto.' });
        }
    },

    // Exclui um produto e retorna 404 quando o ID nao existe.
    async excluir(req, res) {
        const idProduto = Number(req.params.id);
        if (!Number.isSafeInteger(idProduto) || idProduto < 1) {
            return res.status(400).json({ error: 'Identificador de produto invalido.' });
        }

        try {
            const removido = await ProdutoModel.excluir(idProduto);
            if (!removido) {
                return res.status(404).json({ error: 'Produto nao encontrado.' });
            }
            return res.status(200).json({ message: 'Produto removido com sucesso!' });
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            return res.status(500).json({ error: 'Falha ao excluir produto.' });
        }
    }
};

module.exports = produtoController;
