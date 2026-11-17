const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');

// Registra uma mensagem enviada ao atendimento.
router.post('/consultas', consultaController.enviarMensagem);

// Lista mensagens de atendimento do cliente.
router.get('/consultas/:id_cliente', consultaController.listar);

module.exports = router;