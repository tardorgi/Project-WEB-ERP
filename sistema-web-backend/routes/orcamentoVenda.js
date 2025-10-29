// sistema-web-backend/routes/orcamentoVenda.js
const express = require('express');
const Firebird = require('node-firebird');
const router = express.Router();

function parseFiltroMulti(valor) {
  if (!valor) return [];
  return valor.split(';').map(v => v.trim()).filter(Boolean);
}

// GET /orcamentoVenda - lista todos os orçamentos
router.get('/', (req, res) => {
  const options = req.firebirdOpts;
  const {
    ordenarPor, direcao,
    filtro_EMPRESA, filtro_ORCAMENTO, filtro_DATA_ORCAMENTO,
    filtro_TIPO_MOVIMENTO, filtro_STATUS, filtro_USUARIO
  } = req.query;

  let sql = `SELECT * FROM ORCAMENTO_VENDA`;
  const where = [];
  const params = [];

  // EMPRESA
  const empresas = parseFiltroMulti(filtro_EMPRESA);
  if (empresas.length === 1) {
    where.push('EMPRESA = ?');
    params.push(empresas[0]);
  } else if (empresas.length > 1) {
    where.push(`EMPRESA IN (${empresas.map(() => '?').join(',')})`);
    params.push(...empresas);
  }

  // ORCAMENTO
  const orcamentos = parseFiltroMulti(filtro_ORCAMENTO);
  if (orcamentos.length === 1) {
    where.push('ORCAMENTO = ?');
    params.push(orcamentos[0]);
  } else if (orcamentos.length > 1) {
    where.push(`ORCAMENTO IN (${orcamentos.map(() => '?').join(',')})`);
    params.push(...orcamentos);
  }

  // DATA_ORCAMENTO
  const datas = parseFiltroMulti(filtro_DATA_ORCAMENTO);
  if (datas.length === 1) {
    where.push('DATA_ORCAMENTO = ?');
    params.push(datas[0]);
  } else if (datas.length > 1) {
    where.push(`DATA_ORCAMENTO IN (${datas.map(() => '?').join(',')})`);
    params.push(...datas);
  }

  // TIPO_MOVIMENTO
  const tipos = parseFiltroMulti(filtro_TIPO_MOVIMENTO);
  if (tipos.length === 1) {
    where.push('TIPO_MOVIMENTO = ?');
    params.push(tipos[0]);
  } else if (tipos.length > 1) {
    where.push(`TIPO_MOVIMENTO IN (${tipos.map(() => '?').join(',')})`);
    params.push(...tipos);
  }

  // STATUS
  const status = parseFiltroMulti(filtro_STATUS);
  if (status.length === 1) {
    where.push('STATUS = ?');
    params.push(status[0]);
  } else if (status.length > 1) {
    where.push(`STATUS IN (${status.map(() => '?').join(',')})`);
    params.push(...status);
  }

  // USUARIO
  const usuarios = parseFiltroMulti(filtro_USUARIO);
  if (usuarios.length === 1) {
    where.push('USUARIO = ?');
    params.push(usuarios[0]);
  } else if (usuarios.length > 1) {
    where.push(`USUARIO IN (${usuarios.map(() => '?').join(',')})`);
    params.push(...usuarios);
  }

  if (where.length) {
    sql += ' WHERE ' + where.join(' AND ');
  }
  if (ordenarPor && ['EMPRESA','ORCAMENTO','DATA_ORCAMENTO','TIPO_MOVIMENTO','STATUS','USUARIO'].includes(ordenarPor)) {
    sql += ` ORDER BY ${ordenarPor} ${direcao === 'desc' ? 'DESC' : 'ASC'}`;
  } else {
    sql += ' ORDER BY ORCAMENTO';
  }

  Firebird.attach(options, (err, db) => {
    if (err) return res.status(500).send(err);
    db.query(sql, params, (err, result) => {
      db.detach();
      if (err) return res.status(500).send(err);
      res.json(result);
    });
  });
});

// POST /orcamentoVenda - cria novo orçamento
router.post('/', (req, res) => {
  const options = req.firebirdOpts;
  const {
    EMPRESA, ORCAMENTO, DATA_ORCAMENTO, TIPO_MOVIMENTO, STATUS, USUARIO
  } = req.body;

  Firebird.attach(options, (err, db) => {
    if (err) return res.status(500).send(err);

    const sql = `
      INSERT INTO ORCAMENTO_VENDA
      (EMPRESA, ORCAMENTO, DATA_ORCAMENTO, TIPO_MOVIMENTO, STATUS, USUARIO)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      EMPRESA, ORCAMENTO, DATA_ORCAMENTO, TIPO_MOVIMENTO, STATUS, USUARIO
    ], (err, result) => {
      db.detach();
      if (err) return res.status(500).send(err);
      res.status(201).json({ success: true });
    });
  });
});

// PUT /orcamentoVenda/:empresa/:orcamento - altera orçamento
router.put('/:empresa/:orcamento', (req, res) => {
  const options = req.firebirdOpts;
  const { empresa, orcamento } = req.params;
  const {
    DATA_ORCAMENTO, TIPO_MOVIMENTO, STATUS, USUARIO
  } = req.body;

  Firebird.attach(options, (err, db) => {
    if (err) return res.status(500).send(err);

    const sql = `
      UPDATE ORCAMENTO_VENDA
      SET DATA_ORCAMENTO = ?, TIPO_MOVIMENTO = ?, STATUS = ?, USUARIO = ?
      WHERE EMPRESA = ? AND ORCAMENTO = ?
    `;
    db.query(sql, [
      DATA_ORCAMENTO, TIPO_MOVIMENTO, STATUS, USUARIO, empresa, orcamento
    ], (err, result) => {
      db.detach();
      if (err) return res.status(500).send(err);
      res.json({ success: true });
    });
  });
});

// DELETE /orcamentoVenda/:empresa/:orcamento - remove orçamento
router.delete('/:empresa/:orcamento', (req, res) => {
  const options = req.firebirdOpts;
  const { empresa, orcamento } = req.params;

  Firebird.attach(options, (err, db) => {
    if (err) return res.status(500).send(err);

    const sql = `
      DELETE FROM ORCAMENTO_VENDA
      WHERE EMPRESA = ? AND ORCAMENTO = ?
    `;
    db.query(sql, [empresa, orcamento], (err, result) => {
      db.detach();
      if (err) return res.status(500).send(err);
      res.json({ success: true });
    });
  });
});

// GET /orcamentoVenda/:empresa/:orcamento/itens - busca itens do orçamento
router.get('/:empresa/:orcamento/itens', (req, res) => {
  const options = req.firebirdOpts;
  const { empresa, orcamento } = req.params;

  Firebird.attach(options, (err, db) => {
    if (err) return res.status(500).send(err);

    const sql = `
      SELECT I.EMPRESA, I.ORCAMENTO, I.ITEM, I.MATERIAL, I.UNIDADE, I.QUANTIDADE, I.PRECO_UNITARIO, I.VR_TOTAL_ITEM,
             M.DESCRICAO
        FROM ORCAMENTO_VENDA_ITEM I
        LEFT JOIN MATERIAL M ON M.MATERIAL = I.MATERIAL
       WHERE I.EMPRESA = ? AND I.ORCAMENTO = ?
       ORDER BY I.ITEM
    `;
    db.query(sql, [empresa, orcamento], (err, result) => {
      db.detach();
      if (err) return res.status(500).send(err);
      res.json(result);
    });
  });
});

module.exports = router;
