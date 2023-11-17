const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const appTitle = 'Electrolib';
const appIcon = path.join(__dirname, '/src/assets/images/logos/applicationIcon.png');

function onReady() {
  win = new BrowserWindow({
    icon: appIcon, // TODO: Change the application icon
    width: 1500,
    height: 800,
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

app.setAppUserModelId(appTitle);
app.on('ready', onReady);