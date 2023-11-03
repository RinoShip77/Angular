const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

function onReady() {
  win = new BrowserWindow({
    icon: path.join(__dirname, '/src/assets/images/logos/ApplicationIcon5.png'), // TODO: Change the application icon
    width: 1500,
    height: 800,
    resizable: false,
    hasShadow: true,
    autoHideMenuBar: true,
    roundedCorners: true,
    thickFrame: true
  })
  win.loadURL(url.format({
    pathname: path.join(
      __dirname,
      'dist/electrolib/index.html'),
    protocol: 'file:',
    slashes: true
  }))
}
app.on('ready', onReady);