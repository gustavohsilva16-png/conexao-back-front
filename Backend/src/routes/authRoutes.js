const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Autentica o usuario e retorna os dados basicos da conta.
router.post('/login', authController.login);

module.exports = router;