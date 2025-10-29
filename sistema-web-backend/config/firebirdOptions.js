// back‑end/config/firebirdOptions.js

const fs   = require('fs');
const path = require('path');
const ini  = require('ini');

function getFirebirdOptions() {
  const iniPath = path.join(__dirname, '..', '..', 'LTS.INI');
  const cfg     = ini.parse(fs.readFileSync(iniPath, 'utf-8'));
  const fdbLts  = cfg.DATABASE.FDB_LTS;
  if (!fdbLts) throw new Error('Chave FDB_LTS não encontrada em [DATABASE]');

  // --- pega tudo até o primeiro ':' como hostPort e o resto como dbPath:
  const idx       = fdbLts.indexOf(':');
  const hostPort  = fdbLts.substring(0, idx);
  const dbPathRaw = fdbLts.substring(idx + 1);

  // hostPort: "192.168.0.2/3052"
  const [host, port] = hostPort.split('/');

  // dbPathRaw: "S:/LTS/…/"
  const database = dbPathRaw.endsWith('.FDB')
    ? dbPathRaw
    : (dbPathRaw + 'LTS.FDB');

  return {
    host,
    port:     parseInt(port, 10),
    database,
    user:     cfg.DATABASE.FIREBIRD_USER     || 'sysdba',
    password: cfg.DATABASE.FIREBIRD_PASSWORD || 'masterkey',
    role:     null,
    pageSize: 4096,
  };
}

module.exports = getFirebirdOptions;
