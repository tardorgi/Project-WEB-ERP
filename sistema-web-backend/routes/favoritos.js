const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const FAVORITOS_PATH = path.join(__dirname, '../data/favoritos.json');

// GET favoritos
router.get('/', (req, res) => {
  fs.readFile(FAVORITOS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Erro ao ler favoritos');
    try {
      const json = JSON.parse(data);
      const resultado = Array.isArray(json) ? json : [json];
      res.json(resultado);
    } catch (parseErr) {
      res.status(500).send('Erro ao interpretar favoritos');
    }
  });
});


// POST favoritos
router.post('/', (req, res) => {
  const novoFavorito = req.body;

  fs.readFile(FAVORITOS_PATH, 'utf8', (err, data) => {
    let favoritosAtuais = [];
    if (!err && data) {
      try {
        favoritosAtuais = JSON.parse(data);
        if (!Array.isArray(favoritosAtuais)) favoritosAtuais = [favoritosAtuais];
      } catch (parseErr) {
        favoritosAtuais = [];
      }
    }

    const existe = favoritosAtuais.some(f => f.id === novoFavorito.id);
    if (!existe) favoritosAtuais.push(novoFavorito);

    fs.writeFile(FAVORITOS_PATH, JSON.stringify(favoritosAtuais, null, 2), err => {
      if (err) return res.status(500).send('Erro ao salvar favoritos');
      res.sendStatus(200);
    });
  });
});

// DELETE favorito
router.delete('/', (req, res) => {
  const { id } = req.body;

  fs.readFile(FAVORITOS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Erro ao ler favoritos');
    let lista = JSON.parse(data);
    if (!Array.isArray(lista)) lista = [lista];

    const atualizada = lista.filter(item => item.id !== id);

    fs.writeFile(FAVORITOS_PATH, JSON.stringify(atualizada, null, 2), err => {
      if (err) return res.status(500).send('Erro ao salvar favoritos');
      res.sendStatus(200);
    });
  });
});


module.exports = router;
