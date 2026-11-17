const express = require('express');
const router = express.Router();
const clienteMiddleware = require('../middlewares/clienteMiddleware');
const clienteController = require('../controllers/clienteController');

// Consulta o perfil e o endereco de um cliente.
router.get('/clientes/:id', clienteController.buscarPerfil);

// Valida os campos do endereco antes de salvar.
router.post(
    '/clientes/endereco',
    clienteMiddleware.validarEndereco,
    clienteController.salvarEndereco
);

module.exports = router;