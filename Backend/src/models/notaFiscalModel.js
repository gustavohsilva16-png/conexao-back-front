// Usa o pool centralizado para consultas de nota fiscal.
const conexao = require('../config/database');

const NotaFiscalModel = {
    buscarPorCompra: async (id_compra) => {
        let conn;
        try {
            conn = await conexao.getConnection();
            const rows = await conn.query('SELECT * FROM nota_fiscal WHERE id_compra = ?', [id_compra]);
            return rows[0];
        } finally {
            if (conn) conn.release();
        }
    }
};

module.exports = NotaFiscalModel;