// 'use strict';
// const { app, BrowserWindow, Tray } = require('electron');
const {remote, app, BrowserWindow, Menu, protocol, ipcMain,Tray} = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

const debug = /--debug/.test(process.argv[2]);
const php = require('gulp-connect-php');
const config = require('./config');
const path = require('path');
const Store = require("electron-store");
const { setMainMenu,showUpdate } = require('./menu');
const platform = process.platform;
let mainWindow;
var appName = "DIVAPOS"
var appDirName = config.dirname
var express = require('express');
var cors = require('cors');

var phpIni = '';
const is_local = app.getName() == 'Electron' ? true : false;
const isDevelopment = process.env.NODE_ENV !== 'production'

const phpPath = is_local
    ? path.join(__dirname, 'project/php')
    : path.join(app.getAppPath(), 'project/php').replace('app.asar', '');
const posPath = isDevelopment
    ? path.join(__dirname, 'build/project/'+appDirName)
    : path.join(app.getAppPath(), 'project/'+appDirName).replace('app.asar', '');

const store = new Store({
    configName: 'user-preferences',
    defaults: {
        hostName: '127.0.0.1',
        windowBounds: { width: 1024, height: 700 },
    },
});

const _MS_PER_DAY = 1000 * 60 * 60 * 24;


function addDays(date, days) {
    // menambah hari ke dalam tanggal
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
  }

function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


const date = new Date();
const newDate = addDays(date, 30);
//Jika license_date belum ada maka diset license_date = dateNow + 30 hari
store.get("license_date") || store.set("license_date", newDate);
store.get("license_status") || store.set("license_status", "trial");
// if(!store.get("license_status")){
//     store.set("license_status","trial")
// }

const locale = "id-ID";
//const now = new Date().toLocaleString(locale, {timeZone: "Asia/Jakarta"});
const now = new Date();
const license_date = new Date(store.get("license_date")).toLocaleString(locale, {timeZone: "Asia/Jakarta"});
const date_lic = new Date(store.get("license_date"));
const cal_trial = (dateDiffInDays(new Date(), new Date(store.get("license_date"))));


// Jika tanggal sekarang (now) <= license_date -> license_status = trial
// Jika tanggal sekarang (now) > license_date -> license_status = unregistered
var license_status ;
if(now <= date_lic){
    if(store.get("license_status") =='active'){
        license_status = ''
    }else{
        license_status = 'trial'

    }
}else{
    if(store.get("license_status") =='active'){
        license_status = ''
    }else{
        license_status = 'unregistered'

    }
}


console.log(date_lic )
console.log(now)
console.log(license_status)

var exApp = express();
exApp.use(cors());

exApp.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});


exApp.get('/license', function(req, res) {
  var license_data=[{
    "license_trial":cal_trial,
    "license_status":license_status,
    "license_serial":store.get("license_serial"),
    "license_key":store.get("license_key"),
  }];
  res.setHeader('Content-Type', 'application/json');
  var getData =  JSON.stringify(license_data)
  res.send(getData) 

});

exApp.get('/config', function(req, res) {
  var license_data=[{
    "db_file":__dirname+"\\project\\database\\database.db",
  }];
  
  res.setHeader('Content-Type', 'application/json');
  var getData =  JSON.stringify(license_data)
  res.send(getData) 
 
});

exApp.get('/unregistered', function(req, res) {
    res.send(`<!DOCTYPE html> <html> <head> <meta charset=utf-8> <title>Jaringan Aktif</title> <style media=screen>html,body{margin:0;height:100vh;background-color:#FFF}.content{width:100%;height:100%;display:flex;text-align:center;background:#eaecef;align-content:center;flex-direction:column;justify-content:center}#info{width:100%;max-width:500px;min-width:250px;font-size:1.2em;padding:10px 20px;margin:10px auto;text-align:center;border-radius:8px;border:1px solid rgba(0,0,0,.3);font-family:Arial,Helvetica,sans-serif}.full-height{height:100vh}.flex-center{display:flex;align-items:center;justify-content:center}.position-ref{position:relative}</style> </head> <body> <div class="flex-center position-ref full-height"> <div class=content id=activate> <div id=info><h3>Versi Trial Anda sudah habis! </h3>Silakan melakukan aktivasi lisensi untuk menggunakan software ini secara penuh.</div> </div> </div> </body> </html>`);

 
});

exApp.listen(3040);

// store.delete("license_status")
// const exec = require('child_process').exec;
// function execute(command, callback) {
//     exec(command, (error, stdout, stderr) => {
//         callback(stdout);
//     });
// };

console.log(isDevelopment)
const iconPath = path.join(__dirname, 'assets/icons');
var trayIns, trayImage, trayIcon, phpExe;

if (platform == 'darwin') {
    trayImage = iconPath + '/mac/icon.icnz';
    phpExe = path.join(phpPath + '/mac/php');
    phpIni = path.join(phpPath + '/mac/php.ini');
} else if (platform == 'win32') {
    trayImage = iconPath + '/win/icon.ico';
    phpExe = path.join(phpPath + '/win/php.exe');
    phpIni = path.join(phpPath + '/win/php.ini');
}

const port = config.port;
const hostname = store.get('hostName');
const startPHP = () => {
    // console.log(port, posPath, phpExe, phpIni);
    php.server({ hostname: hostname, port: port, base: posPath, bin: phpExe, ini: phpIni });
    // execute(`cd ${posPath} && ${phpExe} -S 0.0.0.0:${port} index.php`, (o) => console.log(o));
    // execute(`${phpExe} -S 0.0.0.0:${port} -c ${phpIni} -t ${posPath} index.php`, (o) => console.log(o));
    console.log("server start")
};

// start
//     .check(false)
//     .then(res => {
//         startPHP();
//     })
//     .catch(err => {
//         console.log('catch1: ', err);
//         setTimeout(() => {
//             var start = require('./start.js');
//             start
//                 .check(false)
//                 .then(res => {
//                     startPHP();
//                 })
//                 .catch(err => console.log('catch2: ', err));
//         }, 2000);
//     });

const licenseWindow = function() {
    const win = new BrowserWindow({ 
        title: "License",
        width: 700, 
        height: 550,
        resizable: false,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true
        },
        modal: true,
        transparent: false,
        backgroundColor: "#282C34",
    })
    win.loadURL(`file://${__dirname}/license.html`)
    win.setMenuBarVisibility(false)
    // win.webContents.openDevTools();
}
const createWindow = function() {
    let { width, height } = store.get('windowBounds');

    mainWindow = new BrowserWindow({ 
        width: width,
        height: height,
        title: appName,
        icon: trayImage,
        show: false,
        minWidth: 1024,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    mainWindow.on('resize', () => {
        let { width, height } = mainWindow.getBounds();
        store.set('windowBounds', { width, height });
    });

    if(license_status == "unregistered"){
        mainWindow.loadURL(`http://localhost:`+config.express_port+`/unregistered`);
        console.log(config.express_port)
    }else{
        mainWindow.loadURL(`file://${__dirname}/pos.html`);

    }
    // mainWindow.webContents.openDevTools();

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Set Main Menus
    setMainMenu(mainWindow, store);
    // Tray Settings
    if (platform == 'darwin') {
        trayIcon = iconPath + '/png/16x16.png';
    } else if (platform == 'win32') {
        trayIcon = iconPath + '/win/icon.ico';
    }

    trayIns = new Tray(trayIcon);
    if (platform == 'darwin') {
        trayIns.setPressedImage(iconPath + '/png/16x16.png');
    }

    trayIns.on('click', () => {
        if (mainWindow) {
            mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        }
    });

    trayIns.setToolTip(appName);

    // Debug mode --debug
    if (debug) {
        mainWindow.webContents.openDevTools();
        mainWindow.maximize();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        app.quit();
    });
};

// Create browser window

app.on('ready', () => {
    if(license_status!="unregistered"){
        startPHP();
    }
    createWindow();
    // if(store.get("license_status")=="trial"){
    //     licenseWindow();
    // }
    // autoUpdater.checkForUpdatesAndNotify();

});

//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
// log.info('App starting...');

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
  });
  
  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
  });
  
  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
  });
  
  ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });
  
  ipcMain.on('startPHP', () => {
    //startPHP();
    app.quit();
    //console.log("Restart PHP")
  });  
  ipcMain.on('checkUpdate', () => {
    showUpdate(mainWindow, store);
  });

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}
app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.focus();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    } else {
        app.show();
    }
});

app.on('activate-with-no-open-windows', () => {
    if (mainWindow === null) {
        createWindow();
    } else {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    }
});

// Quit when all windows are closed
app.on('window-all-closed', function() {
    if (platform != 'darwin') {
        app.quit();
    }
});

// Before quite close php server
app.on('before-quit', () => {
    php.closeServer();
});

// About content for mac
if (platform == 'darwin') {
    app.setAboutPanelOptions({
        applicationName: appName,
        applicationVersion: '1.0.0',
        copyright: '\n'+appName+' - Aplikasi kasir desktop dikembangkan oleh Exrush.\n\nAll rights reserved.',
        version: '1.0.0',
    });
}
