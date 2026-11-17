module.exports = (req, res, next) => {
    const { nome, preco, estoque, categoria } = req.body;

    // Valida campos apenas nos metodos que criam ou atualizam produtos.
    if (req.method === 'POST' || req.method === 'PUT') {
        if (!nome || preco === undefined || estoque === undefined || !categoria) {
            return res.status(400).json({ 
                error: 'Nome, preco, estoque e categoria sao obrigatorios.' 
            });
        }

        // Rejeita precos nao numericos ou menores ou iguais a zero.
        if (!Number.isFinite(Number(preco)) || Number(preco) <= 0) {
            return res.status(400).json({ 
                error: 'O preco do produto deve ser maior que zero.' 
            });
        }

        // Exige estoque inteiro e nao negativo.
        if (!Number.isSafeInteger(Number(estoque)) || Number(estoque) < 0) {
            return res.status(400).json({ 
                error: 'O estoque deve ser um inteiro nao negativo.' 
            });
        }
    }

    next();
};