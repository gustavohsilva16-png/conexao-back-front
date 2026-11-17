// Valida mensagens de contato e delega persistencia e listagem ao modelo.
const ConsultaModel = require('../models/consultaModel');

const consultaController = {
    // Registra uma mensagem enviada por um cliente.
    async enviarMensagem(req, res) {
        const { id_cliente: idCliente, assunto, mensagem } = req.body;

        if (!Number.isSafeInteger(Number(idCliente)) || Number(idCliente) < 1
            || typeof assunto !== 'string' || !assunto.trim()
            || typeof mensagem !== 'string' || !mensagem.trim()) {
            return res.status(400).json({
                error: 'id_cliente, assunto e mensagem sao obrigatorios.'
            });
        }

        try {
            const idConsulta = await ConsultaModel.criar({
                id_cliente: Number(idCliente),
                assunto: assunto.trim(),
                mensagem: mensagem.trim()
            });
            return res.status(201).json({
                message: 'Consulta enviada com sucesso!',
                id_consulta: idConsulta
            });
        } catch (error) {
            console.error('Erro ao registrar consulta:', error);
            return res.status(500).json({ error: 'Falha ao registrar consulta.' });
        }
    },

    // Lista as mensagens enviadas por um cliente.
    async listar(req, res) {
        const idCliente = Number(req.params.id_cliente);
        if (!Number.isSafeInteger(idCliente) || idCliente < 1) {
            return res.status(400).json({ error: 'Identificador de cliente invalido.' });
        }

        try {
            const consultas = await ConsultaModel.listarPorCliente(idCliente);
            return res.status(200).json(consultas);
        } catch (error) {
            console.error('Erro ao listar consultas:', error);
            return res.status(500).json({ error: 'Falha ao listar consultas.' });
        }
    }
};

module.exports = consultaController;
