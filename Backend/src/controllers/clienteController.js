// Coordena consultas de perfil e atualizacoes de endereco.
const ClienteModel = require('../models/clienteModel');
const CadastroModel = require('../models/cadastroModel');

const clienteController = {
    // Retorna os dados do cliente junto com o endereco cadastrado.
    async buscarPerfil(req, res) {
        const idCliente = Number(req.params.id);
        if (!Number.isSafeInteger(idCliente) || idCliente < 1) {
            return res.status(400).json({ error: 'Identificador de cliente invalido.' });
        }

        try {
            const cliente = await ClienteModel.buscarPorId(idCliente);
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente nao encontrado.' });
            }

            const endereco = await CadastroModel.buscarPorCliente(idCliente);
            return res.status(200).json({ ...cliente, endereco: endereco || null });
        } catch (error) {
            console.error('Erro ao consultar perfil do cliente:', error);
            return res.status(500).json({ error: 'Falha ao consultar perfil.' });
        }
    },

    // Salva os dados do endereco validados pelo middleware da rota.
    async salvarEndereco(req, res) {
        try {
            await CadastroModel.salvarEndereco(req.body);
            return res.status(200).json({ message: 'Endereco atualizado com sucesso!' });
        } catch (error) {
            console.error('Erro ao salvar endereco:', error);
            return res.status(500).json({ error: 'Falha ao salvar endereco.' });
        }
    }
};

module.exports = clienteController;
