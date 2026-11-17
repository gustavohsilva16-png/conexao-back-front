// Coordena a validacao das credenciais e as consultas do modelo de autenticacao.
const AuthModel = require('../models/authModel');

const authController = {
    // Autentica o usuario sem gravar credenciais em logs.
    async login(req, res) {
        const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
        const senha = typeof req.body.senha === 'string' ? req.body.senha.trim() : '';

        if (!email || !senha) {
            return res.status(400).json({ error: 'E-mail e senha sao obrigatorios.' });
        }

        try {
            const usuarios = await AuthModel.buscarPorEmail(email);

            if (usuarios.length === 0) {
                return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
            }

            const usuario = usuarios[0];
            if (!usuario.ativo) {
                return res.status(403).json({ message: 'Conta de usuario inativa.' });
            }

            if (String(usuario.senha).trim() !== senha) {
                return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
            }

            await AuthModel.atualizarUltimoAcesso(usuario.id_login);
            return res.status(200).json({
                message: 'Login realizado com sucesso!',
                id_cliente: usuario.id_cliente,
                nome: usuario.nome
            });
        } catch (error) {
            console.error('Erro ao autenticar usuario:', error);
            return res.status(500).json({ error: 'Falha ao autenticar usuario.' });
        }
    }
};

module.exports = authController;
