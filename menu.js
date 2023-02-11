const { app, dialog, BrowserWindow, Menu, remote } = require("electron");
const log = require("electron-log");
const Store = require("electron-store");
const unzipper = require("unzipper");
const request = require("request");
const isWindows = process.platform === "win32";
const debug = /--debug/.test(process.argv[2]);
const path = require("path");
const fs = require("fs");
var childWindow;
var aboutModal;
const is_local = app.getName() == "Electron" ? true : false;
const isDevelopment = process.env.NODE_ENV !== "production";
const store = new Store()
var appDirName = store.get("dirName");

const posPath = isDevelopment
  ? path.join(__dirname, "project/" + appDirName)
  : path
      .join(app.getAppPath(), "project/" + appDirName)
      .replace("app.asar", "");

module.exports = {
  setMainMenu,
};

function bahasa(text) {
  return text;
}
function setMainMenu(mainWindow, store) {
  //const host = store.get('hostName');
  const host = "http://localhost:3344/views";
  const template = [
    {
      label: bahasa("Home"),
      submenu: [
        {
          label: "Login",
          click() {
            loadPage(mainWindow, `${host}/home/index`);
          },
        },
        {
          label: "Logout",
          click() {
            store.set("isLogin",false);
            loadPage(mainWindow, `${host}/home/logout`);
          },
        },
      ],
    },

    {
      label: "Dashboard",
      click() {
        loadMain(mainWindow, `${host}/dashboard/dashboard`);
      },
    },
    {
      label: bahasa("Master"),
      submenu: [
        // {
        //   label: "Master Barang",
        //   click() {
        //     loadMain(mainWindow, `${host}/barang/index`);
        //   },
        // },
        {
          label: "Master Barang",
          click() {
            loadMain(mainWindow, `${host}/barang/index`);
          },
        },
        // {
        //   label: "Master Jasa",
        //   click() {
        //     loadMain(mainWindow, `${host}/jasa/index`);
        //   },
        // },
        { type: "separator" },
        {
          label: "Master Kategori",
          click() {
            loadMain(mainWindow, `${host}/kategori/index`);
          },
        },
        {
          label: "Master Satuan",
          click() {
            loadMain(mainWindow, `${host}/satuan/index`);
          },
        },
        // {
        //   label: "Master Merk",
        //   click() {
        //     loadMain(mainWindow, `${host}/merk/index`);
        //   },
        // },
        {
          type: "separator",
        },
        {
          label: "Master Pelanggan",
          click() {
            loadMain(mainWindow, `${host}/pelanggan/index`);
          },
        },
        {
          label: "Master Supplier",
          click() {
            loadMain(mainWindow, `${host}/supplier/index`);
          },
        },
        {
          label: "Master User",
          click() {
            loadMain(mainWindow, `${host}/user/index`);
          },
        },
        // {
        //   label: "Master Salesman",
        //   click() {
        //     loadMain(mainWindow, `${host}/salesman/index`);
        //   },
        // },
        // {
        //   label: "Master Kendaraan",
        //   click() {
        //     loadMain(mainWindow, `${host}/kendaraan/index`);
        //   },
        // },
      ],
    },
    {
      label: bahasa("Transaksi"),
      submenu: [
        {
          label: "Penjualan POS (Kasir)",
          click() {
            loadMain(mainWindow, `${host}/penjualan/pos`);
          },
        },
        {
          label: "Transaksi Penjualan",
          click() {
            loadMain(mainWindow, `${host}/penjualan/index`);
          },
        },
        {
          label: "Data Penjualan",
          click() {
            loadMain(mainWindow, `${host}/penjualan/tb_penjualan`);
          },
        },
        {
          label: "Retur Penjualan",
          click() {
            loadMain(mainWindow, `${host}/retur/penjualan`);
          },
        },
        { type: "separator" },
        {
          label: "Tambah Pembelian",
          click() {
            loadMain(mainWindow, `${host}/pembelian/pos`);
          },
        },
        {
          label: "Transaksi Pembelian",
          click() {
            loadMain(mainWindow, `${host}/pembelian/index`);
          },
        },
        {
          label: "Data Pembelian",
          click() {
            loadMain(mainWindow, `${host}/pembelian/tb_pembelian`);
          },
        },
      ],
    },
    {
      label: "Laporan",
      submenu: [
        // {
        //   label: "Laporan Stok Barang",
        //   click() {
        //     loadMain(mainWindow, `${host}/laporan/stok`);
        //   },
        // },
        {
          label: "Laporan Penjualan",
          click() {
            loadMain(mainWindow, `${host}/laporan/penjualan`);
          },
        },

        {
          label: "Laporan Pembelian",
          click() {
            loadMain(mainWindow, `${host}/laporan/pembelian`);
          },
        },
  
      ],
    },
    {
      label: "Pengaturan",
      submenu: [
        {
          label: "Pengaturan Toko",
          click() {
            loadMain(mainWindow, `${host}/pengaturan/toko`);
          },
        },
        // {
        //   label: "Pengaturan Kasir",
        //   click() {
        //     loadMain(mainWindow, `${host}/pengaturan/kasir`);
        //   },
        // },
        {
          label: "Pengaturan Cetak",
          click() {
            loadMain(mainWindow, `${host}/pengaturan/cetak`);
          },
        },
        {
          label: "Hapus Transaksi",
          click() {
            loadMain(mainWindow, `${host}/pengaturan/hapus_transaksi`);
          },
        },
        {
          label: "Cetak Barcode",
          click() {
            loadMain(mainWindow, `${host}/cetak/barcode`);
          },
        },

        {
          label: bahasa("Database"),
          submenu: [
            {
              label: bahasa("Backup Database"),
              click() {
                showBackup(mainWindow, store);
              },
            },
            {
              label: bahasa("Restore Database"),
              click() {
                showRestore(mainWindow, store);
              },
            },
          ],
        },
        {
          label: "Network",
          submenu: [
            {
              label:
                bahasa("Ubah host ke ") +
                " " +
                (host == "0.0.0.0" ? "127.0.0.1" : "0.0.0.0"),
              click() {
                // if (store.get("license_status") != "active") {
                //   getTrial(mainWindow, store);
                //   return false;
                // }
                let hostname = host == "0.0.0.0" ? "127.0.0.1" : "0.0.0.0";
                store.set("hostName", hostname);
                app.relaunch();
                app.exit(0);
              },
            },
            {
              label: bahasa("Jaringan"),
              click() {
                getNetwork(mainWindow, store);
              },
            },
          ],
        },
        {
          label: "Maintenance",
          click() {
            loadMain(mainWindow, `${host}/system/maintenance`);
          },
        },
        {
          label: "Lisensi",
          click() {
            loadMain(mainWindow, `${host}/system/license`);
          },
        },
      ],
    },

    {
      label: "Tampilan",
      submenu: [
        // { role: "reload", label: bahasa("Reload") },
        // { role: 'forcereload', label: bahasa('Paksa reload') },
        { type: "separator" },
        { role: "resetzoom", label: bahasa("Reset zoom") },
        { role: "zoomin", label: bahasa("Zoom in") },
        { role: "zoomout", label: bahasa("Zoom out") },
        { type: "separator" },
        { role: "togglefullscreen", label: bahasa("Toggle fullscreen") },
        {role: 'toggledevtools'},

      ],
    },
    { role: "reload", label: bahasa("Reload") },
  ];

  if (process.platform === "darwin") {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: "about", label: bahasa("Tentang") },
        { type: "separator" },
        { role: "services", label: bahasa("Services"), submenu: [] },
        { type: "separator" },
        { role: "hide", label: bahasa("Hide") },
        { role: "hideothers", label: bahasa("Hide others") },
        { role: "unhide", label: bahasa("Unhide") },
        { type: "separator" },
        { role: "quit", label: bahasa("Quit") },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
function loadMain(mainWindow, url) {
  const Store = require("electron-store");
  const store = new Store();


  if (mainWindow) {
    mainWindow.isVisible() ? mainWindow.focus() : mainWindow.show();
    const noLogin = store.get("base_url") + "views/home/unauthorized";
    const noActive = store.get("base_url") + "views/system/license";
  //   if(!store.get('license_active')){
  //     mainWindow.loadURL(noActive);
  //     return false;
  // }

    if (store.get("isLogin")) {
      mainWindow.loadURL(url);
    } else {
      mainWindow.loadURL(noLogin);
    }
    // if (isDevelopment) {
    //   mainWindow.webContents.openDevTools();
    // }
    console.log(store.get("isLogin"));
  }
}
function loadPage(mainWindow, url) {
  const Store = require("electron-store");
  const store = new Store();
  if (mainWindow) {
    mainWindow.isVisible() ? mainWindow.focus() : mainWindow.show();
    const noLogin = store.get("base_url") + "views/home/index";
    mainWindow.loadURL(url);
    // if (isDevelopment) {
    //   mainWindow.webContents.openDevTools();
    // }
  }
}

function loadModal(mainWindow, url) {
  const win = new BrowserWindow({
    title: "Application",
    width: 1280,
    height: 800,
    resizable: true,
    // modal: true,
    // transparent: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: "#ffffff",
  });

  const Store = require("electron-store");
  const store = new Store();
  const noLogin = store.get("base_url") + "views/home/unauthorized";
  if (store.get("isLogin")) {
    win.loadURL(url);
  } else {
    win.loadURL(noLogin);
  }
  console.log(store.get("isLogin"));
  win.setMenuBarVisibility(false);
}

function date_format(date) {
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    "-" +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function pad(number) {
  return ((number < 10 ? "0" : "") + number).toString();
}
function showBackup(mainWindow, store) {
  // if(store.get('license_status') != "active"){
  //     getTrial(mainWindow,store);
  //     return false;
  // }
  var today = new Date();
  var date = date_format(today);
  dialog
    .showSaveDialog({
      title: "Pilih file untuk disimpan",
      defaultPath: path.join(
        app.getPath("downloads"),
        "backup-" + appDirName + "-" + date + ".db"
      ),
      // defaultPath: path.join(__dirname, '../assets/'),
      buttonLabel: "Simpan",
      // Restricting the user to only Text Files.
      filters: [
        {
          name: "Database File",
          extensions: ["db"],
        },
      ],
      properties: [],
    })
    .then((file) => {
      // Stating whether dialog operation was cancelled or not.
      console.log(file.canceled);
      if (!file.canceled) {
        console.log(file.filePath.toString());
        // Creating and Writing to the sample.txt file
        // const data = new Uint8Array(Buffer.from(posPath + '/db/database.db'));
        const data = fs.createReadStream(posPath + "/db/database.db");
        fs.createReadStream(posPath + "/db/database.db").pipe(
          fs.createWriteStream(file.filePath)
        );
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function showRestore(mainWindow, store) {
  // if(store.get('license_status') != "active"){
  //     getTrial(mainWindow,store);
  //     return false;
  // }
  dialog
    .showOpenDialog({
      defaultPath: path.join(app.getPath("downloads"), "*.db"),
      filters: [{ name: "Database File", extensions: ["db"] }],
    })
    .then((file) => {
      console.log(file);
      if (!file.canceled) {
        const openfile = file.filePaths[0];

        fs.createReadStream(openfile).pipe(
          fs.createWriteStream(posPath + "/db/database.db")
        );
        mainWindow.loadURL(`file://${__dirname}/pos.html`);
        console.log("berhasil");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
function getNetwork(mainWindow, store) {
  const win = new BrowserWindow({
    title: "Jaringan",
    width: 800,
    height: 600,
    resizable: false,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true,
    },
    modal: true,
    transparent: false,
    backgroundColor: "#282C34",
  });
  win.loadURL(`file://${__dirname}/network.html`);
  win.setMenuBarVisibility(false);
}
