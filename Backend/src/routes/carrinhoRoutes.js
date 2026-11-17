const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');

// Consulta o carrinho e seus subtotais pelo cliente.
router.get('/carrinho/:id_cliente', carrinhoController.buscar);

// Adiciona um produto ao carrinho.
router.post('/carrinho', carrinhoController.adicionar);

// Remove uma linha do carrinho pelo identificador.
router.delete('/carrinho/:id_carrinho', carrinhoController.remover);

module.exports = router;