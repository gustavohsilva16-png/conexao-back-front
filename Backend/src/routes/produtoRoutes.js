const express = require('express');
const router = express.Router();
const produtoMiddleware = require('../middlewares/produtoMiddleware');
const produtoController = require('../controllers/produtoController');

// Lista os produtos disponiveis no banco.
router.get('/produtos', produtoController.listar);

// Valida os campos obrigatorios antes de cadastrar um produto.
router.post('/produtos', produtoMiddleware, produtoController.cadastrar);

// Valida os campos obrigatorios antes de atualizar um produto.
router.put('/produtos/:id', produtoMiddleware, produtoController.atualizar);

// Exclui um produto usando seu identificador.
router.delete('/produtos/:id', produtoController.excluir);

module.exports = router;