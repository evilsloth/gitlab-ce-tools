const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const log = require('electron-log');

const UPDATE_MENU_ITEM_ID = 'UPDATE_MENU_ITEM';

let win;
let menu;
let updateMenuItem;

function buildMenu() {
    let menu = Menu.buildFromTemplate([
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
                    id: UPDATE_MENU_ITEM_ID,
                    label: 'Check for updates',
                    click(menuItem) {
                        updateMenuItem = menuItem;
                        updateMenuItem.enabled = false;
                        autoUpdater.checkForUpdates();
                    }
                },
                {
                    label: 'About',
                    click() { dialog.showMessageBox({
                        type: 'info',
                        'title': 'About',
                        message: `Gitlab CE Tools\nVersion ${app.getVersion()}`
                    }) }
                }
            ]
        }
    ]);
    return menu;
}

function createWindow() {
    win = new BrowserWindow({ width: 1280, height: 720 });
    menu = buildMenu();

    Menu.setApplicationMenu(menu);

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
    autoUpdater.autoDownload = false
    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = 'info';
    if (app.isPacked) {
        autoUpdater.checkForUpdates();
        updateMenuItem = menu.getMenuItemById(UPDATE_MENU_ITEM_ID);
        updateMenuItem.enabled = false;
    }
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



autoUpdater.on('update-available', (updateInfo) => {
    dialog.showMessageBox({
        type: 'info',
        title: 'New version found',
        message: `Current version:${app.getVersion()}\nNew version:${updateInfo.version}\nDo you want to update now?`,
        buttons: ['Yes', 'No']
    }, (buttonIndex) => {
        if (buttonIndex === 0) {
            autoUpdater.downloadUpdate();
        }
        else {
            updateMenuItem.enabled = true;
            updateMenuItem = null;
        }
    });
});

autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
        title: 'No updates found',
        message: 'Current version is up to date.'
    });
    updateMenuItem.enabled = true;
    updateMenuItem = null;
});

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        title: 'Install Updates',
        message: 'Updates downloaded, application will be quit for update...'
    }, () => {
        setImmediate(() => autoUpdater.quitAndInstall());
    });
});

autoUpdater.on('error', (error) => {
    dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString());
});
