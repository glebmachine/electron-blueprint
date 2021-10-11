const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    alwaysOnTop: true,
    frame: false,
    backgroundColor: '#ffffff',
    icon: './icon.png',
    webPreferences: {
      nodeIntegration: true  // turn it on to use node features
    }
  });

  setTimeout(function() {
    win.focus();
  }, 2000);


  win.webContents.openDevTools()
  win.loadURL(`file://${__dirname}/index.html`);

  win.webContents.on('dom-ready', () => {
    win.webContents.executeJavaScript(`
      window.reload = () => {
        const electron = require('electron');
        const ipcRenderer = electron.ipcRenderer;
        ipcRenderer.send('reload');
      }
    `);
  });

  ipcMain.on('reload', () => {
    win.loadURL(`file://${__dirname}/index.html`);
  });

  ipcMain.on('devtools', () => {
    win.webContents.openDevTools();
  });

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})
