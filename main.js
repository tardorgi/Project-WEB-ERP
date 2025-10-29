// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'sistema-web-frontend', 'build', 'icons', 'lts_logo.png'), // Ícone do Electron
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Aguarde o backend subir antes de carregar a URL
  const startUrl = 'http://localhost:3001';
  mainWindow.loadURL(startUrl);
}

app.whenReady().then(() => {
  // Inicia o backend Node.js como processo filho
  backendProcess = spawn(
    process.execPath,
    [path.join(__dirname, 'sistema-web-backend', 'server.js')],
    { stdio: 'inherit' }
  );

  // Aguarde o backend estar pronto antes de abrir a janela
  setTimeout(createWindow, 2000); // 2 segundos (ajuste se necessário)
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    if (backendProcess) backendProcess.kill();
    app.quit();
  }
});
