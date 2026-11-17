// Converte erros de JSON em 400 e evita expor detalhes internos da API.
module.exports = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({ error: 'JSON enviado e invalido ou mal formatado.' });
    }

    console.error('Erro nao tratado na API:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
};