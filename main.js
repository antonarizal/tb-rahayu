// 'use strict';
// const { app, BrowserWindow, Tray } = require('electron');
const {remote, app, dialog, BrowserWindow, Menu, protocol, ipcMain,Tray} = require('electron');
const log = require('electron-log');
const debug = /--debug/.test(process.argv[2]);
const php = require('gulp-connect-php');
const path = require('path');
const fs = require("fs")
const Store = require("electron-store");
const { setMainMenu,showUpdate } = require('./menu');
const { getLicenseStatus } = require('./license');
const platform = process.platform;
let mainWindow;
var appName = "DIVAPOS"
var express = require('express');
var axios = require('axios');
var cors = require('cors');
const windows = new Set();
const store = new Store({
    configName: 'user-preferences',
    defaults: {
        appName: 'DIVAPOS 3 RETAIL',
        version: app.getVersion,
        dirName: 'ci4',
        base_url: 'http://localhost:3344/',
        expressPort: '3344',
        hostName: '127.0.0.1',
        port: '57696',
        website: "https://exrush.com", 
        author: "PT. EXRUSH DIGITAL NUSANTARA",
        wa1: "085235964310",
        wa2: "085235964310",
        windowBounds: { width: 1024, height: 700 },
        //pengaturan font barcode
        marginTop : 5,
        marginLeft:42,
        textPosition:"top",
        fontSize:"19",
        fontCode:19,
        boxBorder:0,
        barcodeHeight:25,
        boxHeight:24,
        space4Line:0,
        // pengaturan font barcode
        fontSizeNota: 14,
        fontFamilyNota: 'Telidon Hv Regular',
        marginTopNota: 0,
        marginLeftNota: 10,
    },
});
console.log(getLicenseStatus(store))
var appDirName = store.get('dirName')
store.set('isLogin', false);
store.set('hostName', 'localhost');
store.set('port', '5123');
store.set('code', 'RET301');
store.set('license_status', 'ACTIVE');

const addFont =`
@font-face {
    font-family: 'Merchant Copy';
    src: url('/assets/fonts/Merchant Copy.ttf') ;
  }
    @font-face {
     font-family: 'Telidon Hv Regular';
    src: url('/assets/fonts/Telidon Hv Regular.ttf') ;
  }
    @font-face {
    font-family: 'fake receipt';
    src: url('/assets/fonts/fake receipt.ttf') ;
  }`;
const styleNotaPOS =`
<style>
${addFont}
  @page {margin: 0;}
    pre {admin
        top:${store.get("marginTopNota")}px;
        left:${store.get("marginLeftNota")}px;
        font-size:${store.get("fontSizeNota")}px !important;
        font-family: '${store.get("fontFamilyNota")}';
        position:absolute;
        white-space: pre;
        font-weight: normal;
        line-height: 1;
        display:block
    }
</style>`;

// const macaddress = require('macaddress');
// macaddress.one(function(err,mac){
//     let UniqMachineId = store.get("code")
//     + mac.replaceAll(':', '').substr(0, 8).toUpperCase();
//     store.set('kode_registrasi', UniqMachineId);
// });
console.log(store.get("kode_registrasi"));

var phpIni = '';
const is_local = app.getName() == 'Electron' ? true : false;
const isDevelopment = process.env.NODE_ENV !== 'production'

const phpPath = is_local
    ? path.join(__dirname, 'project/php')
    : path.join(app.getAppPath(), 'project/php').replace('app.asar', '');
const posPath = isDevelopment
    ? path.join(__dirname, 'project/'+appDirName)
    : path.join(app.getAppPath(), 'project/'+appDirName).replace('app.asar', '');

    const { exec } = require("child_process");

const port = store.get('port');
const hostname = store.get('hostName');
const startPHP = () => {
    // console.log(port, posPath, phpExe, phpIni);
    php.server({ hostname: hostname, port: port, base: posPath, bin: phpExe, ini: phpIni });
    // exec(`cd ${posPath} && ${phpExe} -S 0.0.0.0:${port} index.php`, (o) => console.log(o));
    exec(`${phpExe} -S 0.0.0.0:${port} -c ${phpIni} -t ${posPath} index.php`, (o) => console.log(o));
    console.log("server start")
    console.log(phpExe)
};

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



const _MS_PER_DAY = 1000 * 60 * 60 * 24;


var exApp = express();
exApp.use(cors());

exApp.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});


exApp.use('/assets', express.static(path.join(__dirname, 'public/assets')))
exApp.use('/plugins', express.static(path.join(__dirname, 'public/plugins')))
exApp.use('/images', express.static(path.join(__dirname, 'public/images')))


// exApp.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/public/index.html'));
// })

exApp.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

exApp.get('/views/:parent/:child', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/views/'+req.params.parent+'/'+req.params.child+'.html'));
    // res.send(req.params.page)
})

exApp.get('/views/:parent/:child/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/views/'+req.params.parent+'/'+req.params.child+'.html'));
    // res.send(req.params.page)
})


exApp.get('/helper/:parent/:child', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/views/'+req.params.parent+'/'+req.params.child));
    // res.send(req.params.page)
})

exApp.get('/cetakNotaPOS', (req, res, next) => {
    var nota = styleNotaPOS;
    nota += `<body onload="window.print();"><pre>${store.get("cetakNotaPOS")}</pre></body>`
    res.send(nota)
})

exApp.listen(store.get('expressPort'));

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
            contextIsolation : false

        }
    });

    mainWindow.on('resize', () => {
        let { width, height } = mainWindow.getBounds();
        store.set('windowBounds', { width, height });
    });

        mainWindow.loadURL(`http://localhost:3344/views/home/index`);
        // if(isDevelopment){
        //     mainWindow.webContents.openDevTools();

        // }

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
    // if(license_status!="unregistered"){
        // startPHP();
    // }
    // startPHP();
    createWindow();


});


// Quit when all windows are closed
app.on('window-all-closed', function() {
    if (platform != 'darwin') {
        app.quit();
    }
});

// Before quite closeclose php server
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

var error = function(error) {
    debugger;
console.error(error);
var msg = {
    /*type : "error",
    title : "Uncaught Exception",
    buttons:["ok", "close"],*/
    width : 400
};

switch (typeof error) {
    case "object":
        msg.title = "Uncaught Exception: " + error.code;
        msg.message = error.message;
        break;
    case "string":
        msg.message = error;
        break;
}
msg.detail = "Please check the console log for more details.";


// ipc.send('electron-toaster-message', msg);
}

process.on('uncaughtException', error);