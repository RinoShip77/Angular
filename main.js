const { app, BrowserWindow, Notification } = require('electron');
const url = require('url');
const path = require('path');
const appTitle = 'Electrolib';
const appIcon = path.join(__dirname, '/src/assets/images/logos/ApplicationIcon6.png');

function showNotification() {
  // while (BrowserWindow.getAllWindows().length !== 0) {
  //   if (localStorage.getItem('notification')) {
  //     let body = localStorage.getItem('notification');
  //     console.log(body);

  //     new Notification({
  //       title: appTitle,
  //       body: 'Test',
  //       icon: appIcon
  //     }).show()
  //   }
  //   localStorage.removeItem('notification');
  // }
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

app.setAppUserModelId(appTitle);
app.on('ready', onReady);
// app.whenReady().then(onReady).then(showNotification);