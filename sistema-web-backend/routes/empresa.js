// sistema-web-backend/routes/empresa.js
const express = require('express');
const Firebird = require('node-firebird');
const router = express.Router();

// GET /empresa - lista todas as empresas do banco Firebird
router.get('/', (req, res) => {
  // obtém opções do Firebird injetadas pelo middleware em server.js
  const options = req.firebirdOpts;

  Firebird.attach(options, (err, db) => {
    if (err) return res.status(500).send(err);

    const sql = `
      SELECT EMPRESA, RAZAO_SOCIAL, ESTADO, ENDERECO, CIDADE, BAIRRO,
             TELEFONE_1, TELEFONE_2, CNPJ, INSCRICAO_ESTADUAL
      FROM EMPRESA
      ORDER BY EMPRESA
    `;

    db.query(sql, [], (err, result) => {
      db.detach();
      if (err) return res.status(500).send(err);
      res.json(result);
    });
  });
});

// POST /empresa - adiciona empresa em memória (exemplo)
router.post('/', (req, res) => {
  // Exemplo de armazenamento em memória apenas
  const nova = req.body;
  nova.EMPRESA = Date.now(); // geração de ID simples
  // TODO: implementar persistência real
  res.status(201).json(nova);
});

// PUT /empresa/:id - atualiza empresa em memória
router.put('/:id', (req, res) => {
  // TODO: implementar lógica de atualização no banco
  res.status(501).send('Não implementado');
});

// DELETE /empresa/:id - remove empresa em memória
router.delete('/:id', (req, res) => {
  // TODO: implementar lógica de exclusão no banco
  res.status(501).send('Não implementado');
});

module.exports = router;
