// sistema-web-backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');

const getFirebirdOptions = require('./config/firebirdOptions');
const empresaRoutes = require('./routes/empresa');
const favoritosRoutes = require('./routes/favoritos');
const orcamentoVendaRoutes = require('./routes/orcamentoVenda');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const firebirdOpts = getFirebirdOptions();
app.use((req, res, next) => {
  req.firebirdOpts = firebirdOpts;
  next();
});

// 🔧 Rota que retorna o IP local do servidor
app.get('/host-ip', (req, res) => {
  const interfaces = os.networkInterfaces();
  let ip = '';

  for (let iface of Object.values(interfaces)) {
    for (let config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        ip = config.address;
        break;
      }
    }
    if (ip) break;
  }

  res.json({ ip });
});

// Rotas de dados
app.use('/empresa', empresaRoutes);
app.use('/favoritos', favoritosRoutes);
app.use('/orcamentoVenda', orcamentoVendaRoutes);

// Servir frontend React
app.use(express.static(path.join(__dirname, '../sistema-web-frontend/build')));
app.get(/^\/(?!empresa|favoritos|host-ip).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../sistema-web-frontend/build/index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${port}`);
});
