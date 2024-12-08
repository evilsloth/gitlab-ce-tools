const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const log = require('electron-log');
const Store = require('electron-store');

const UPDATE_MENU_ITEM_ID = 'UPDATE_MENU_ITEM';

let win;
let menu;
let updateMenuItem;

const UPDATE_RUN_ON_STARTUP = 1;
const UPDATE_RUN_FROM_MENU = 2;
let updateRunFrom;

const store = new Store();
setAppOptions();

app.on('ready', () => {
    createWindow();
    autoUpdater.autoDownload = false
    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = 'info';
    if (app.isPackaged) {
        updateRunFrom = UPDATE_RUN_ON_STARTUP;
        updateMenuItem = menu.getMenuItemById(UPDATE_MENU_ITEM_ID);
        updateMenuItem.enabled = false;
        autoUpdater.checkForUpdates();
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

// allow open external links in webview (electron-tabs) context
app.on('web-contents-created', (_, webContents) => {
    webContents.setWindowOpenHandler(({url}) => {
        shell.openExternal(url);
        return {action : "deny"};
    });
});

ipcMain.on('SETTINGS_CHANGED', (event, electronSettings) => {
    const unsafeRequestsEnabled = store.get('enableUnsafeRequests');
    if (electronSettings && electronSettings.enableUnsafeRequests !== unsafeRequestsEnabled) {
        store.set('enableUnsafeRequests', electronSettings.enableUnsafeRequests);
        dialog.showMessageBox(win, {
            title: 'Restart required',
            message: 'You must restart the application for Allow unsafe request setting to be applied!',
            buttons: ['Restart now', 'Restart later']
        }).then(res => {
            const buttonIndex = res.response;
            if (buttonIndex === 0) {
                app.relaunch();
                app.quit();
            }
        });;
    }
});

autoUpdater.on('update-available', (updateInfo) => {
    dialog.showMessageBox(win, {
        type: 'question',
        title: 'New version found',
        message: `Current version: ${app.getVersion()}\nNew version: ${updateInfo.version}\nDo you want to update now?`,
        buttons: ['Yes', 'No']
    }).then(res => {
        const buttonIndex = res.response;
        if (buttonIndex === 0) {
            autoUpdater.downloadUpdate();
            dialog.showMessageBox(win, {
                title: 'Downloading updates',
                message: 'Updates are being downloaded in background. You will be notified when they are ready to install.'
            });
        }
        else {
            updateMenuItem.enabled = true;
            updateMenuItem = null;
        }
    });
});

autoUpdater.on('update-not-available', () => {
    updateMenuItem.enabled = true;
    updateMenuItem = null;

    if (updateRunFrom !== UPDATE_RUN_ON_STARTUP) {
        dialog.showMessageBox(win, {
            title: 'No updates found',
            message: 'Current version is up to date.'
        });
    }
});

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(win, {
        title: 'Install Updates',
        message: 'Updates downloaded, application will quit for update...'
    }).then(() => {
        setImmediate(() => autoUpdater.quitAndInstall());
    });
});

autoUpdater.on('error', (error) => {
    updateMenuItem.enabled = true;
    updateMenuItem = null;

    if (updateRunFrom !== UPDATE_RUN_ON_STARTUP) {
        dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString());
    }
});

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
                    click() { shell.openExternal('https://github.com/evilsloth/gitlab-ce-tools') }
                },
                {
                    label: 'Search Issues',
                    click() { shell.openExternal('https://github.com/evilsloth/gitlab-ce-tools/issues') }
                },
                {
                    id: UPDATE_MENU_ITEM_ID,
                    label: 'Check for updates',
                    click(menuItem) {
                        updateMenuItem = menuItem;
                        updateMenuItem.enabled = false;
                        updateRunFrom = UPDATE_RUN_FROM_MENU;
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
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        }
    });
    menu = buildMenu();

    Menu.setApplicationMenu(menu);

    // load the index file from dist folder
    win.loadFile(path.join(__dirname, 'index.html'));

    // The following is optional and will open the DevTools:
    // win.webContents.openDevTools()

    win.on('closed', () => {
        win = null;
    });
}

function setAppOptions() {
    if (store.get('enableUnsafeRequests')) {
        log.warn('ignore-certificate-errors options is enabled!');
        app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
    }
}
