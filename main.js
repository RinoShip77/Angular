const { app, BrowserWindow, Notification } = require('electron');
const url = require('url');
const path = require('path');
const appIcon = path.join(__dirname, '/src/assets/images/logos/ApplicationIcon6.png');

function showNotification () {
  let body = localStorage.getItem('name');
  console.log(body);

  new Notification({
    title: 'Electrolib',
    body: body,
    icon: appIcon
  }).show()
}

function onReady() {
  win = new BrowserWindow({
    icon: appIcon, // TODO: Change the application icon
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

//app.on('ready', onReady);
app.setAppUserModelId
app.whenReady().then(onReady).then(showNotification)