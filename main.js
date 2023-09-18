const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

function onReady() {
  win = new BrowserWindow({ width: 1500, height: 900 }) // TODO: Change the application icon
  win.loadURL(url.format({
    pathname: path.join(
      __dirname,
      'dist/electrolib/index.html'),
    protocol: 'file:',
    slashes: true
  }))
}
app.on('ready', onReady);