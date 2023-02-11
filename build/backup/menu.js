const { app, dialog, BrowserWindow, Menu } = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

const isWindows = process.platform === 'win32';
const debug = /--debug/.test(process.argv[2]);
const path = require('path');
const config = require('./config');
const fs = require('fs');
var childWindow;
var aboutModal;
var appDirName = config.dirname
var appName = config.name
const is_local = app.getName() == 'Electron' ? true : false;
const posPath = is_local
    ? path.join(__dirname, 'project/'+appDirName)
    : path.join(app.getAppPath(), 'project/'+appDirName).replace('app.asar', '');
// const localePath = is_local
//     ? path.join(__dirname, 'translations')
//     : path.join(app.getAppPath(), 'translations').replace('app.asar', 'app.asar.unpacked');
// const i18n = new (require(localePath + '/i18n'))();

module.exports = {
    setMainMenu,
    showUpdate
};

function bahasa(text){
    return text;
}
function setMainMenu(mainWindow, store) {
    const host = store.get('hostName');
    const template = [
        {
            label: bahasa('File'),
            submenu: [
                {
                    label: bahasa('Dashboard'),
                    accelerator: 'CmdOrCtrl+H',
                    click() {
                        dashboard(mainWindow);
                    },
                },
                {
                    label: bahasa('Reset License'),
                    click() {
                        resetLicense(mainWindow,store);

                    },
                },    
                { type: 'separator' },
                {
                    label: isWindows ? bahasa('Exit') : bahasa('Quit') + ' ' + app.getName(),
                    accelerator: isWindows ? 'Alt+F4' : 'CmdOrCtrl+Q',
                    click() {
                        app.quit();
                    },
                },
            ],
        },
        
        {
            label: bahasa('License'),
            click() {
                if(store.get('license_status') == "trial"){
                    license(mainWindow);
                }else{ 
                    getLicense(mainWindow,store);
                }

            },
        },  
        {
            label: 'Network',
            submenu: [

                {
                    label: bahasa('Buka di browser'),
                    click() {
                        if(store.get('license_status') != "active"){
                            getTrial(mainWindow,store);
                            return false;
                        }
                        require('electron').shell.openExternal('http://localhost:'+config.port);

                    },
                },
                {
                    label: bahasa('Ubah host ke ') + ' ' + (host == '0.0.0.0' ? '127.0.0.1' : '0.0.0.0'),
                    click() {
                        if(store.get('license_status') != "active"){
                            getTrial(mainWindow,store);
                            return false;
                        }
                        let hostname = host == '0.0.0.0' ? '127.0.0.1' : '0.0.0.0';
                        store.set('hostName', hostname);
                        app.relaunch(); 
                        app.exit(0);
                    },
                }, 
                {
                    label: bahasa('Jaringan') ,
                    click() {
                        getNetwork(mainWindow,store);

                    },
                },  
            ],
        },
        {
            label: bahasa('Lihat'),
            submenu: [
                { role: 'reload', label: bahasa('Reload') },
                { role: 'forcereload', label: bahasa('Paksa reload') },
                // {role: 'toggledevtools'},
                { type: 'separator' },
                { role: 'resetzoom', label: bahasa('Reset zoom') },
                { role: 'zoomin', label: bahasa('Zoom in') },
                { role: 'zoomout', label: bahasa('Zoom out') },
                { type: 'separator' },
                { role: 'togglefullscreen', label: bahasa('Toggle fullscreen') },
            ],
        },
        {
            label: bahasa('Database'),
            submenu: [
                {
                    label: bahasa('Backup Database'),
                    click() {
                        showBackup(mainWindow,store);
                    },
                },
                {
                    label: bahasa('Restore Database'),
                    click() {
                        showRestore(mainWindow,store);
                    },
                },
            ]
        },
        {
            role: 'help',
            label: bahasa('Help'),
            submenu: [
                {
                    label: bahasa('Tentang') + ' ' + appName,
                    click() {
                        showAbout(mainWindow,store);
                    },
                },
                {
                    label: bahasa('Update Software'),
                    click() {
                        showUpdate(mainWindow,store);
                    },
                },
                {
                    label: bahasa('Informasi'),
                    click() {
                        require('electron').shell.openExternal(config.productUrl);
                    },
                },
            ],
        },
    ];

    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about', label: bahasa('About') },
                { type: 'separator' },
                { role: 'services', label: bahasa('Services'), submenu: [] },
                { type: 'separator' },
                { role: 'hide', label: bahasa('Hide') },
                { role: 'hideothers', label: bahasa('Hide others') },
                { role: 'unhide', label: bahasa('Unhide') },
                { type: 'separator' },
                { role: 'quit', label: bahasa('Quit') },
            ],
        });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

function dashboard(mainWindow) {
    if (mainWindow) {
        mainWindow.isVisible() ? mainWindow.focus() : mainWindow.show();
        mainWindow.loadURL(`file://${__dirname}/pos.html`);
        // mainWindow.webContents.openDevTools();
    }
}

function getLicense(mainWindow,store){
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'License',
        message: `Status : ` + store.get('license_status'),
        detail: ` Kode Serial : ` + store.get("license_serial") + `\n License Key : ` +store.get("license_key"),
        buttons: ['Close'],
    });
}

function getTrial(mainWindow,store){
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'License',
        message: `Status Lisensi Anda : ` + store.get('license_status'),
        detail: 'Mohon maaf! Anda harus mengaktifkan lisensi untuk menggunakan fitur ini!',
        buttons: ['Close'],
    });
}

function resetLicense(mainWindow,store){
    store.set("license_serial","")
    store.set("license_key","")
    store.set("license_status","trial")
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'License',
        message: `Reset License`,
        detail: `Lisensi telah direset!`,
        buttons: ['Close'],
    })
    .then((res) => {
        let buttonClicked = res.response;
        switch (buttonClicked) {
          case 0:
            app.relaunch(); 
            app.exit(0);
            break;
        }
      })
      .catch((err) => {
        console.error(err);
      });
}

function license(mainWindow) {
    const win = new BrowserWindow({ 
        title: "License",
        width: 800, 
        height: 600,
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
    // if (mainWindow) {
    //     mainWindow.isVisible() ? mainWindow.focus() : mainWindow.show();
    //     mainWindow.loadURL(`file://${__dirname}/license.html`);
    //     mainWindow.webContents.openDevTools();
    // }
}



function showAbout(mainWindow,store) {

    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'About ' + appName,
        message: ''+appName+'\n(Windows Installer)',
        detail: `
${bahasa(''+appName+'')}
Version : ${app.getVersion()}
Lisensi : ${store.get("license_status")}

${bahasa('© '+config.author)}
${bahasa('All rights reserved.')}
        `,
        buttons: ['Close'],
    });
}
function date_format(date) {
    return (
        date.getFullYear().toString() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        '-' +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds())
    );
}
function pad(number) {
    return ((number < 10 ? '0' : '') + number).toString();
}
function showBackup(mainWindow,store) {
    if(store.get('license_status') != "active"){
        getTrial(mainWindow,store);
        return false;
    }
    var today = new Date();
    var date = date_format(today);
      dialog.showSaveDialog({
        title: 'Pilih file untuk disimpan',
        defaultPath: path.join(app.getPath('downloads'), 'Backup-' + date + '.db'),
        // defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Simpan',
        // Restricting the user to only Text Files.
        filters: [
            {
                name: 'Database File',
                extensions: ['db']
            }, ],
        properties: []
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
            console.log(file.filePath.toString());
            // Creating and Writing to the sample.txt file
            // const data = new Uint8Array(Buffer.from(posPath + '/db/database.db'));
            const data = fs.createReadStream(posPath + '/db/database.db')
            fs.createReadStream(posPath + '/db/database.db').pipe(fs.createWriteStream(file.filePath));
        }
    }).catch(err => {
        console.log(err)
    });
    
}

function showRestore(mainWindow,store) {
    if(store.get('license_status') != "active"){
        getTrial(mainWindow,store);
        return false;
    }
    dialog.showOpenDialog(
        {
            defaultPath: path.join(app.getPath('downloads'), '*.db'),
            filters: [{ name: 'Database File', extensions: ['db'] }],
        }).then( file => {
            console.log(file)
            if (!file.canceled) {
                const openfile = (file.filePaths[0]);

                fs.createReadStream(openfile).pipe(fs.createWriteStream(posPath + '/db/database.db'));
                mainWindow.loadURL(`file://${__dirname}/pos.html`);

                console.log("berhasil")
            }
        }).catch(err => {
            console.log(err)
        });
    
}
function getNetwork(mainWindow,store){
    const win = new BrowserWindow({ 
        title: "Jaringan",
        width: 800, 
        height: 600,
        resizable: false,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true
        },
        modal: true,
        transparent: false,
        backgroundColor: "#282C34",
    })
    win.loadURL(`file://${__dirname}/network.html`)
    win.setMenuBarVisibility(false)


}
function showUpdate(mainWindow,store) {

    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update ' + appName,
        message: appName+`\nVersi ${app.getVersion()}`,
        detail: `Mengecek pembaharuan aplikasi memerlukan koneksi internet.
Peringatan! Mengupdate aplikasi akan menghapus database saat ini.
Sebelum melakukan update sebaiknya Anda melakukan backup database terlebih dahulu. `,
        buttons: ['Backup Database','Update Sekarang', 'Batal'],
        defaultId: 0, // bound to buttons array
        cancelId: 1 // bound to buttons array
        })
        .then(result => {
            if(result.response===0){
                if(store.get('license_status') != "active"){
                    getTrial(mainWindow,store);
                    return false;
                }
                var today = new Date();
                var date = date_format(today);
                dialog.showSaveDialog({
                    title: 'Pilih file untuk disimpan',
                    defaultPath: path.join(app.getPath('downloads'), 'Backup-' + date + '.db'),
                    // defaultPath: path.join(__dirname, '../assets/'),
                    buttonLabel: 'Simpan',
                    // Restricting the user to only Text Files.
                    filters: [
                        {
                            name: 'Database File',
                            extensions: ['db']
                        }, ],
                    properties: []
                }).then(file => {
                    console.log(file.canceled);
                    if (!file.canceled) {
                        
                        if(store.get('license_status') != "active"){
                            getTrial(mainWindow,store);
                            return false;
                        }
                        console.log(file.filePath.toString());
                        // Creating and Writing to the sample.txt file
                        // const data = new Uint8Array(Buffer.from(posPath + '/db/database.db'));
                        const data = fs.createReadStream(posPath + '/db/database.db')
                        fs.createReadStream(posPath + '/db/database.db').pipe(fs.createWriteStream(file.filePath));
                    }
                }).catch(err => {
                    console.log(err)
                });
                

              
            }
          else if (result.response === 1) {
            // bound to buttons array
            console.log("Default button clicked.");
            autoUpdater.checkForUpdatesAndNotify();
            autoUpdater.on('update-available', (info) => {
                var releaseNotes = info.releaseNotes.replace(/<br\s*[\/]?>/gi, "\n").replace(/<[^>]+>/g, '');
                mainWindow.webContents.send('update_available');
                dialog.showMessageBox(mainWindow, {
                    type: 'info',
                    title: 'Update Software',
                    message: 'Versi :' +info.version,
                    detail: `
Update Terbaru telah tersedia.
Version : ${info.version}
Release Date : ${info.releaseDate}
Release Notes : 
${releaseNotes}
`,
                    buttons: ['Tutup'],
                    })

              });

          } else if (result.response === 1) {
            // bound to buttons array
            console.log("Cancel button clicked.");
            
          }
        })




}
