const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');
const log = require('electron-log');

let win;

function buildMenu() {
    var menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                { role: 'quit' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click() { shell.openExternalSync('https://github.com/evilsloth/gitlab-ce-tools') }
                },
                {
                    label: 'Search Issues',
                    click() { shell.openExternalSync('https://github.com/evilsloth/gitlab-ce-tools/issues') }
                },
                {
                    label: 'Version',
                    click() { dialog.showMessageBox({type: 'info', 'title': 'Version', message: app.getVersion()}) }
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu);
}

function createWindow() {
  win = new BrowserWindow({ width: 1280, height: 720 });
  buildMenu();

  // load the index file from dist folder
  win.loadFile(path.join(__dirname, `/dist/gitlab-ce-tools/index.html`));

  // The following is optional and will open the DevTools:
  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
    createWindow();
    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = 'info';
    autoUpdater.checkForUpdatesAndNotify();
});

// on macOS, closing the window doesn't quit the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// initialize the app's main window
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
