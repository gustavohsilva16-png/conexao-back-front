const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');

// Finaliza a compra, atualiza estoque e emite a nota fiscal.
router.post('/finalizar-compra', compraController.finalizar);

module.exports = router;